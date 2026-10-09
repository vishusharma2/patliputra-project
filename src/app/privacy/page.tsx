import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner/PageBanner";
import styles from "./privacy.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy | Patliputra Group",
  description:
    "Learn how Patliputra Group protects, handles, and safeguards your personal data and privacy in compliance with Indian regulations.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className={styles.legalPage}>
      <PageBanner
        title="PRIVACY POLICY"
        highlightWord="PRIVACY"
        subtitle="Our commitment to safeguarding your personal information and maintaining complete digital transparency."
        breadcrumb="Privacy Policy"
      />

      <div className={styles.contentWrapper}>
        <div className={styles.lastUpdated}>Last Updated: October 2026</div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>01.</span> Introduction & Scope
          </h2>
          <p className={styles.paragraph}>
            Patliputra Group (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy outlines the types of data we collect, how it is used, stored, and protected when you interact with our official website, sales portals, and communication desks.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>02.</span> Information We Collect
          </h2>
          <p className={styles.paragraph}>
            When you explore our projects, request brochures, or submit inquiries for residential or commercial properties, we may collect:
          </p>
          <ul className={styles.list}>
            <li><strong>Personal Contact Information:</strong> Name, phone number, email address, postal address, and preferred consultation times.</li>
            <li><strong>Financial & Preference Data:</strong> Preferred apartment configuration, budget bracket, and home loan assistance requirements.</li>
            <li><strong>Digital Identifiers:</strong> IP address, device specifications, browser type, and interaction metrics on our website.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>03.</span> How We Use Your Data
          </h2>
          <p className={styles.paragraph}>
            Your information is processed exclusively for legitimate real estate business purposes:
          </p>
          <ul className={styles.list}>
            <li>Arranging personalized project site visits and virtual property walkthroughs.</li>
            <li>Sending construction milestone updates, floor plans, and price lists.</li>
            <li>Facilitating home loan eligibility pre-checks with authorized banking partners (with your explicit consent).</li>
            <li>Compliance with statutory RERA requirements and government regulatory reporting.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>04.</span> Data Security & Non-Disclosure
          </h2>
          <p className={styles.paragraph}>
            We strictly enforce that <strong>we do not sell, rent, or lease your personal information to third-party marketing companies</strong>. All customer records are stored on secure cloud servers with role-based access control and encryption standards.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>05.</span> Contact Grievance Officer
          </h2>
          <p className={styles.paragraph}>
            If you have questions regarding this Privacy Policy or wish to request data correction or deletion, please contact our Data Governance Officer at:
          </p>
          <p className={styles.paragraph}>
            <strong>Email:</strong> info@patliputragroup.com<br />
            <strong>Phone:</strong> +91 98765 43210<br />
            <strong>Address:</strong> Patliputra Colony, Main Road, Patna - 800013, Bihar, India
          </p>
        </section>
      </div>
    </main>
  );
}
