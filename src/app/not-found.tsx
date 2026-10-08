import Link from "next/link";
import type { Metadata } from "next";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "404 - Address Not Found | Patliputra Group",
  description:
    "The estate, residence, or publication you requested could not be located. Discover our signature properties or connect with our concierge.",
};

export default function NotFound() {
  return (
    <section
      className={styles.containerSection}
      aria-label="404 - Page Not Found"
    >
      {/* Blueprint Grid & Luminous Ambient Backgrounds */}
      <div className={styles.blueprintGrid} aria-hidden="true" />
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className={styles.contentWrapper}>
        {/* Estate Coordinates Indicator */}
        <div className={styles.coordsBadge}>
          <span className={styles.pulseDot} />
          <span>ESTATE COORDINATES UNMAPPED • LAT 25.6120° N</span>
        </div>

        {/* 404 Display with Architectural Compass */}
        <div className={styles.numberDisplay}>
          <span className={styles.digit}>4</span>

          <div
            className={styles.compassEmblem}
            role="img"
            aria-label="Architectural compass rose"
          >
            <div className={styles.emblemInnerIcon}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Compass Star / Rose */}
                <polygon
                  points="24 4 28 20 44 24 28 28 24 44 20 28 4 24 20 20"
                  fill="rgba(200, 164, 92, 0.25)"
                />
                <circle cx="24" cy="24" r="3" fill="currentColor" />
                <circle cx="24" cy="24" r="14" strokeDasharray="3 3" />
              </svg>
            </div>
          </div>

          <span className={styles.digit}>4</span>
        </div>

        {/* Heading & Context */}
        <h1 className={styles.title}>
          THIS ADDRESS IS <span className={styles.goldText}>OFF THE MAP</span>
        </h1>
        <p className={styles.description}>
          Even visionary architectural masterplans have unchartered coordinates.
          The estate parcel, residence page, or document you are seeking does
          not exist or has been relocated to a new address.
        </p>

        {/* Primary Action Buttons */}
        <div className={styles.actionButtons}>
          <Link href="/" className={styles.btnPrimary}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Return to Main Entrance
          </Link>

          <Link href="/contact" className={styles.btnSecondary}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Contact Private Concierge
          </Link>
        </div>

        {/* Directory Navigation Cards */}
        <div className={styles.directorySection}>
          <span className={styles.directoryLabel}>
            Navigate Our Architectural Directory
          </span>

          <div className={styles.directoryGrid}>
            <Link href="/properties" className={styles.directoryCard}>
              <div className={styles.cardIcon}>
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
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                  <line x1="9" y1="6" x2="9" y2="6.01" />
                  <line x1="15" y1="6" x2="15" y2="6.01" />
                  <line x1="9" y1="10" x2="9" y2="10.01" />
                  <line x1="15" y1="10" x2="15" y2="10.01" />
                  <line x1="9" y1="14" x2="9" y2="14.01" />
                  <line x1="15" y1="14" x2="15" y2="14.01" />
                  <path d="M9 18h6" />
                </svg>
              </div>
              <h3 className={styles.cardTitle}>Signature Properties</h3>
              <p className={styles.cardDesc}>
                Explore delivered luxury towers & upcoming residential landmarks.
              </p>
            </Link>

            <Link href="/diversified" className={styles.directoryCard}>
              <div className={styles.cardIcon}>
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
                  <path d="M3 21h18" />
                  <path d="M5 21V7l8-4v18" />
                  <path d="M19 21V11l-6-4" />
                  <line x1="9" y1="9" x2="9" y2="9.01" />
                  <line x1="9" y1="13" x2="9" y2="13.01" />
                  <line x1="9" y1="17" x2="9" y2="17.01" />
                </svg>
              </div>
              <h3 className={styles.cardTitle}>Diversified Verticals</h3>
              <p className={styles.cardDesc}>
                5-Star luxury hospitality, commercial IT parks & healthcare hubs.
              </p>
            </Link>

            <Link href="/why-us" className={styles.directoryCard}>
              <div className={styles.cardIcon}>
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
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <h3 className={styles.cardTitle}>Why Choose Us</h3>
              <p className={styles.cardDesc}>
                30+ years legacy, 100% RERA assurance & high capital appreciation.
              </p>
            </Link>

            <Link href="/about" className={styles.directoryCard}>
              <div className={styles.cardIcon}>
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
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>
              <h3 className={styles.cardTitle}>About Our Group</h3>
              <p className={styles.cardDesc}>
                Our visionary leadership, core values, and heritage since 1989.
              </p>
            </Link>
          </div>
        </div>

        {/* Concierge Hotline */}
        <div className={styles.conciergeBar}>
          <span>Need immediate assistance locating a specific estate parcel?</span>
          <a href="tel:+919876543210" className={styles.conciergePhone}>
            Call Concierge: +91 98765 43210
          </a>
        </div>
      </div>
    </section>
  );
}
