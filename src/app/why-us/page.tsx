import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner/PageBanner";
import WhyChoose from "@/components/WhyChoose/WhyChoose";
import Amenities from "@/components/Amenities/Amenities";
import CapitalGains from "@/components/CapitalGains/CapitalGains";

export const metadata: Metadata = {
  title: "Why Choose Us | Patliputra Group - RERA Approved, High ROI Real Estate",
  description:
    "Discover why over 8,500 families and investors trust Patliputra Group: 25+ years legacy, 100% RERA assurance, earthquake-resistant engineering, and 40+ luxury amenities.",
};

export default function WhyUsPage() {
  return (
    <>
      <PageBanner
        title="WHY CHOOSE PATLIPUTRA"
        highlightWord="PATLIPUTRA"
        subtitle="Over 25 years of building trust, 100% RERA compliance, unmatched capital appreciation, and 40+ resort-grade lifestyle amenities in Bihar."
        breadcrumb="Why Choose Us"
      />
      <WhyChoose />
      <Amenities />
      <CapitalGains />
    </>
  );
}
