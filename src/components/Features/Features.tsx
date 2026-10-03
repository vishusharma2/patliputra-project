"use client";

import styles from "./Features.module.css";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: "🏗️",
    title: "Modern Architecture",
    description:
      "Contemporary design with clean lines, expansive glass facades, and intelligent space planning that maximizes natural light and ventilation.",
  },
  {
    icon: "🌿",
    title: "Green Living",
    description:
      "70% open green spaces with landscaped gardens, tree-lined walkways, and rooftop gardens creating a sustainable living ecosystem.",
  },
  {
    icon: "🔒",
    title: "24/7 Security",
    description:
      "Multi-tier security with CCTV surveillance, biometric access, video door phones, and round-the-clock security personnel.",
  },
  {
    icon: "🏊",
    title: "World-Class Amenities",
    description:
      "Olympic-sized swimming pool, state-of-the-art gymnasium, spa & sauna, tennis courts, and a luxurious clubhouse.",
  },
  {
    icon: "📍",
    title: "Prime Location",
    description:
      "Situated in the heart of Patliputra Colony with excellent connectivity to schools, hospitals, malls, and IT hubs.",
  },
  {
    icon: "🏠",
    title: "Smart Home Ready",
    description:
      "Pre-installed smart home automation for lighting, climate control, security cameras, and voice-activated assistants.",
  },
];

export default function Features() {
  return (
    <section id="features" className={styles.features} aria-label="Key features">
      <div className="container">
        <div className={styles.header}>
          <span className="section-label">Why Choose Us</span>
          <h2 className="section-title section-title--light">
            Crafted for <em>Exceptional</em> Living
          </h2>
          <p className="section-subtitle section-subtitle--light">
            Every aspect of Patliputra Residences has been thoughtfully designed to
            deliver an unmatched living experience.
          </p>
        </div>

        <div className={styles.grid}>
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className={styles.card}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={styles.cardIcon}>{feature.icon}</div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
              <div className={styles.cardShine} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
