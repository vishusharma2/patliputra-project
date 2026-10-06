import Link from "next/link";
import styles from "./Masterpiece.module.css";

export default function Masterpiece() {
  return (
    <section id="masterpiece" className={styles.section} aria-label="Our Masterpiece Project">
      <div className="container">
        <div className={styles.header}>
          <span className="section-label">Iconic Landmark</span>
          <h2 className={styles.title}>
            OUR <span className={styles.goldText}>MASTERPIECE</span>
          </h2>
          <p className={styles.subtitle}>
            BIHAR&apos;S TALLEST LUXURY TWIN TOWERS &bull; WHERE AMBITION MEETS ARCHITECTURE
          </p>
        </div>

        <div className={styles.masterpieceCard}>
          <div className={styles.imageWrapper}>
            <img
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&q=85"
              alt="Patliputra Twin Towers - Bihar's Tallest Luxury Residential Landmark at Night"
              className={styles.heroImage}
              width={1200}
              height={600}
              loading="lazy"
            />
            <div className={styles.imageOverlay} />
            <div className={styles.badgeTop}>
              <span className={styles.badgePulse} />
              FLAGSHIP DEVELOPMENT
            </div>
            <div className={styles.priceTag}>
              <span>Starting From</span>
              <strong>₹ 1.25 Cr*</strong>
            </div>
          </div>

          <div className={styles.content}>
            <div className={styles.mainInfo}>
              <div className={styles.headlineRow}>
                <div>
                  <h3 className={styles.projectName}>PATLIPUTRA TWIN TOWERS</h3>
                  <p className={styles.location}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Bailey Road Extension, Near Saguna More, Patna
                  </p>
                </div>
                <div className={styles.reraBadge}>
                  <span className={styles.reraLabel}>RERA NO.</span>
                  <span className={styles.reraCode}>BRERAP00234-1/2023</span>
                </div>
              </div>

              <p className={styles.summary}>
                Rising 38 stories into Patna&apos;s skyline, the Patliputra Twin Towers stands as an epitome of architectural grandeur.
                Featuring high-speed panoramic elevators, an infinity-edge rooftop sky pool, temperature-controlled private club,
                and double-height residences designed by international master planners.
              </p>
            </div>

            <div className={styles.highlightsGrid}>
              <div className={styles.highlightItem}>
                <span className={styles.highlightNum}>38</span>
                <span className={styles.highlightLabel}>Sky Floors</span>
              </div>
              <div className={styles.highlightDivider} />
              <div className={styles.highlightItem}>
                <span className={styles.highlightNum}>3 &amp; 4 BHK</span>
                <span className={styles.highlightLabel}>Ultra Luxury Units</span>
              </div>
              <div className={styles.highlightDivider} />
              <div className={styles.highlightItem}>
                <span className={styles.highlightNum}>360°</span>
                <span className={styles.highlightLabel}>Sky Lounge &amp; Deck</span>
              </div>
              <div className={styles.highlightDivider} />
              <div className={styles.highlightItem}>
                <span className={styles.highlightNum}>Zone V</span>
                <span className={styles.highlightLabel}>Seismic Resistance</span>
              </div>
            </div>

            <div className={styles.actionRow}>
              <Link href="/contact" className="btn btn--primary btn--lg">
                Schedule VIP Site Tour
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/contact" className="btn btn--dark btn--lg">
                Download Floor Plans &amp; Price Sheet
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
