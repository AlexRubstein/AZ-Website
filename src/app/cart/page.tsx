import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Cart",
  description: "Arizona Alpine Trail cart placeholder.",
  alternates: { canonical: "/cart" },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  return (
    <PageShell
      title="Cart"
      description="Placeholder route for future Stripe-powered shop or donation checkout flows."
    />
  );
}
