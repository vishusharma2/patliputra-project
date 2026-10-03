"use client";

import { useState } from "react";
import styles from "./Properties.module.css";

interface Property {
  id: string;
  type: string;
  title: string;
  area: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  image: string;
  tag?: string;
  features: string[];
}

const properties: Property[] = [
  {
    id: "luxe-2bhk",
    type: "2 BHK",
    title: "The Luxe Suite",
    area: "1,250 sq.ft.",
    price: "₹65 Lakhs*",
    bedrooms: 2,
    bathrooms: 2,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    features: ["Modular Kitchen", "Balcony with View", "Smart Home Ready", "Vastu Compliant"],
  },
  {
    id: "premium-3bhk",
    type: "3 BHK",
    title: "The Premium Haven",
    area: "1,800 sq.ft.",
    price: "₹95 Lakhs*",
    bedrooms: 3,
    bathrooms: 3,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
    tag: "Most Popular",
    features: ["Servant Room", "Italian Marble", "Walk-in Closet", "Private Terrace"],
  },
  {
    id: "royal-4bhk",
    type: "4 BHK",
    title: "The Royal Penthouse",
    area: "2,600 sq.ft.",
    price: "₹1.45 Cr*",
    bedrooms: 4,
    bathrooms: 4,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
    tag: "Ultra Luxury",
    features: ["Private Elevator", "Rooftop Garden", "Home Theater", "Study Room"],
  },
];

const filters = ["All", "2 BHK", "3 BHK", "4 BHK"];

export default function Properties() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? properties
      : properties.filter((p) => p.type === activeFilter);

  return (
    <section id="properties" className={styles.properties} aria-label="Property listings">
      <div className="container">
        <div className={styles.header}>
          <div>
            <span className="section-label">Our Properties</span>
            <h2 className="section-title">
              Find Your <em>Perfect</em> Home
            </h2>
            <p className="section-subtitle">
              Choose from our curated collection of premium apartments, each
              designed for maximum comfort and luxury.
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
                  alt={`${property.title} - ${property.type} apartment at Patliputra Residences`}
                  loading="lazy"
                  width={600}
                  height={400}
                />
                {property.tag && (
                  <span className={styles.cardTag}>{property.tag}</span>
                )}
                <div className={styles.cardOverlay}>
                  <a href="#contact" className="btn btn--primary btn--sm">
                    Book a Visit
                  </a>
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardType}>{property.type}</div>
                <h3 className={styles.cardTitle}>{property.title}</h3>

                <div className={styles.cardMeta}>
                  <div className={styles.metaItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                    {property.area}
                  </div>
                  <div className={styles.metaItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7"/><path d="M21 7H3l2-4h14l2 4z"/></svg>
                    {property.bedrooms} Beds
                  </div>
                  <div className={styles.metaItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12h16a1 1 0 0 1 1 1v3H3v-3a1 1 0 0 1 1-1zM6 12V5a2 2 0 0 1 2-2h3v2.25"/><path d="M3 16v4M21 16v4"/></svg>
                    {property.bathrooms} Baths
                  </div>
                </div>

                <ul className={styles.cardFeatures}>
                  {property.features.map((feat) => (
                    <li key={feat}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
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
                    Enquire
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
