"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import styles from "./Landmarks.module.css";

interface Landmark {
  title: string;
  badge: string;
  image: string;
}

const landmarks: Landmark[] = [
  {
    title: "5 Star Hotel in Mussoorie",
    badge: "5 Star Hotel",
    image: "/img/landmarks/Mussoorie_Hotel.png",
  },
  {
    title: "5 Star Hotel in Ranchi",
    badge: "5 Star Hotel",
    image: "/img/landmarks/Ranchi_Hotel.png",
  },
  {
    title: "Patliputra Park in Patna - Saguna More",
    badge: "Park",
    image: "/img/landmarks/Patliputra_Park.png",
  },
  {
    title: "5 Star Hotel in Greater Noida",
    badge: "5 Star Hotel",
    image: "/img/landmarks/GreaterNoida_Hotel.png",
  },
];

export default function Landmarks() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(2);
  const [paused, setPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  // Responsive items count
  const updateVisibleCount = useCallback(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth <= 900) {
      setVisibleCount(1);
    } else {
      setVisibleCount(2);
    }
  }, []);

  useEffect(() => {
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, [updateVisibleCount]);

  // Max starting index
  const maxIndex = useMemo(() => {
    return Math.max(0, landmarks.length - visibleCount);
  }, [visibleCount]);

  // Clamp current index if bounds change
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [currentIndex, maxIndex]);

  // Next / Prev slide handlers with wrap-around
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Autoplay
  useEffect(() => {
    if (paused || isDragging || maxIndex === 0) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [paused, isDragging, maxIndex, handleNext]);

  // Drag / Swipe handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragOffset(0);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    setDragOffset(deltaX);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 50;
    if (dragOffset < -threshold) {
      handleNext();
    } else if (dragOffset > threshold) {
      handlePrev();
    }
    setDragOffset(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <section
      id="landmarks"
      className={styles.section}
      aria-label="Upcoming Landmarks"
    >
      <div className="container">
        <div className={styles.header}>
          <span className="section-label">City Infrastructure</span>
          <h2 className={styles.title}>
            VISIT BEYOND RESIDENCES:{" "}
            <span className={styles.goldText}>UPCOMING LANDMARKS</span>
          </h2>
          <p className={styles.subtitle}>
            SHAPING PATNA&apos;S FUTURE WITH DESTINATIONS FOR SHOPPING, LEISURE,
            AND CELEBRATION
          </p>
        </div>

        <div
          className={styles.carouselContainer}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Side Navigation Arrow: Previous */}
          <button
            type="button"
            className={`${styles.navBtn} ${styles.prevBtn}`}
            onClick={handlePrev}
            aria-label="Previous landmark slide"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Side Navigation Arrow: Next */}
          <button
            type="button"
            className={`${styles.navBtn} ${styles.nextBtn}`}
            onClick={handleNext}
            aria-label="Next landmark slide"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Carousel Viewport */}
          <div
            className={styles.carouselViewport}
            style={
              {
                "--current-index": currentIndex,
                "--drag-offset": `${dragOffset}px`,
              } as React.CSSProperties
            }
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            aria-roledescription="carousel"
            aria-label="Upcoming landmarks carousel"
          >
            <div
              className={`${styles.carouselTrack} ${
                isDragging ? styles.trackDragging : ""
              }`}
            >
              {landmarks.map((l, index) => (
                <div
                  key={l.title}
                  className={styles.slideItem}
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${landmarks.length}: ${l.title}`}
                >
                  <article className={styles.card}>
                    <div className={styles.imageBox}>
                      <img
                        src={l.image}
                        alt={`${l.title} - ${l.badge}`}
                        className={styles.image}
                        width={600}
                        height={460}
                        loading="lazy"
                        draggable={false}
                      />
                      <div className={styles.overlay} />
                      <div className={styles.cardOverlayContent}>
                        <span className={styles.badge}>{l.badge}</span>
                        <h3 className={styles.landmarkTitle}>{l.title}</h3>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Controls Bar: Dots + Counter + Mobile Arrows */}
          <div className={styles.controlsBar}>
            {/* Pagination Dots */}
            <div
              className={styles.dotsGroup}
              role="tablist"
              aria-label="Landmarks pagination"
            >
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.dot} ${
                    currentIndex === idx ? styles.dotActive : ""
                  }`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-selected={currentIndex === idx}
                  role="tab"
                />
              ))}
            </div>

            {/* Slide Counter & Mobile Arrows */}
            <div className={styles.counterGroup}>
              <div className={styles.slideCounter} aria-live="polite">
                <span className={styles.currentNum}>
                  {String(currentIndex + 1).padStart(2, "0")}
                </span>{" "}
                / {String(maxIndex + 1).padStart(2, "0")}
              </div>

              <div className={styles.mobileNav}>
                <button
                  type="button"
                  className={styles.mobileNavBtn}
                  onClick={handlePrev}
                  aria-label="Previous slide"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={styles.mobileNavBtn}
                  onClick={handleNext}
                  aria-label="Next slide"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
