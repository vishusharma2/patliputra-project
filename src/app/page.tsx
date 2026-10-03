import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import CapitalGains from "@/components/CapitalGains/CapitalGains";
import Properties from "@/components/Properties/Properties";
import Masterpiece from "@/components/Masterpiece/Masterpiece";
import Diversified from "@/components/Diversified/Diversified";
import Landmarks from "@/components/Landmarks/Landmarks";
import WhyChoose from "@/components/WhyChoose/WhyChoose";
import Amenities from "@/components/Amenities/Amenities";
import About from "@/components/About/About";
import MediaEvents from "@/components/MediaEvents/MediaEvents";
import Testimonials from "@/components/Testimonials/Testimonials";
import Contact from "@/components/Contact/Contact";
import Newsletter from "@/components/Newsletter/Newsletter";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <CapitalGains />
      <Properties />
      <Masterpiece />
      <Diversified />
      <Landmarks />
      <WhyChoose />
      <Amenities />
      <About />
      <MediaEvents />
      <Testimonials />
      <Contact />
      <Newsletter />
      <Footer />
    </main>
  );
}
