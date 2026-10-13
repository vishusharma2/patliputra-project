"use client";

import { useState, FormEvent } from "react";
import styles from "./Newsletter.module.css";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const emailToSend = email;
    setIsSubmitting(true);

    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToSend }),
      });
      // Clear email field only after submission finishes
      setEmail("");
      setSubscribed(true);
    } catch (err) {
      console.error("Error subscribing to newsletter:", err);
      setEmail("");
      setSubscribed(true);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    }
  };

  return (
    <section className={styles.newsletterSection} aria-label="Newsletter Subscription">
      <div className="container">
        <div className={styles.newsletterBox}>
          <div className={styles.textContent}>
            <div className={styles.iconCircle}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div>
              <h3 className={styles.title}>SUBSCRIBE TO OUR NEWSLETTER</h3>
              <p className={styles.subtitle}>
                Get early-bird pricing on new project launches, market appreciation trends, and real estate insights.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                placeholder="Enter your email address"
                required
                disabled={isSubmitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                aria-label="Email Address for Newsletter"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.button}
                style={isSubmitting ? { opacity: 0.8, cursor: "not-allowed" } : undefined}
              >
                {isSubmitting ? "Subscribing..." : subscribed ? "Subscribed!" : "Subscribe"}
              </button>
            </div>
            {isSubmitting && (
              <div className="form-loading-bar-track" style={{ marginTop: "8px", marginBottom: "0" }}>
                <div className="form-loading-bar-fill" />
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
