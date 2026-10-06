import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner/PageBanner";
import About from "@/components/About/About";
import WhyChoose from "@/components/WhyChoose/WhyChoose";
import Testimonials from "@/components/Testimonials/Testimonials";

export const metadata: Metadata = {
  title: "About Us | Patliputra Group - 25+ Years of Legacy in Bihar",
  description:
    "Learn about Patliputra Group's 25-year heritage in shaping Patna's urban landscape with luxury residential, commercial, and hospitality infrastructure.",
};

export default function AboutPage() {
  return (
    <>
      <PageBanner
        title="ABOUT PATLIPUTRA GROUP"
        highlightWord="PATLIPUTRA"
        subtitle="Pioneering landmark residential, commercial & hospitality infrastructure across Bihar for over 25 years with uncompromising integrity and structural excellence."
        breadcrumb="About Us"
      />
      <About />
      <WhyChoose />
      <Testimonials />
    </>
  );
}