"use client";

import { useState, useEffect, useCallback } from "react";
import PageBanner from "@/components/PageBanner/PageBanner";
import styles from "./blogs.module.css";
import { BlogArticle, DEFAULT_BLOGS } from "@/types/blogs";

// Helper to format any date string for clean presentation (e.g. "2026-10-10" -> "10-October 2026")
function formatBlogDate(dateStr: string) {
  if (!dateStr) return "07-August 2025";
  const clean = dateStr.trim();
  const isoMatch = clean.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthIdx = parseInt(isoMatch[2], 10) - 1;
    return `${isoMatch[3].padStart(2, "0")}-${months[monthIdx] || "January"} ${isoMatch[1]}`;
  }
  return dateStr;
}

// Helper to parse date string into ribbon components (day, month, year)
function parseDateRibbon(dateStr: string) {
  if (!dateStr) return { day: "07-", month: "AUGUST", year: "2025" };
  const clean = dateStr.trim();

  // Pattern: "YYYY-MM-DD" e.g. "2026-10-10"
  const isoMatch = clean.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    const months = [
      "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
      "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ];
    const monthIdx = parseInt(isoMatch[2], 10) - 1;
    return {
      day: `${isoMatch[3].padStart(2, "0")}-`,
      month: months[monthIdx] || "JANUARY",
      year: isoMatch[1],
    };
  }

  // Pattern: "07-August 2025" or "07-Aug-2025"
  const dashMatch = clean.match(/^(\d{1,2})-?\s*([a-zA-Z]+)[,\s-]+(\d{4})/);
  if (dashMatch) {
    return {
      day: `${dashMatch[1].padStart(2, "0")}-`,
      month: dashMatch[2].toUpperCase(),
      year: dashMatch[3],
    };
  }

  // Pattern: "August 07, 2025"
  const textMatch = clean.match(/^([a-zA-Z]+)\s*(\d{1,2})[,\s-]+(\d{4})/);
  if (textMatch) {
    return {
      day: `${textMatch[2].padStart(2, "0")}-`,
      month: textMatch[1].toUpperCase(),
      year: textMatch[3],
    };
  }

  return { day: "07-", month: "AUGUST", year: "2025" };
}

export default function BlogsPage() {
  const [blogsList, setBlogsList] = useState<BlogArticle[]>(DEFAULT_BLOGS);
  const [selectedBlog, setSelectedBlog] = useState<BlogArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dynamic blogs from Supabase API
  useEffect(() => {
    fetch("/api/admin/blogs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBlogsList(data);
        }
      })
      .catch((err) => console.error("Error fetching blogs:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Handle ESC key to close modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedBlog) {
        setSelectedBlog(null);
      }
    },
    [selectedBlog]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selectedBlog) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedBlog]);

  // Current index in modal for next/prev navigation
  const currentIndex = selectedBlog
    ? blogsList.findIndex((b) => b.id === selectedBlog.id)
    : -1;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedBlog(blogsList[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < blogsList.length - 1) {
      setSelectedBlog(blogsList[currentIndex + 1]);
    }
  };

  return (
    <main className={styles.blogsPage}>
      <PageBanner
        title="LATEST ANNOUNCEMENTS & BLOGS"
        highlightWord="BLOGS"
        subtitle="Exclusive project updates, guaranteed return offers, and regional investment insights by Patliputra Group."
        breadcrumb="Blogs & Offers"
      />

      <section className={styles.section}>
        <div className="container">
          {/* Header Intro */}
          <div className={styles.headerIntro}>
            <span className={styles.sectionLabel}>Corporate Insights</span>
            <h2 className={styles.pageTitle}>
              INVESTMENT DESTINATIONS &amp;{" "}
              <span className={styles.goldText}>PROJECT RELEASES</span>
            </h2>
            <p className={styles.pageSubtitle}>
              Click on any update below to view complete project guidelines,
              investment offers, RERA certificates, and direct booking details.
            </p>
          </div>

          {/* Blogs Grid */}
          <div className={styles.grid}>
            {blogsList.map((blog) => {
              const ribbon = parseDateRibbon(blog.date);
              return (
                <article
                  key={blog.id}
                  className={styles.blogCard}
                  onClick={() => setSelectedBlog(blog)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${blog.title}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedBlog(blog);
                    }
                  }}
                >
                  <div className={styles.imgWrap}>
                    {/* Yellow/Gold Date Ribbon Badge */}
                    <div className={styles.dateRibbon} aria-hidden="true">
                      <span className={styles.ribbonDay}>{ribbon.day}</span>
                      <span className={styles.ribbonMonth}>{ribbon.month}</span>
                      <span className={styles.ribbonYear}>{ribbon.year}</span>
                    </div>

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className={styles.blogImg}
                      loading="lazy"
                    />
                  </div>

                  <div className={styles.cardInfo}>
                    <h3 className={styles.cardTitle}>{blog.title}</h3>
                    <div className={styles.authorRow}>
                      <svg
                        className={styles.authorIcon}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span>By {blog.author || "Patliputra"}</span>
                    </div>
                    <span className={styles.viewDetailsHint}>
                      View Full Details &rarr;
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Bottom Recent Posts Strip (matching screenshot footer style) */}
          <div className={styles.recentPostsStrip}>
            <div className={styles.recentTitle}>
              <span className={styles.recentBar} />
              <span>RECENT POSTS</span>
            </div>
            <div className={styles.recentGrid}>
              {blogsList.map((b) => (
                <div
                  key={b.id}
                  className={styles.recentItem}
                  onClick={() => setSelectedBlog(b)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedBlog(b);
                    }
                  }}
                >
                  <div className={styles.recentThumb}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={b.image} alt={b.title} loading="lazy" />
                  </div>
                  <div className={styles.recentInfo}>
                    <h4 className={styles.recentItemTitle}>{b.title}</h4>
                    <p className={styles.recentItemAuthor}>
                      By {b.author || "Patliputra"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DETAIL CARD MODAL (Opened on click - no page navigation!) */}
      {selectedBlog && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setSelectedBlog(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedBlog.title}
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={() => setSelectedBlog(null)}
              aria-label="Close details"
            >
              &times;
            </button>

            <div className={styles.modalContent}>
              {/* Header: Title & Meta */}
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>{selectedBlog.title}</h2>
                <div className={styles.modalMetaRow}>
                  <span className={styles.metaItem}>
                    <span>📅</span>
                    <span>{formatBlogDate(selectedBlog.date)}</span>
                  </span>
                  <span className={styles.metaItem}>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>By {selectedBlog.author || "Patliputra"}</span>
                  </span>
                </div>
              </div>

              {/* Large Centered Poster Image */}
              <div className={styles.posterWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedBlog.image}
                  alt={selectedBlog.title}
                  className={styles.posterImg}
                />
              </div>

              {/* Subtitle & Introduction */}
              <div className={styles.detailSection}>
                {selectedBlog.subtitle && (
                  <h3 className={styles.detailSubtitle}>
                    {selectedBlog.subtitle}
                  </h3>
                )}
                {selectedBlog.description && (
                  <p className={styles.detailDesc}>
                    {selectedBlog.description}
                  </p>
                )}
              </div>

              {/* Limited-Time Investment Offer */}
              {selectedBlog.offers && selectedBlog.offers.length > 0 && (
                <div className={styles.sectionBlock}>
                  <h4 className={styles.sectionBlockTitle}>
                    <span>💼</span>
                    <span>Limited-Time Investment Offer</span>
                  </h4>
                  <ul className={styles.bulletList}>
                    {selectedBlog.offers.map((offer, idx) => (
                      <li key={idx} className={styles.bulletItem}>
                        <span className={styles.bulletIcon}>•</span>
                        <span>{offer}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Project Highlights */}
              {selectedBlog.highlights &&
                selectedBlog.highlights.length > 0 && (
                  <div className={styles.sectionBlock}>
                    <h4 className={styles.sectionBlockTitle}>
                      <span>📍</span>
                      <span>Project Highlights</span>
                    </h4>
                    <ul className={styles.bulletList}>
                      {selectedBlog.highlights.map((item, idx) => (
                        <li key={idx} className={styles.bulletItem}>
                          <span className={styles.bulletIcon}>•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Why Invest Now? */}
              {selectedBlog.whyInvest && selectedBlog.whyInvest.length > 0 && (
                <div className={styles.sectionBlock}>
                  <h4 className={styles.sectionBlockTitle}>
                    <span>💡</span>
                    <span>Why Invest Now?</span>
                  </h4>
                  <ul className={styles.bulletList}>
                    {selectedBlog.whyInvest.map((point, idx) => (
                      <li key={idx} className={styles.bulletItem}>
                        <span className={styles.checkIcon}>✅</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contact & Booking Information */}
              <div className={styles.contactBox}>
                <div className={styles.contactRow}>
                  <span>📞</span>
                  <span>
                    Call Now to Book Your Unit:{" "}
                    <a
                      href={`tel:${(
                        selectedBlog.contactPhone || "+91 9771417077"
                      ).replace(/\s+/g, "")}`}
                      className={styles.phoneLink}
                    >
                      {selectedBlog.contactPhone || "+91 9771417077"}
                    </a>
                  </span>
                </div>
                {selectedBlog.patnaOffice && (
                  <div className={styles.officeText}>
                    <span>📍</span>
                    <span>
                      <strong>Patna Office:</strong> {selectedBlog.patnaOffice}
                    </span>
                  </div>
                )}
                {selectedBlog.noidaOffice && (
                  <div className={styles.officeText}>
                    <span>📍</span>
                    <span>
                      <strong>Greater Noida Office:</strong>{" "}
                      {selectedBlog.noidaOffice}
                    </span>
                  </div>
                )}

                <div className={styles.modalActions}>
                  <a
                    href={`tel:${(
                      selectedBlog.contactPhone || "+91 9771417077"
                    ).replace(/\s+/g, "")}`}
                    className={styles.callBtn}
                  >
                    <span>📞</span> Call Unit Specialist
                  </a>
                  <a
                    href={`https://wa.me/919771417077?text=${encodeURIComponent(
                      `Hello Patliputra Group, I am interested in "${selectedBlog.title}" and would like more details.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappBtn}
                  >
                    <span>💬</span> WhatsApp Enquiry
                  </a>
                </div>
              </div>

              {/* Prev / Next Blog Quick Navigation */}
              <div className={styles.modalNavRow}>
                <button
                  type="button"
                  className={styles.modalNavBtn}
                  onClick={handlePrev}
                  disabled={currentIndex <= 0}
                >
                  &larr; Previous Update
                </button>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  {currentIndex + 1} of {blogsList.length}
                </span>
                <button
                  type="button"
                  className={styles.modalNavBtn}
                  onClick={handleNext}
                  disabled={currentIndex >= blogsList.length - 1}
                >
                  Next Update &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
