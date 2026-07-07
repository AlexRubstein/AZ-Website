import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthModalProvider } from "@/components/auth/AuthModal";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://azalpinetrail.org"),
  title: {
    default: "Arizona Alpine Trail",
    template: "%s | Arizona Alpine Trail",
  },
  description:
    "Arizona Alpine Trail route map, GPX download, and itinerary options.",
  openGraph: {
    title: "Arizona Alpine Trail",
    description:
      "View the Arizona Alpine Trail route map, download the GPX, and plan itinerary options.",
    url: "https://azalpinetrail.org",
    siteName: "Arizona Alpine Trail",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col">
        {children}
        <Suspense fallback={null}>
          <AuthModalProvider />
        </Suspense>
      </body>
    </html>
  );
}
