"use client";

import styles from "./CapitalGains.module.css";

export default function CapitalGains() {
  return (
    <section className={styles.section} aria-label="Investment Performance">
      <div className="container">
        <div className={styles.innerBox}>
          <span className="section-label">Investment Performance</span>
          <h2 className={styles.title}>
            FROM <span className={styles.goldText}>CONCRETE</span> TO CAPITAL
            GAINS
          </h2>
          <p className={styles.subtitle}>
            With 11 landmark projects and more than 35 years of proven
            performance, Patliputra Group has built a legacy of creating lasting
            value, delivering consistent growth, and earning the trust of
            generations of investors.
          </p>
          <p className={styles.subtitle}>
            Backed by elite investors across Bihar, Haryana, Jharkhand & Uttar
            Pradesh, we continue to deliver growth with every project.
          </p>

          <div className={styles.metricsGrid}>
            <div className={styles.metricItem}>
              <span className={styles.metricNumber}>35+</span>
              <span className={styles.metricLabel}>Years Of Legacy</span>
            </div>
            <div className={styles.metricDivider} />
            <div className={styles.metricItem}>
              <span className={styles.metricNumber}>50L+</span>
              <span className={styles.metricLabel}>
                Sq. Ft. Delivered Since 1989
              </span>
            </div>
            <div className={styles.metricDivider} />
            <div className={styles.metricItem}>
              <span className={styles.metricNumber}>Projects</span>
              <span className={styles.metricLabel}>
                across Bihar, Haryana , Jharkhand & Uttar Pradesh
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
