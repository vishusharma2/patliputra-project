import Link from "next/link";
import styles from "./UseLater.module.css";

/**
 * Hero intro block: badge, headline, subtitle, CTAs and dual photo cards.
 * Saved for later use; not rendered anywhere yet.
 */
export default function UseLater() {
  return (
    <div className={styles.mainGrid}>
      {/* Left Text */}
      <div className={styles.textCol}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          NEW LAUNCH &bull; BAILEY ROAD EXTENSION
        </div>

        <h2 className={styles.title}>
          Redefining <span className={styles.titleAccent}>Luxury</span>
          <br />
          Living in Patna
        </h2>

        <p className={styles.subtitle}>
          Experience extraordinary living at Patliputra Residences &mdash;
          Bihar&apos;s most prestigious gated community. High-rise 2, 3 &amp; 4
          BHK sky condominiums, world-class amenities, and unmatched capital
          appreciation for forward-thinking homeowners and investors.
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
  );
}
