import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner/PageBanner";
import Contact from "@/components/Contact/Contact";

export const metadata: Metadata = {
  title: "Contact Us & Schedule Site Visit | Patliputra Group Patna",
  description:
    "Schedule your private site tour at Patliputra Residences. Visit our corporate office at Patliputra Colony, Bailey Road, Patna or connect with sales experts.",
};

export default function ContactPage() {
  return (
    <>
      <PageBanner
        title="SCHEDULE YOUR VISIT"
        highlightWord="VISIT"
        subtitle="Connect with our senior investment advisors, experience our furnished show apartments firsthand, and receive customized floor plan brochures."
        breadcrumb="Contact Us"
      />
      <Contact />
    </>
  );
}
