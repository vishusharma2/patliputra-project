import Link from "next/link";
import styles from "./About.module.css";

export default function About() {
  return (
    <section id="about" className={styles.about} aria-label="About us">
      <div className={`container ${styles.wrapper}`}>
        <div className={styles.imageCol}>
          <div className={styles.imageGrid}>
            <div className={styles.imgMain}>
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"
                alt="Patliputra Residences luxury apartment exterior"
                loading="lazy"
                width={600}
                height={400}
              />
            </div>
            <div className={styles.imgAccent}>
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80"
                alt="Modern apartment interior design"
                loading="lazy"
                width={400}
                height={300}
              />
            </div>
          </div>
          <div className={styles.experience}>
            <span className={styles.expNumber}>15+</span>
            <span className={styles.expText}>Years of<br />Excellence</span>
          </div>
        </div>

        <div className={styles.textCol}>
          <span className="section-label">About Us</span>
          <h2 className="section-title">
            A Foundation of <em>Trust</em> & Timeless Living
          </h2>
          <p className={styles.description}>
            Patliputra Residences represents the pinnacle of residential luxury in Patna.
            Born from a vision to create spaces that inspire, our project seamlessly blends
            contemporary architecture with the rich heritage of this ancient city.
          </p>
          <p className={styles.description}>
            Every detail has been meticulously crafted — from the imported marble flooring to
            the panoramic floor-to-ceiling windows, from the zen-inspired landscaped gardens
            to the state-of-the-art smart home systems. This is not just a home; it&apos;s a
            statement of refined living.
          </p>

          <div className={styles.highlights}>
            <div className={styles.highlight}>
              <div className={styles.highlightIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              </div>
              <div>
                <strong>RERA Approved</strong>
                <p>Fully compliant with all regulatory approvals</p>
              </div>
            </div>
            <div className={styles.highlight}>
              <div className={styles.highlightIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div>
                <strong>Premium Quality</strong>
                <p>Earthquake-resistant RCC frame structure</p>
              </div>
            </div>
            <div className={styles.highlight}>
              <div className={styles.highlightIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
              <div>
                <strong>On-Time Delivery</strong>
                <p>Track record of timely project completion</p>
              </div>
            </div>
          </div>

          <Link href="/contact" className="btn btn--primary">
            Schedule Site Visit
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
