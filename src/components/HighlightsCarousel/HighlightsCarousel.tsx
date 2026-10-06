"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./HighlightsCarousel.module.css";

export interface CarouselSlide {
  title: string;
  image: string;
  alt?: string;
}

/**
 * Add your images to /public/img/carousel/ and update the paths below.
 * Any missing image falls back to an elegant gold/navy placeholder.
 */
const DEFAULT_SLIDES: CarouselSlide[] = [
  { title: "Residences", image: "/carousel/main-slider_slide1.webp" },
  { title: "Office Space", image: "/carousel/main-slider_slide2.webp" },
  { title: "Studio", image: "/carousel/main-slider_slide3.webp" },
  { title: "IT Park", image: "/carousel/main-slider_slide4.webp" },
  { title: "World Class Retail", image: "/carousel/main-slider_slide5.webp" },
  { title: "GYM", image: "/carousel/main-slider_slide6.webp" },
  { title: "Club House", image: "/carousel/main-slider_slide7.webp" },
  { title: "World Class Retail", image: "/carousel/main-slider_slide8.webp" },
  { title: "Restaurant", image: "/carousel/main-slider_slide9.webp" },
  { title: "Salon & Spa", image: "/carousel/main-slider_slide10.webp" },
  { title: "Swimming Pool", image: "/carousel/main-slider_slide11.webp" },
  { title: "Bar & Restaurant", image: "/carousel/main-slider_slide12.webp" },
  { title: "Ample Parking", image: "/carousel/main-slider_slide13.webp" },
];

const AUTOPLAY_MS = 4000;

interface Props {
  slides?: CarouselSlide[];
  autoplay?: boolean;
}

export default function HighlightsCarousel({
  slides = DEFAULT_SLIDES,
  autoplay = true,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [broken, setBroken] = useState<Record<number, boolean>>({});

  const getStep = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const card = track.querySelector<HTMLElement>(`.${styles.card}`);
    const gap = parseFloat(getComputedStyle(track).columnGap || "0");
    return card ? card.offsetWidth + gap : track.clientWidth;
  }, []);

  const updateState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setProgress(max > 0 ? track.scrollLeft / max : 0);
    setAtStart(track.scrollLeft <= 2);
    setAtEnd(track.scrollLeft >= max - 2);
  }, []);

  const scroll = useCallback(
    (dir: 1 | -1) => {
      const track = trackRef.current;
      if (!track) return;
      const max = track.scrollWidth - track.clientWidth;
      // Loop around at either end
      if (dir === 1 && track.scrollLeft >= max - 2) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else if (dir === -1 && track.scrollLeft <= 2) {
        track.scrollTo({ left: max, behavior: "smooth" });
      } else {
        track.scrollBy({ left: dir * getStep(), behavior: "smooth" });
      }
    },
    [getStep],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateState();
    track.addEventListener("scroll", updateState, { passive: true });
    window.addEventListener("resize", updateState);
    return () => {
      track.removeEventListener("scroll", updateState);
      window.removeEventListener("resize", updateState);
    };
  }, [updateState]);

  useEffect(() => {
    if (!autoplay || paused) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;
    const id = window.setInterval(() => scroll(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [autoplay, paused, scroll]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scroll(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scroll(-1);
    }
  };

  return (
    <div
      className={styles.carousel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Project highlights"
    >
      <div
        ref={trackRef}
        className={styles.track}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onTouchStart={() => setPaused(true)}
      >
        {slides.map((slide, i) => (
          <figure
            key={`${slide.title}-${i}`}
            className={styles.card}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}: ${slide.title}`}
            style={{ animationDelay: `${0.1 + i * 0.08}s` }}
          >
            {!broken[i] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={slide.image}
                alt={slide.alt ?? slide.title}
                className={styles.image}
                loading="lazy"
                draggable={false}
                ref={(el) => {
                  if (el && el.complete && el.naturalWidth === 0) {
                    setBroken((b) => (b[i] ? b : { ...b, [i]: true }));
                  }
                }}
                onError={() => setBroken((b) => ({ ...b, [i]: true }))}
              />
            ) : (
              <div className={styles.placeholder} aria-hidden="true">
                <span>{String(i + 1).padStart(2, "0")}</span>
              </div>
            )}
            <div className={styles.shade} />
            <figcaption className={styles.label}>
              <span>{slide.title}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className={styles.controls}>
        <div className={styles.progress} aria-hidden="true">
          <div
            className={styles.progressBar}
            style={{ transform: `scaleX(${Math.max(progress, 0.04)})` }}
          />
        </div>

        <div className={styles.buttons}>
          <button
            id="carousel-prev"
            type="button"
            className={styles.navBtn}
            onClick={() => scroll(-1)}
            aria-label="Previous slide"
            data-edge={atStart || undefined}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            id="carousel-next"
            type="button"
            className={styles.navBtn}
            onClick={() => scroll(1)}
            aria-label="Next slide"
            data-edge={atEnd || undefined}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
