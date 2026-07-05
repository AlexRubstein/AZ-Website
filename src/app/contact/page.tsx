import { ContactForm } from "@/components/ContactForm";
import { PageShell } from "@/components/PageShell";

export default function ContactPage() {
  return (
    <PageShell
      title="Contact"
      description="A replacement for the WordPress WPForms contact page with accessible fields and API handling."
    >
      <ContactForm />
    </PageShell>
  );
}
