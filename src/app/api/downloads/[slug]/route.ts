import { NextResponse } from "next/server";
import {
  PROTECTED_DOWNLOADS_BUCKET,
  getDownloadForStreaming,
} from "@/lib/downloads";
import { createSupabaseAdminClient } from "@/supabase/admin";
import { createSupabaseServerClient } from "@/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";
  const userClient = await createSupabaseServerClient();
  const adminClient = createSupabaseAdminClient();

  if (!userClient || !adminClient) {
    return NextResponse.json({ error: "Downloads are not configured." }, { status: 503 });
  }

  const {
    data: { user },
  } = await userClient.auth.getUser();

  if (!user || !token) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const download = await getDownloadForStreaming(slug);
  const { data: acceptance, error: acceptanceError } = await adminClient
    .from("download_acceptances")
    .select("id")
    .eq("download_file_id", download.id)
    .eq("download_slug", download.slug)
    .eq("user_id", user.id)
    .eq("access_token", token)
    .gt("token_expires_at", new Date().toISOString())
    .single();

  if (acceptanceError || !acceptance) {
    return NextResponse.json({ error: "Download link expired." }, { status: 403 });
  }

  const { data, error } = await adminClient.storage
    .from(PROTECTED_DOWNLOADS_BUCKET)
    .download(download.storage_path);

  if (error || !data) {
    return NextResponse.json(
      { error: "File is not available in protected storage yet." },
      { status: 404 },
    );
  }

  return new NextResponse(data.stream(), {
    headers: {
      "Content-Type": download.content_type,
      "Content-Disposition": `attachment; filename="${download.filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
