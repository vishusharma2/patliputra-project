import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner/PageBanner";
import Masterpiece from "@/components/Masterpiece/Masterpiece";
import Amenities from "@/components/Amenities/Amenities";

export const metadata: Metadata = {
  title: "Our Masterpiece | Patliputra Twin Towers - Bihar's Tallest Landmark",
  description:
    "Explore Patliputra Twin Towers — 38 stories of ultra-luxury sky condominiums on Bailey Road Extension, Patna.",
};

export default function MasterpiecePage() {
  return (
    <>
      <PageBanner
        title="OUR MASTERPIECE"
        highlightWord="MASTERPIECE"
        subtitle="Rising 38 stories into Patna's skyline — Patliputra Twin Towers stands as an epitome of architectural grandeur and refined living."
        breadcrumb="Masterpiece"
      />
      <Masterpiece />
      <Amenities />
    </>
  );
}
