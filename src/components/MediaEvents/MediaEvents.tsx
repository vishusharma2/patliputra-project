"use client";

import styles from "./MediaEvents.module.css";

interface MediaItem {
  id: string;
  source: string;
  date: string;
  headline: string;
  excerpt: string;
  image: string;
  tag: string;
}

const mediaItems: MediaItem[] = [
  {
    id: "m1",
    source: "HINDUSTAN TIMES",
    date: "MARCH 2024",
    headline: "Patliputra Group Unveils Bihar's Tallest Luxury Twin Towers on Bailey Road",
    excerpt:
      "Hon'ble dignitaries graced the foundation stone ceremony for Patliputra Twin Towers, marking a milestone in Bihar's urban development.",
    image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&q=80",
    tag: "PRESS RELEASE",
  },
  {
    id: "m2",
    source: "DAINIK JAGRAN",
    date: "JANUARY 2024",
    headline: "Real Estate Excellence Award 2024 Conferred to Patliputra Group for On-Time Delivery",
    excerpt:
      "Recognized by the National Real Estate Conclave for setting industry benchmarks in legal transparency, structural quality, and customer satisfaction.",
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&q=80",
    tag: "AWARDS & HONOURS",
  },
];

export default function MediaEvents() {
  return (
    <section id="media" className={styles.section} aria-label="Media and Events Coverage">
      <div className="container">
        <div className={styles.header}>
          <span className="section-label">In The News</span>
          <h2 className={styles.title}>
            MEDIA AND <span className={styles.goldText}>EVENTS</span>
          </h2>
          <p className={styles.subtitle}>
            NATIONAL AND REGIONAL COVERAGE OF OUR LANDMARK ACHIEVEMENTS AND COMMUNITY INAUGURATIONS
          </p>
        </div>

        <div className={styles.grid}>
          {mediaItems.map((item) => (
            <article key={item.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img
                  src={item.image}
                  alt={item.headline}
                  className={styles.image}
                  width={560}
                  height={320}
                  loading="lazy"
                />
                <span className={styles.tag}>{item.tag}</span>
              </div>

              <div className={styles.content}>
                <div className={styles.metaRow}>
                  <span className={styles.source}>{item.source}</span>
                  <span className={styles.bullet}>&bull;</span>
                  <span className={styles.date}>{item.date}</span>
                </div>

                <h3 className={styles.headline}>{item.headline}</h3>
                <p className={styles.excerpt}>{item.excerpt}</p>

                <a href="#contact" className={styles.readMore}>
                  Read Full Article
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
