"use client";

import styles from "./WhyChoose.module.css";

interface WhyItem {
  number: string;
  title: string;
  description: string;
  icon: string;
}

const items: WhyItem[] = [
  {
    number: "01",
    title: "25+ Years of Trust & Legacy",
    description: "Bihar's most reliable and pioneering real estate developer with over two decades of uncompromising integrity.",
    icon: "🏛️",
  },
  {
    number: "02",
    title: "100% RERA & Legal Assurance",
    description: "All projects strictly adhere to RERA regulations with clear land titles, transparent documentation, and zero encumbrances.",
    icon: "⚖️",
  },
  {
    number: "03",
    title: "Prime Strategic Locations",
    description: "Centrally positioned along high-growth arterial corridors like Bailey Road, Saguna More, and Patliputra Colony.",
    icon: "📍",
  },
  {
    number: "04",
    title: "High Rental Yield & Capital Gains",
    description: "Our developments consistently deliver 8-12% annual appreciation and industry-leading rental occupancy rates.",
    icon: "📈",
  },
  {
    number: "05",
    title: "Superior Architectural Engineering",
    description: "Designed in collaboration with award-winning architects featuring Earthquake Zone V RCC structures.",
    icon: "🏗️",
  },
  {
    number: "06",
    title: "Lifetime Post-Handover Care",
    description: "Dedicated facility management ensuring round-the-clock maintenance, security, landscaping, and community services.",
    icon: "🤝",
  },
];

export default function WhyChoose() {
  return (
    <section id="why-us" className={styles.section} aria-label="Why Choose Patliputra Group">
      <div className="container">
        <div className={styles.header}>
          <span className="section-label">Our Pillars</span>
          <h2 className={styles.title}>
            WHY CHOOSE <span className={styles.goldText}>PATLIPUTRA GROUP?</span>
          </h2>
          <p className={styles.subtitle}>
            A QUARTER CENTURY OF UNCOMPROMISING EXCELLENCE, INNOVATION, AND VALUE CREATION
          </p>
        </div>

        <div className={styles.grid}>
          {items.map((it) => (
            <div key={it.number} className={styles.itemCard}>
              <div className={styles.iconCircle}>
                <span className={styles.emojiIcon}>{it.icon}</span>
                <span className={styles.stepNum}>{it.number}</span>
              </div>
              <h3 className={styles.itemTitle}>{it.title}</h3>
              <p className={styles.itemDesc}>{it.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
