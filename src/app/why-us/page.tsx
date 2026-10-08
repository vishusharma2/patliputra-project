import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner/PageBanner";
import WhyChoose from "@/components/WhyChoose/WhyChoose";
import Amenities from "@/components/Amenities/Amenities";
import CapitalGains from "@/components/CapitalGains/CapitalGains";

export const metadata: Metadata = {
  title: "Why Choose Us | Patliputra Group - 30+ Years Legacy, Trusted Real Estate",
  description:
    "Trusted by thousands of families for over 30 years, we deliver quality, innovation, and customer-first experiences across Bihar.",
};

export default function WhyUsPage() {
  return (
    <>
      <PageBanner
        title="WHY CHOOSE PATLIPUTRA"
        highlightWord="PATLIPUTRA"
        subtitle="Trusted by thousands of families for over 30 years, we deliver quality, innovation, and customer-first experiences in every project."
        breadcrumb="Why Choose Us"
      />
      <WhyChoose />
      <Amenities />
      <CapitalGains />
    </>
  );
}
