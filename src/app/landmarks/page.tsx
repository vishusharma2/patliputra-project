import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner/PageBanner";
import Landmarks from "@/components/Landmarks/Landmarks";

export const metadata: Metadata = {
  title: "Upcoming Landmarks | Patliputra Group - Retail, Entertainment & 5-Star Hotels",
  description:
    "Explore upcoming landmarks by Patliputra Group including open-air promenade retail parks and 5-star international convention hotels in Patna.",
};

export default function LandmarksPage() {
  return (
    <>
      <PageBanner
        title="UPCOMING LANDMARKS"
        highlightWord="LANDMARKS"
        subtitle="Shaping Patna's future skyline with iconic mega-destinations for international retail, open-air entertainment, and 5-star destination conventions."
        breadcrumb="Landmarks"
      />
      <Landmarks />
    </>
  );
}
