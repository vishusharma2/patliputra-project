import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner/PageBanner";
import MediaEvents from "@/components/MediaEvents/MediaEvents";
import Newsletter from "@/components/Newsletter/Newsletter";

export const metadata: Metadata = {
  title: "Media & Press Coverage | Patliputra Group - News & Accolades",
  description:
    "Read latest news releases, awards, and industry recognitions of Patliputra Group from leading national and regional publications.",
};

export default function MediaPage() {
  return (
    <>
      <PageBanner
        title="MEDIA AND EVENTS"
        highlightWord="EVENTS"
        subtitle="National and regional media coverage highlighting our landmark foundation ceremonies, structural milestones, and industry excellence awards."
        breadcrumb="Media & News"
      />
      <MediaEvents />
      <Newsletter />
    </>
  );
}
