"use client";

import { useState, useEffect } from "react";
import styles from "./MediaEvents.module.css";

interface MediaItem {
  id: string;
  category: "clipping" | "release";
  source: string;
  date: string;
  headline: string;
  englishTitle?: string;
  excerpt: string;
  image: string;
  tag: string;
  highlights?: string[];
  isClipping?: boolean;
}

export default function MediaEvents() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [activeModalItem, setActiveModalItem] = useState<MediaItem | null>(
    null,
  );

  useEffect(() => {
    fetch("/api/admin/news")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch news");
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setItems(data);
        }
      })
      .catch((err) => {
        console.error("Error fetching news from Supabase:", err);
      });
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModalItem(null);
      }
    };
    if (activeModalItem) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeModalItem]);

  return (
    <section
      id="media"
      className={styles.section}
      aria-label="Media and Events Coverage"
    >
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className="section-label">Press & Publications</span>
          <h2 className={styles.title}>
            MEDIA AND <span className={styles.goldText}>PRESS COVERAGE</span>
          </h2>
          <p className={styles.subtitle}>
            NATIONAL & REGIONAL NEWSPAPER PUBLICATIONS, INAUGURATION MILESTONES,
            AND INDUSTRY RECOGNITION
          </p>
        </div>

        {/* Media Grid */}
        <div className={styles.grid}>
          {items.map((item) => (
            <article
              key={item.id}
              className={`${styles.card} ${item.isClipping ? styles.cardClipping : ""}`}
            >
              {/* Media Image / Newspaper Preview */}
              <div
                className={`${styles.imageWrapper} ${item.isClipping ? styles.clippingImageWrapper : ""}`}
                onClick={() => item.isClipping && setActiveModalItem(item)}
                style={{ cursor: item.isClipping ? "pointer" : "default" }}
                title={
                  item.isClipping
                    ? "Click to view full newspaper clipping"
                    : undefined
                }
              >
                <img
                  src={item.image}
                  alt={item.headline}
                  className={`${styles.image} ${item.isClipping ? styles.clippingImg : ""}`}
                  width={600}
                  height={420}
                  loading="lazy"
                />
                <span className={styles.tag}>{item.tag}</span>

                {item.isClipping && (
                  <div className={styles.zoomOverlay}>
                    <span className={styles.zoomPill}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                      Click to Enlarge Newspaper
                    </span>
                  </div>
                )}
              </div>

              {/* Content Box */}
              <div className={styles.content}>
                <div className={styles.metaRow}>
                  <span className={styles.source}>{item.source}</span>
                  <span className={styles.bullet}>&bull;</span>
                  <span className={styles.date}>{item.date}</span>
                </div>

                <h3 className={styles.headline}>{item.headline}</h3>

                {item.englishTitle && (
                  <h4 className={styles.englishSub}>{item.englishTitle}</h4>
                )}

                <p className={styles.excerpt}>{item.excerpt}</p>

                {/* Highlights tags */}
                {item.highlights && item.highlights.length > 0 && (
                  <div className={styles.highlightsRow}>
                    {item.highlights.map((h) => (
                      <span key={h} className={styles.highlightBadge}>
                        {h}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className={styles.actionRow}>
                  {item.isClipping ? (
                    <button
                      type="button"
                      className={styles.viewClippingBtn}
                      onClick={() => setActiveModalItem(item)}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      Read Full Newspaper Clipping
                    </button>
                  ) : (
                    <a href="#contact" className={styles.readMore}>
                      Inquire About Press Release
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Full-Screen High-Resolution Lightbox Modal */}
      {activeModalItem && (
        <div
          className={styles.modalOverlay}
          onClick={() => setActiveModalItem(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Newspaper Clipping Preview"
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalMeta}>
                <span className={styles.modalSource}>
                  {activeModalItem.source}
                </span>
                <span className={styles.modalBullet}>•</span>
                <span className={styles.modalDate}>{activeModalItem.date}</span>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setActiveModalItem(null)}
                aria-label="Close modal"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              <img
                src={activeModalItem.image}
                alt={activeModalItem.headline}
                className={styles.modalImage}
              />
            </div>

            <div className={styles.modalFooter}>
              <h4 className={styles.modalHeadline}>
                {activeModalItem.headline}
              </h4>
              <p className={styles.modalExcerpt}>{activeModalItem.excerpt}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
