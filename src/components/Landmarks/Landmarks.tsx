"use client";

import styles from "./Landmarks.module.css";

interface Landmark {
  title: string;
  badge: string;
  image: string;
  subtitle: string;
  specs: string[];
}

const landmarks: Landmark[] = [
  {
    title: "Patliputra Park",
    badge: "RETAIL & ENTERTAINMENT HUB",
    image: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800&q=80",
    subtitle: "Bihar's largest open-air experiential promenade featuring luxury brands, IMAX cinema, and multi-cuisine alfresco dining.",
    specs: ["250+ Global Brands", "8-Screen Multiplex", "Open Amphitheatre", "Central Musical Fountain"],
  },
  {
    title: "5 Star Luxury Hotel",
    badge: "CONVENTION & DESTINATION",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    subtitle: "A 300-key five-star landmark destination with expansive pillarless ballrooms catering to international summits and destination weddings.",
    specs: ["300 Luxury Suites", "25,000 sq.ft. Ballroom", "Presidential Suites", "Helipad & Valet Hub"],
  },
];

export default function Landmarks() {
  return (
    <section id="landmarks" className={styles.section} aria-label="Upcoming Landmarks">
      <div className="container">
        <div className={styles.header}>
          <span className="section-label">City Infrastructure</span>
          <h2 className={styles.title}>
            VISIT BEYOND RESIDENCES: <span className={styles.goldText}>UPCOMING LANDMARKS</span>
          </h2>
          <p className={styles.subtitle}>
            SHAPING PATNA&apos;S FUTURE WITH DESTINATIONS FOR SHOPPING, LEISURE, AND CELEBRATION
          </p>
        </div>

        <div className={styles.grid}>
          {landmarks.map((l) => (
            <article key={l.title} className={styles.card}>
              <div className={styles.imageBox}>
                <img
                  src={l.image}
                  alt={`${l.title} - ${l.badge}`}
                  className={styles.image}
                  width={600}
                  height={420}
                  loading="lazy"
                />
                <div className={styles.overlay} />
                <div className={styles.cardOverlayContent}>
                  <span className={styles.badge}>{l.badge}</span>
                  <h3 className={styles.landmarkTitle}>{l.title}</h3>
                  <p className={styles.landmarkSub}>{l.subtitle}</p>

                  <div className={styles.specsRow}>
                    {l.specs.map((s) => (
                      <span key={s} className={styles.specItem}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {s}
                      </span>
                    ))}
                  </div>

                  <a href="#contact" className="btn btn--outline btn--sm">
                    Discover More
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
