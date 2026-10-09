import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner/PageBanner";
import CareerSection from "@/components/Career/CareerSection";
import styles from "./career.module.css";

export const metadata: Metadata = {
  title: "Careers at Patliputra Group | Build Bihar's Skyline",
  description:
    "Explore career opportunities in civil engineering, architecture, luxury sales, and digital operations at Patliputra Group.",
};

export default function CareerPage() {
  return (
    <main className={styles.careerPage}>
      <PageBanner
        title="CAREERS AT PATLIPUTRA"
        highlightWord="CAREERS"
        subtitle="Join Bihar's premier real estate developer. Shape landmark projects with visionary teams, continuous learning, and market-leading rewards."
        breadcrumb="Career"
      />
      <CareerSection />
    </main>
  );
}
