"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { "Content-Type": "application/json" },
    });
    setStatus(response.ok ? "success" : "error");
  }

  return (
    <form onSubmit={submit} className="max-w-2xl rounded-sm border border-[#d8ded4] bg-[#fffdf7] p-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">
          First name
          <input name="firstName" required className="min-h-12 rounded-sm border border-[#c8d0c4] bg-white px-3 text-base" />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Last name
          <input name="lastName" required className="min-h-12 rounded-sm border border-[#c8d0c4] bg-white px-3 text-base" />
        </label>
      </div>
      <label className="mt-5 grid gap-2 text-sm font-semibold">
        Email
        <input name="email" type="email" required className="min-h-12 rounded-sm border border-[#c8d0c4] bg-white px-3 text-base" />
      </label>
      <label className="mt-5 grid gap-2 text-sm font-semibold">
        Comment or message
        <textarea name="message" required rows={6} className="rounded-sm border border-[#c8d0c4] bg-white px-3 py-3 text-base" />
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-5 inline-flex min-h-12 items-center rounded-sm bg-[#173d2b] px-6 font-bold text-white disabled:opacity-55"
      >
        {status === "loading" ? "Sending..." : "Submit"}
      </button>
      <p aria-live="polite" className="mt-4 text-sm text-[#5f6c63]">
        {status === "success" ? "Message received. Email delivery can be connected with Resend or another provider." : null}
        {status === "error" ? "Something went wrong. Please try again." : null}
      </p>
    </form>
  );
}
