"use client";

import { useEffect, useRef } from "react";
import styles from "./Hero.module.css";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const overlay = heroRef.current.querySelector(`.${styles.bgOverlay}`) as HTMLElement;
      if (overlay) {
        overlay.style.transform = `translateY(${scrollY * 0.3}px)`;
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
      <div className={styles.floatingOrb} style={{ top: "15%", left: "10%", animationDelay: "0s" }} />
      <div className={styles.floatingOrb} style={{ top: "60%", right: "15%", animationDelay: "2s" }} />
      <div className={styles.floatingOrb} style={{ bottom: "20%", left: "20%", animationDelay: "4s" }} />

      <div className={`container ${styles.content}`}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          NEW LAUNCH 2024
        </div>

        <h1 className={styles.title}>
          Redefining <span className={styles.titleAccent}>Luxury</span>
          <br />
          Living in Patna
        </h1>

        <p className={styles.subtitle}>
          Experience unparalleled elegance at Patliputra Residences — premium 2, 3 &amp; 4 BHK
          apartments designed for those who demand the extraordinary. Where modern
          architecture meets timeless sophistication.
        </p>

        <div className={styles.ctas}>
          <a href="#properties" className="btn btn--primary btn--lg">
            Explore Properties
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <a href="#contact" className="btn btn--outline btn--lg">
            Schedule Visit
          </a>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>500+</span>
            <span className={styles.statLabel}>Premium Units</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNumber}>12</span>
            <span className={styles.statLabel}>Acres Township</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNumber}>40+</span>
            <span className={styles.statLabel}>Amenities</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNumber}>98%</span>
            <span className={styles.statLabel}>Happy Families</span>
          </div>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <div className={styles.scrollMouse}>
          <div className={styles.scrollWheel} />
        </div>
        <span>Scroll Down</span>
      </div>
    </section>
  );
}
