"use client";

import styles from "./Amenities.module.css";

interface Amenity {
  icon: string;
  title: string;
}

const amenities: Amenity[] = [
  { icon: "🏊", title: "Swimming Pool" },
  { icon: "🏋️", title: "Fitness Center" },
  { icon: "🧖", title: "Spa & Sauna" },
  { icon: "🎾", title: "Tennis Court" },
  { icon: "🏸", title: "Badminton Court" },
  { icon: "🎮", title: "Gaming Zone" },
  { icon: "🌳", title: "Jogging Track" },
  { icon: "👶", title: "Kids Play Area" },
  { icon: "📚", title: "Library Lounge" },
  { icon: "🎬", title: "Mini Theater" },
  { icon: "🧘", title: "Yoga Deck" },
  { icon: "☕", title: "Café Lounge" },
  { icon: "🏢", title: "Business Center" },
  { icon: "🎪", title: "Party Hall" },
  { icon: "🏥", title: "Medical Room" },
  { icon: "⚡", title: "EV Charging" },
];

export default function Amenities() {
  return (
    <section id="amenities" className={styles.amenities} aria-label="Amenities">
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.imageCol}>
            <div className={styles.imageStack}>
              <img
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80"
                alt="Luxury swimming pool at Patliputra Residences"
                loading="lazy"
                className={styles.imgPrimary}
                width={600}
                height={700}
              />
              <div className={styles.imgOverlay}>
                <span className={styles.overlayNumber}>40+</span>
                <span className={styles.overlayText}>Premium Amenities</span>
              </div>
            </div>
          </div>

          <div className={styles.contentCol}>
            <span className="section-label">Amenities</span>
            <h2 className="section-title">
              Experience <em>Luxury</em> at Every Turn
            </h2>
            <p className="section-subtitle">
              From sunrise yoga sessions to midnight movie screenings — discover a
              lifestyle that leaves nothing to desire.
            </p>

            <div className={styles.grid}>
              {amenities.map((amenity) => (
                <div key={amenity.title} className={styles.item}>
                  <span className={styles.itemIcon}>{amenity.icon}</span>
                  <span className={styles.itemTitle}>{amenity.title}</span>
                </div>
              ))}
            </div>

            <a href="#contact" className="btn btn--primary">
              Download Brochure
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
