"use client";

import styles from "./CapitalGains.module.css";

export default function CapitalGains() {
  return (
    <section className={styles.section} aria-label="Investment Performance">
      <div className="container">
        <div className={styles.innerBox}>
          <span className="section-label">Investment Performance</span>
          <h2 className={styles.title}>
            FROM <span className={styles.goldText}>CONCRETE</span> TO CAPITAL GAINS
          </h2>
          <p className={styles.subtitle}>
            WITH OVER TWO DECADES OF PIONEERING LANDMARK RESIDENTIAL &amp; COMMERCIAL CORRIDORS IN BIHAR,
            PATLIPUTRA DEVELOPMENTS HAVE DELIVERED UP TO 300% WEALTH APPRECIATION FOR PRUDENT INVESTORS.
          </p>

          <div className={styles.metricsGrid}>
            <div className={styles.metricItem}>
              <span className={styles.metricNumber}>25+</span>
              <span className={styles.metricLabel}>Years Of Legacy</span>
            </div>
            <div className={styles.metricDivider} />
            <div className={styles.metricItem}>
              <span className={styles.metricNumber}>4.8M+</span>
              <span className={styles.metricLabel}>Sq. Ft. Delivered</span>
            </div>
            <div className={styles.metricDivider} />
            <div className={styles.metricItem}>
              <span className={styles.metricNumber}>300%</span>
              <span className={styles.metricLabel}>Max Capital Gains</span>
            </div>
            <div className={styles.metricDivider} />
            <div className={styles.metricItem}>
              <span className={styles.metricNumber}>8,500+</span>
              <span className={styles.metricLabel}>Happy Homeowners</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
