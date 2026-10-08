"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./WhyChoose.module.css";

interface WhyFeature {
  id: string;
  tag: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: WhyFeature[] = [
  {
    id: "smart-value",
    tag: "CAPITAL GROWTH",
    title: "SMART VALUE, LASTING RETURNS",
    description:
      "Prime locations + quality construction = secure investments that grow over time.",
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Architectural Tower on Palm */}
        <rect x="18" y="8" width="12" height="18" rx="1.5" />
        <line x1="22" y1="13" x2="26" y2="13" />
        <line x1="22" y1="17" x2="26" y2="17" />
        <line x1="22" y1="21" x2="26" y2="21" />
        {/* Adjoining Tower */}
        <rect x="30" y="14" width="8" height="12" rx="1.5" />
        <line x1="33" y1="18" x2="35" y2="18" />
        <line x1="33" y1="22" x2="35" y2="22" />
        {/* Supporting Hand */}
        <path d="M6 35h8.5c2.2 0 4.2-1.1 5.4-2.9l1.8-2.7c.9-1.4 2.5-2.2 4.1-2.2h8.4c1.7 0 3 1.3 3 3 0 .7-.3 1.4-.7 1.9l-5.8 6.9c-1.3 1.5-3.2 2.4-5.2 2.4H15" />
        <path d="M12 31v-4c0-1.1.9-2 2-2h3" />
      </svg>
    ),
  },
  {
    id: "customer-first",
    tag: "CLIENT COMMITMENT",
    title: "CUSTOMER-FIRST APPROACH",
    description:
      "We listen, deliver, and build lasting trust throughout your home-buying journey.",
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Speech / Trust Bubble */}
        <path d="M14 15h11c2.2 0 4-1.8 4-4s-1.8-4-4-4h-9c-2.2 0-4 1.8-4 4 0 1.2.5 2.2 1.3 2.9L11 17l3-2z" />
        <line x1="16" y1="11" x2="22" y2="11" />
        <path d="M29 11h6c1.7 0 3 1.3 3 3 0 1.1-.6 2.1-1.5 2.6l1.5 2.4-2.5-1H31" />
        {/* Customer Avatars */}
        <circle cx="24" cy="26" r="3.8" />
        <path d="M17 38c0-3.9 3.1-7 7-7s7 3.1 7 7" />
        <circle cx="13" cy="27" r="3" />
        <path d="M7 38c0-2.8 2.2-5 5-5 .8 0 1.5.2 2.2.5" />
        <circle cx="35" cy="27" r="3" />
        <path d="M33.8 33.5c.7-.3 1.4-.5 2.2-.5 2.8 0 5 2.2 5 5" />
      </svg>
    ),
  },
  {
    id: "experience",
    tag: "HERITAGE & TRUST",
    title: "30+ YEARS OF EXPERIENCE",
    description:
      "Three decades of shaping skylines with trust, excellence, and innovation.",
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Heraldic Shield */}
        <path d="M24 6l14 5.5v12c0 9.2-6 16.8-14 19-8-2.2-14-9.8-14-19v-12L24 6z" />
        <path
          d="M24 10l10 4v9c0 7-4.5 12.8-10 14.5-5.5-1.7-10-7.5-10-14.5v-9l10-4z"
          strokeWidth="1.3"
          opacity="0.6"
        />
        <path d="M18 24l4.5 4.5 8.5-8.5" strokeWidth="2.4" />
      </svg>
    ),
  },
  {
    id: "awards",
    tag: "INDUSTRY ACCLAIM",
    title: "AWARD-WINNING EXCELLENCE",
    description:
      "Recognized for innovation, quality, and customer satisfaction in real estate.",
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Rosette Ribbon Medal */}
        <circle cx="24" cy="20" r="9.5" />
        <path
          d="M24 7l2.2 3.2 3.8-.6.7 3.8 3.3 2.1-1.4 3.6 1.4 3.6-3.3 2.1-.7 3.8-3.8-.6L24 31l-2.2-3.1-3.8.6-.7-3.8-3.3-2.1 1.4-3.6-1.4-3.6 3.3-2.1.7-3.8 3.8.6L24 7z"
          strokeWidth="1.5"
        />
        <path d="M20 20l3 3 6-6" />
        <path d="M19 29l-3 12 7.5-3.5" />
        <path d="M29 29l3 12-7.5-3.5" />
      </svg>
    ),
  },
  {
    id: "locations",
    tag: "STRATEGIC ACCESS",
    title: "PRIME LOCATIONS",
    description:
      "Every project is strategically located to ensure connectivity and long-term value.",
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* House */}
        <path d="M24 9l-9 7.5v11h6v-5.5h6v5.5h6v-11L24 9z" />
        <line x1="24" y1="13.5" x2="24" y2="16.5" />
        {/* Cradling hands */}
        <path d="M9 36l3.2-1.6c1.8-.9 3.8-1 5.7-.3l3.1 1.1" />
        <path d="M13 29c-1.5 2-2 4.5-1.5 7" />
        <path d="M39 36l-3.2-1.6c-1.8-.9-3.8-1-5.7-.3l-3.1 1.1" />
        <path d="M35 29c1.5 2 2 4.5 1.5 7" />
      </svg>
    ),
  },
  {
    id: "eco-friendly",
    tag: "SUSTAINABLE LIVING",
    title: "ECO-FRIENDLY DEVELOPMENTS",
    description:
      "Committed to greener spaces, energy efficiency, and sustainable communities.",
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Modern Skyline */}
        <rect x="22" y="15" width="10" height="17" rx="1.5" />
        <line x1="25" y1="19" x2="29" y2="19" />
        <line x1="25" y1="23" x2="29" y2="23" />
        <rect x="32" y="20" width="8" height="12" rx="1.5" />
        <line x1="35" y1="24" x2="37" y2="24" />
        {/* Eco Leaf & Orbit */}
        <path d="M9 32c0-8.5 7-15.5 15.5-15.5" strokeDasharray="3 3" />
        <path d="M11 26c3-5.5 8.5-6.5 11.5-3.5-1 3.5-5 7.5-9.5 7.5" />
        <path d="M13 27.5l5.5-2.5" />
        <line x1="8" y1="36" x2="40" y2="36" />
      </svg>
    ),
  },
];

const metrics = [
  { value: "30+", label: "Years Legacy", detail: "Shaping Bihar's Skyline" },
  { value: "100%", label: "RERA Compliant", detail: "Total Legal Assurance" },
  { value: "8,500+", label: "Happy Families", detail: "Thriving Communities" },
  {
    value: "11+",
    label: "Landmark Projects",
    detail: "Residential & Commercial",
  },
];

export default function WhyChoose() {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  return (
    <section
      id="why-us"
      className={styles.section}
      aria-label="Why Choose Patliputra Group"
    >
      {/* Decorative Architectural Dot Grid & Ambient Aura */}
      <div className={styles.architecturalGrid} aria-hidden="true" />
      <div className={styles.ambientAura} aria-hidden="true" />

      <div className="container">
        {/* Section Header */}
        <div className={styles.header}>
          <span className={styles.eyebrowBadge}>THE PATLIPUTRA ADVANTAGE</span>
          <h2 className={styles.title}>WHY CHOOSE PATLIPUTRA GROUP?</h2>
          <div className={styles.divider} aria-hidden="true" />
          <p className={styles.subtitle}>
            Trusted by thousands of families for over 30 years, we deliver
            quality, innovation, and customer-first experiences in every
            project.
          </p>
        </div>

        {/* 3x2 Luxury Feature Cards Grid */}
        <div className={styles.grid}>
          {features.map((item) => (
            <article
              key={item.id}
              className={`${styles.card} ${
                activeCard === item.id ? styles.cardActive : ""
              }`}
              onMouseEnter={() => setActiveCard(item.id)}
              onMouseLeave={() => setActiveCard(null)}
            >
              {/* Luminous Icon Circle */}
              <div className={styles.iconContainer}>
                <div className={styles.iconCircle} aria-hidden="true">
                  {item.icon}
                </div>
                <div className={styles.iconRing} aria-hidden="true" />
              </div>

              {/* Strategic Category Pill */}
              <span className={styles.categoryPill}>{item.tag}</span>

              {/* Title & Description */}
              <h3 className={styles.itemTitle}>{item.title}</h3>
              <p className={styles.itemDesc}>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
