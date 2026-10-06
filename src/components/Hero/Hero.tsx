"use client";
import { Playfair_Display, Montserrat } from "next/font/google";
import { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./Hero.module.css";

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
                src="/img/patliputra_signature_park.png"
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
          <span className={styles.reraTag}>
            <a href="https://signaturepark.app/" target="blank">
              <button>Know More</button>
            </a>
          </span>
        </div>

        <div className={styles.mainGrid}>
          {/* Left Text */}
          <div className={styles.textCol}>
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              NEW LAUNCH &bull; BAILEY ROAD EXTENSION
            </div>

            <h1 className={styles.title}>
              Redefining <span className={styles.titleAccent}>Luxury</span>
              <br />
              Living in Patna
            </h1>

            <p className={styles.subtitle}>
              Experience extraordinary living at Patliputra Residences &mdash;
              Bihar&apos;s most prestigious gated community. High-rise 2, 3
              &amp; 4 BHK sky condominiums, world-class amenities, and unmatched
              capital appreciation for forward-thinking homeowners and
              investors.
            </p>

            <div className={styles.ctas}>
              <Link href="/properties" className="btn btn--primary btn--lg">
                Explore Properties
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/contact" className="btn btn--outline btn--lg">
                Schedule Site Visit
              </Link>
            </div>
          </div>

          {/* Right Dual Showcase Images */}
          <div className={styles.visualCol}>
            <div className={styles.splitCards}>
              <div className={styles.photoCard}>
                <img
                  src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&q=80"
                  alt="Couple enjoying luxury living at Patliputra Residences"
                  className={styles.cardImage}
                  width={320}
                  height={420}
                />
                <div className={styles.photoTag}>
                  <span className={styles.tagDot} />
                  Lifestyle Redefined
                </div>
              </div>

              <div className={styles.photoCard}>
                <img
                  src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80"
                  alt="Olympic-sized swimming pool and resort amenities"
                  className={styles.cardImage}
                  width={320}
                  height={420}
                />
                <div className={styles.photoTag}>
                  <span className={styles.tagDot} />
                  Resort Living
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <div className={styles.scrollMouse}>
          <div className={styles.scrollWheel} />
        </div>
        <span>Scroll to Explore</span>
      </div>
    </section>
  );
}
