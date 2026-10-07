import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner/PageBanner";
import About from "@/components/About/About";

export const metadata: Metadata = {
  title: "About Us | Patliputra Group - 35+ Years of Legacy in Bihar",
  description:
    "Learn about Patliputra Group's 35-year heritage in shaping Patna's urban landscape with luxury residential, commercial, and hospitality infrastructure.",
};

export default function AboutPage() {
  return (
    <>
      <PageBanner
        title="PATLIPUTRA GROUP"
        highlightWord="PATLIPUTRA"
        breadcrumb="About Us"
      />
      <About />
    </>
  );
}
