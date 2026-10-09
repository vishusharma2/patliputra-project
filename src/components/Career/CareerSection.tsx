"use client";

import { useState } from "react";
import styles from "@/app/career/career.module.css";

export default function CareerSection() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    position: "",
    experience: "",
    portfolioUrl: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      await fetch("/api/career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch (err) {
      console.error("Error submitting application to server:", err);
    }
  };

  return (
    <>
      {/* Values Section */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.badge}>Why Work With Us</span>
            <h2 className={styles.title}>Build Your Future With Bihar&apos;s Pioneers</h2>
            <p className={styles.subtitle}>
              For over 35 years, Patliputra Group has fostered an environment of excellence, architectural innovation, and integrity.
            </p>
          </div>

          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>★</div>
              <h3 className={styles.valueTitle}>35+ Years Of Heritage</h3>
              <p className={styles.valueText}>
                Work on landmark residential high-rises and commercial complexes backed by trusted financial standing.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>⚡</div>
              <h3 className={styles.valueTitle}>Growth & Leadership</h3>
              <p className={styles.valueText}>
                Accelerated career progression with direct executive mentorship and skill development programs.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>♥</div>
              <h3 className={styles.valueTitle}>Culture of Transparency</h3>
              <p className={styles.valueText}>
                We prioritize ethical construction, safety on job sites, and empowering individual initiative.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🏆</div>
              <h3 className={styles.valueTitle}>Competitive Compensation</h3>
              <p className={styles.valueText}>
                Industry-leading salary structures, performance incentives, and comprehensive health protections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section (Replaces Job Cards List) */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.inlineFormBox} id="apply-now">
            <div className={styles.formHeader}>
              <span className={styles.formBadge}>Join Our Team</span>
              <h2 className={styles.formTitle}>Career Application Form</h2>
              <p className={styles.formDesc}>
                We are actively looking for passionate professionals across technical engineering, sales advisory, design, and operations. Submit your credentials below.
              </p>
            </div>

            {submitted ? (
              <div className={styles.successCard}>
                <div className={styles.successIcon}>✓</div>
                <h4>Application Successfully Received!</h4>
                <p>
                  Thank you, <strong>{form.fullName}</strong>. Your application for{" "}
                  <strong>{form.position}</strong> has been received. Our HR team will review your profile and reach out within 48 hours.
                </p>
                <button
                  type="button"
                  className={styles.submitBtn}
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      fullName: "",
                      phone: "",
                      email: "",
                      position: "",
                      experience: "",
                      portfolioUrl: "",
                      message: "",
                    });
                  }}
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label>Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={form.fullName}
                      onChange={(e) =>
                        setForm({ ...form, fullName: e.target.value })
                      }
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label>Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>
                  {/* Position as a simple text box - NO dropdown! */}
                  <div className={styles.formField}>
                    <label>Position Applying For *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Project Engineer, Sales Manager, Architect"
                      value={form.position}
                      onChange={(e) =>
                        setForm({ ...form, position: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label>Total Experience</label>
                    <input
                      type="text"
                      placeholder="e.g. 5 Years (or Fresher)"
                      value={form.experience}
                      onChange={(e) =>
                        setForm({ ...form, experience: e.target.value })
                      }
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>LinkedIn / Portfolio / Resume Link (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/... or drive link"
                      value={form.portfolioUrl}
                      onChange={(e) =>
                        setForm({ ...form, portfolioUrl: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className={styles.formField}>
                  <label>Cover Note / Brief Introduction (Optional)</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us briefly about your expertise, background, or any notes for our hiring team..."
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  Submit Application ➔
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
