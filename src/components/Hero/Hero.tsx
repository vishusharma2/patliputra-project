"use client";
import { Playfair_Display, Montserrat } from "next/font/google";
import { useEffect, useRef } from "react";
import styles from "./Hero.module.css";
import HighlightsCarousel from "../HighlightsCarousel/HighlightsCarousel";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const overlay = heroRef.current.querySelector(
        `.${styles.bgOverlay}`,
      ) as HTMLElement;
      if (overlay) {
        overlay.style.transform = `translateY(${scrollY * 0.25}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="home" className={styles.hero} ref={heroRef} aria-label="Hero">
      <div className={styles.bgOverlay} />
      <div className={styles.bgGradient} />

      {/* Floating decorative elements */}
      <div
        className={styles.floatingOrb}
        style={{ top: "15%", left: "10%", animationDelay: "0s" }}
      />
      <div
        className={styles.floatingOrb}
        style={{ top: "50%", right: "10%", animationDelay: "2s" }}
      />

      <div className={`container ${styles.content}`}>
        {/* Golden Angled Banner */}
        <div className={styles.legacyRibbon}>
          <div className={styles.legacyIcon}>
            <span className={styles.crownIcon}>
              <img
                src="https://mbfrobyozijbwglauqop.supabase.co/storage/v1/object/public/project%20images/logo%20and%20other/patliputra_signature_park.png"
                alt="patliputra_signature_park"
                className="h-[90px] w-[90px] shrink-0 object-contain md:h-[110px] md:w-[110px] lg:h-[200px] lg:w-[160px]"
              />
            </span>
          </div>
          <div className={styles.legacyText}>
            <strong className={`${montserrat.className} text-[1.6rem]`}>
              The Most Thriving Hotspot
            </strong>
            <span className={`${playfair.className} text-[1rem] font-bold`}>
              Our latest venture,
            </span>
            <span className={`${playfair.className} text-[1rem] font-bold`}>
              Patliputra Signature Park is a RERA-approved project{" "}
            </span>
            <span className={`${playfair.className} text-[1rem] font-bold`}>
              located in CHI V, Greater Noida.
            </span>
          </div>
          <a
            id="hero-know-more"
            href="https://signaturepark.app/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.knowMore}
            aria-label="Know more about Patliputra Signature Park"
          >
            <span className={styles.knowMoreLabel}>
              <span>Know More</span>
            </span>
            <span className={styles.knowMoreArrow} aria-hidden="true">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </span>
          </a>
        </div>

        {/* Highlights Carousel */}
        <HighlightsCarousel />
      </div>
    </section>
  );
}
