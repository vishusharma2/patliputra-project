"use client";

import { useState } from "react";
import styles from "./Properties.module.css";

interface Property {
  id: string;
  type: string;
  title: string;
  location: string;
  area: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  image: string;
  tag?: string;
  rera: string;
  features: string[];
}

const properties: Property[] = [
  {
    id: "patliputra-elegance",
    type: "3 & 4 BHK",
    title: "Patliputra Elegance",
    location: "Bailey Road, Near Canal Road, Patna",
    area: "1,850 - 2,400 sq.ft.",
    price: "₹88 Lakhs*",
    bedrooms: 3,
    bathrooms: 3,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    tag: "Ready To Move In",
    rera: "BRERAP00189-2/2022",
    features: ["Italian Marble Flooring", "Double-Height Balcony", "Clubhouse Access", "Vastu Compliant"],
  },
  {
    id: "patliputra-green-vista",
    type: "2 & 3 BHK",
    title: "Patliputra Green Vista",
    location: "Saguna More, Danapur Main Road, Patna",
    area: "1,350 - 1,920 sq.ft.",
    price: "₹68 Lakhs*",
    bedrooms: 3,
    bathrooms: 2,
    image: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&q=80",
    tag: "Under Construction",
    rera: "BRERAP00312-4/2023",
    features: ["Rooftop Sky Garden", "Solar Powered Common Areas", "EV Charging Bays", "Olympic Gym"],
  },
  {
    id: "patliputra-imperial",
    type: "4 BHK",
    title: "Patliputra Imperial Heights",
    location: "Patliputra Colony, Boring Road Crossing, Patna",
    area: "2,750 - 3,500 sq.ft.",
    price: "₹1.75 Cr*",
    bedrooms: 4,
    bathrooms: 4,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    tag: "Ultra Luxury",
    rera: "BRERAP00095-1/2021",
    features: ["Private Heated Jacuzzi", "Dedicated Servant Suite", "Smart Fingerprint Entry", "3 Reserved Car Parks"],
  },
];

const filters = ["All Projects", "Ready To Move", "Under Construction", "Ultra Luxury"];

export default function Properties() {
  const [activeFilter, setActiveFilter] = useState("All Projects");

  const filtered = properties.filter((p) => {
    if (activeFilter === "All Projects") return true;
    if (activeFilter === "Ready To Move") return p.tag === "Ready To Move In";
    if (activeFilter === "Under Construction") return p.tag === "Under Construction";
    if (activeFilter === "Ultra Luxury") return p.tag === "Ultra Luxury";
    return true;
  });

  return (
    <section id="properties" className={styles.properties} aria-label="Our Ongoing and Upcoming Projects">
      <div className="container">
        <div className={styles.header}>
          <div>
            <span className="section-label">Prime Developments</span>
            <h2 className={styles.sectionTitle}>
              OUR ONGOING &amp; <span className={styles.goldText}>UPCOMING PROJECTS</span>
            </h2>
            <p className="section-subtitle">
              Carefully engineered landmarks situated across Patna&apos;s most lucrative arterial corridors, built to international standards.
            </p>
          </div>

          <div className={styles.filters} role="tablist" aria-label="Filter properties">
            {filters.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={activeFilter === f}
                className={`${styles.filterBtn} ${
                  activeFilter === f ? styles.filterActive : ""
                }`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          {filtered.map((property) => (
            <article key={property.id} className={styles.card} id={`property-${property.id}`}>
              <div className={styles.cardImage}>
                <img
                  src={property.image}
                  alt={`${property.title} - ${property.type} luxury project in ${property.location}`}
                  loading="lazy"
                  width={600}
                  height={400}
                />
                {property.tag && (
                  <span className={styles.cardTag}>{property.tag}</span>
                )}
                <div className={styles.cardOverlay}>
                  <a href="#contact" className="btn btn--primary btn--sm">
                    Book Site Inspection
                  </a>
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.typeRow}>
                  <span className={styles.cardType}>{property.type}</span>
                  <span className={styles.reraNumber}>{property.rera}</span>
                </div>

                <h3 className={styles.cardTitle}>{property.title}</h3>

                <p className={styles.cardLocation}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {property.location}
                </p>

                <div className={styles.cardMeta}>
                  <div className={styles.metaItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
                    {property.area}
                  </div>
                  <div className={styles.metaItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" /><path d="M21 7H3l2-4h14l2 4z" /></svg>
                    {property.bedrooms} BHK
                  </div>
                  <div className={styles.metaItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12h16a1 1 0 0 1 1 1v3H3v-3a1 1 0 0 1 1-1zM6 12V5a2 2 0 0 1 2-2h3v2.25" /><path d="M3 16v4M21 16v4" /></svg>
                    {property.bathrooms} Baths
                  </div>
                </div>

                <ul className={styles.cardFeatures}>
                  {property.features.map((feat) => (
                    <li key={feat}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      {feat}
                    </li>
                  ))}
                </ul>

                <div className={styles.cardFooter}>
                  <div className={styles.price}>
                    <span className={styles.priceLabel}>Starting from</span>
                    <span className={styles.priceValue}>{property.price}</span>
                  </div>
                  <a
                    href="#contact"
                    className="btn btn--dark btn--sm"
                    aria-label={`Enquire about ${property.title}`}
                  >
                    Get Quote
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
