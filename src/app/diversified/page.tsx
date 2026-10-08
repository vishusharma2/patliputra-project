import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner/PageBanner";
import Diversified from "@/components/Diversified/Diversified";
import Landmarks from "@/components/Landmarks/Landmarks";

export const metadata: Metadata = {
  title:
    "Diversified Verticals | Patliputra Group - Hospitality, Commercial & Healthcare",
  description:
    "Discover Patliputra Group's diverse verticals across luxury boutique resorts, commercial Grade-A tech parks, and modern medicity infrastructure.",
};

export default function DiversifiedPage() {
  return (
    <>
      <PageBanner
        title="DIVERSIFIED BUSINESSES"
        highlightWord="DIVERSIFIED"
        subtitle="Beyond residential developments: Catalyzing regional economic growth across luxury hospitality, Grade-A commercial tech parks, and state-of-the-art healthcare complexes."
        breadcrumb="Diversified"
      />
      <Diversified />
      <Landmarks />
    </>
  );
}
