import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner/PageBanner";
import styles from "../privacy/privacy.module.css";

export const metadata: Metadata = {
  title: "Terms & Conditions | Patliputra Group",
  description:
    "Official terms and conditions governing bookings, allotments, and digital communications for Patliputra Group properties.",
};

export default function TermsPage() {
  return (
    <main className={styles.legalPage}>
      <PageBanner
        title="TERM & CONDITION"
        highlightWord="CONDITION"
        subtitle="Standard guidelines and contractual terms governing property bookings, payment timelines, and statutory compliances."
        breadcrumb="Term & Condition"
      />

      <div className={styles.contentWrapper}>
        <div className={styles.lastUpdated}>Last Updated: October 2026</div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>01.</span> Acceptance of Terms
          </h2>
          <p className={styles.paragraph}>
            By accessing this portal, submitting enquiry forms, or executing expression of interest (EOI) / booking applications with Patliputra Group, you agree to be bound by the terms and conditions outlined herein. If you do not accept these terms, you should refrain from using our platforms or services.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>02.</span> Project Renderings & Specifications
          </h2>
          <p className={styles.paragraph}>
            All 3D artistic renderings, architectural mockups, walkthrough videos, floor dimensions, and specifications displayed across this website or marketing collaterals are indicative and intended for conceptual reference. Final delivered layouts and elevations will strictly conform to the RERA approved masterplans and the Agreement for Sale executed between the buyer and Patliputra Group.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>03.</span> Booking & Allotment Procedure
          </h2>
          <p className={styles.paragraph}>
            Unit allotment is subject to availability, receipt of the requisite booking advance, and execution of standard application documentation. Timely milestone disbursements as stipulated in the payment schedule form the essence of the allotment contract.
          </p>
          <ul className={styles.list}>
            <li>Payments must be made strictly via crossed account payee cheques, demand drafts, or verified RTGS/NEFT banking transfers in favour of the designated project RERA escrow account.</li>
            <li>Statutory levies, including GST, stamp duty, registration charges, and municipal fees, are payable by the purchaser in accordance with applicable government tax slabs.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>04.</span> Force Majeure & Delivery Timelines
          </h2>
          <p className={styles.paragraph}>
            Patliputra Group commits to handover timelines as approved by Bihar RERA. The company shall not be held liable for construction or possession delays caused by force majeure events, including natural catastrophes, regulatory delays beyond reasonable control, government embargoes, or court injunctions.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>05.</span> Dispute Resolution & Legal Jurisdiction
          </h2>
          <p className={styles.paragraph}>
            Any disputes, controversies, or claims arising from property transactions, agreements, or interpretation of these terms shall be subject to the exclusive jurisdiction of the competent courts of law and the Real Estate Regulatory Authority (RERA) located in <strong>Patna, Bihar, India</strong>.
          </p>
        </section>
      </div>
    </main>
  );
}
