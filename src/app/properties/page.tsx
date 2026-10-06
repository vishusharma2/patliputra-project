import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner/PageBanner";
import Properties from "@/components/Properties/Properties";
import CapitalGains from "@/components/CapitalGains/CapitalGains";

export const metadata: Metadata = {
  title: "Properties & Projects | Patliputra Group - Luxury Apartments in Patna",
  description:
    "Explore premium 2, 3 & 4 BHK apartments and luxury residences in Bailey Road, Patliputra Colony, and Saguna More, Patna.",
};

export default function PropertiesPage() {
  return (
    <>
      <PageBanner
        title="PREMIUM PROPERTIES"
        highlightWord="PROPERTIES"
        subtitle="Explore RERA-approved 2, 3 & 4 BHK luxury residences and penthouses engineered for elevated lifestyle and maximum capital appreciation."
        breadcrumb="Properties"
      />
      <Properties />
      <CapitalGains />
    </>
  );
}
