"use client";

import styles from "./Diversified.module.css";

interface BusinessSector {
  title: string;
  category: string;
  image: string;
  description: string;
  features: string[];
}

const sectors: BusinessSector[] = [
  {
    title: "Patliputra Resorts & Hospitality",
    category: "HOSPITALITY & LEISURE",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    description:
      "Signature boutique luxury resorts, banqueting complexes, and poolside leisure hubs creating bespoke experiential getaways.",
    features: ["Infinity Pools", "Grand Ballrooms", "Fine-Dining Cuisine", "Wellness Spas"],
  },
  {
    title: "Patliputra Commercial & Tech Parks",
    category: "COMMERCIAL INFRASTRUCTURE",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    description:
      "Next-generation Grade-A corporate towers designed for multinational enterprises, banks, and modern IT hubs with IGBC Gold ratings.",
    features: ["LEED Certified", "High-speed Elevators", "Ample Multi-level Parking", "24/7 Power Backup"],
  },
  {
    title: "Patliputra Medicity & Wellness",
    category: "HEALTHCARE & WELLNESS",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    description:
      "State-of-the-art integrated health complexes providing multi-speciality clinical diagnostics, preventative medicine, and nursing suites.",
    features: ["Advanced ICU Systems", "Digital Diagnostic Labs", "Holistic Wellness Center", "Emergency Care"],
  },
];

export default function Diversified() {
  return (
    <section id="diversified" className={styles.section} aria-label="Our Diversified Businesses">
      <div className="container">
        <div className={styles.header}>
          <span className="section-label">Group Ecosystem</span>
          <h2 className={styles.title}>
            OUR <span className={styles.goldText}>DIVERSIFIED</span> BUSINESSES
          </h2>
          <p className={styles.subtitle}>
            BEYOND RESIDENTIAL: CATALYZING GROWTH ACROSS HOSPITALITY, COMMERCIAL, AND HEALTHCARE
          </p>
        </div>

        <div className={styles.grid}>
          {sectors.map((sec) => (
            <article key={sec.title} className={styles.card}>
              <div className={styles.imageContainer}>
                <img
                  src={sec.image}
                  alt={`${sec.title} - ${sec.category}`}
                  className={styles.image}
                  width={600}
                  height={380}
                  loading="lazy"
                />
                <span className={styles.categoryBadge}>{sec.category}</span>
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{sec.title}</h3>
                <p className={styles.description}>{sec.description}</p>

                <div className={styles.featuresList}>
                  {sec.features.map((feat) => (
                    <span key={feat} className={styles.featurePill}>
                      <span className={styles.featureDot} />
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
