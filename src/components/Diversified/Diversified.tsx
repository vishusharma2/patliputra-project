"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import styles from "./Diversified.module.css";

export interface BusinessSector {
  id: string;
  title: string;
  category: "HOTEL" | "RESORT" | "HOSPITAL" | "SCHOOL";
  categoryLabel: string;
  categoryFilter: "hospitality" | "healthcare" | "education";
  location: string;
  tagline: string;
  image: string;
  description: string;
  features: string[];
  stats: { label: string; value: string }[];
  address: string;
  contactInfo: string;
  highlights: string[];
}

const SECTORS: BusinessSector[] = [
  {
    id: "patliputra-exotica",
    title: "Hotel Patliputra Exotica",
    category: "HOTEL",
    categoryLabel: "4-Star Luxury Business Hotel",
    categoryFilter: "hospitality",
    location: "Exhibition Road, Patna",
    tagline: "Premier 4-Star Hospitality & Grand Banqueting Landmark",
    image: "/img/Business/delivered_exotica.webp",
    description:
      "Patna's distinguished luxury business hotel offering plush executive suites, signature fine dining at Bawarchi, versatile conference facilities, and majestic celebration halls.",
    features: [
      "4-Star Executive Rooms",
      "Bawarchi Multi-Cuisine Fine Dine",
      "Grand Banquets & Ballrooms",
      "24/7 Corporate Business Hub",
    ],
    stats: [
      { label: "Rating", value: "4-Star" },
      { label: "Accommodations", value: "70+ Rooms" },
      { label: "Banquets", value: "3 Grand Halls" },
    ],
    address: "Exhibition Road, Near Gandhi Maidan, Patna, Bihar 800001",
    contactInfo: "+91 98765 43210",
    highlights: [
      "Prime central commercial hub location with seamless transit connectivity",
      "Signature Bawarchi restaurant serving acclaimed North Indian, Mughlai & Oriental cuisine",
      "Comprehensive high-tech conference spaces for corporate conventions",
      "Dedicated concierge, valet parking, and luxury airport transfers",
    ],
  },
  {
    id: "patliputra-nirvana",
    title: "Hotel Patliputra Nirvana",
    category: "HOTEL",
    categoryLabel: "Boutique Urban Hotel",
    categoryFilter: "hospitality",
    location: "Buddha Colony / Boring Road, Patna",
    tagline: "Tranquil Boutique Hospitality & Curated Dining Ambience",
    image: "/img/Business/delivered_nirvana.webp",
    description:
      "An exquisite boutique urban retreat combining serene zen aesthetics with personalized hospitality, handcrafted culinary delights, and private banqueting spaces crafted for memorable stays.",
    features: [
      "Designer Boutique Suites",
      "Themed Ambient Restaurant",
      "Bespoke Event Spaces",
      "24/7 Personalized Concierge",
    ],
    stats: [
      { label: "Ambiance", value: "Zen Boutique" },
      { label: "Dining", value: "Curated Cuisine" },
      { label: "Location", value: "Buddha Colony" },
    ],
    address: "Buddha Colony, Off Boring Canal Road, Patna, Bihar 800001",
    contactInfo: "+91 98765 43210",
    highlights: [
      "Calm, aesthetic environment nestled in central Patna",
      "Thoughtfully appointed rooms with contemporary conveniences",
      "Intimate venue for social gatherings, engagements, and corporate meetings",
      "Dedicated guest services and prompt room assistance",
    ],
  },
  {
    id: "alina-resort",
    title: "Alina Resort",
    category: "RESORT",
    categoryLabel: "Destination Resort & Events",
    categoryFilter: "hospitality",
    location: "Patna Outskirts, Bihar",
    tagline: "Luxury Poolside Paradise & Grand Wedding Haven",
    image: "/img/Business/delivered_alina.webp",
    description:
      "An expansive leisure resort featuring sparkling swimming pools, lush landscaped party lawns, poolside gazebos, and grand catering designed for fairytale weddings and weekend retreats.",
    features: [
      "Open-Air Designer Pool",
      "1,000+ Guest Wedding Lawns",
      "Poolside Cabanas & Lounge",
      "Weekend Leisure & Banquets",
    ],
    stats: [
      { label: "Venue Type", value: "Resort & Lawns" },
      { label: "Capacity", value: "1,000+ Guests" },
      { label: "Setting", value: "Poolside Greenery" },
    ],
    address: "Patna - Gaya Highway Corridor, Patna Outskirts, Bihar",
    contactInfo: "+91 98765 43210",
    highlights: [
      "Spacious open-air swimming pool with sun lounge deck",
      "Massive manicured lawns ideal for grand destination weddings & galas",
      "Dedicated catering kitchens and VIP dressing suites",
      "Tranquil getaway away from urban noise with ample valet parking",
    ],
  },
  {
    id: "mims-hospital",
    title: "MIMS Hospital",
    category: "HOSPITAL",
    categoryLabel: "Super-Speciality Healthcare",
    categoryFilter: "healthcare",
    location: "Bihar",
    tagline: "Advanced Critical Care & Compassionate Medical Services",
    image: "/img/Business/delivered_mims.webp",
    description:
      "A state-of-the-art multi-speciality medical complex providing round-the-clock emergency trauma services, modern ICU facilities, diagnostic laboratories, and super-specialist healthcare.",
    features: [
      "24/7 Trauma & Emergency",
      "Modular OTs & Advanced ICUs",
      "NABL-Standard Pathology",
      "Multi-Speciality Consultations",
    ],
    stats: [
      { label: "Emergency", value: "24/7 Service" },
      { label: "Care Units", value: "Advanced ICU" },
      { label: "Departments", value: "Multi-Speciality" },
    ],
    address: "Medical Hub Corridor, Bihar",
    contactInfo: "+91 98765 43210",
    highlights: [
      "Round-the-clock emergency casualty and trauma response team",
      "Fully equipped critical care unit with modern ventilators and monitors",
      "Digital imaging, ultrasound, and comprehensive diagnostic laboratory",
      "In-house emergency pharmacy and dedicated ambulance fleet",
    ],
  },
  {
    id: "babu-g-vidyamandir",
    title: "Babu G Vidyamandir",
    category: "SCHOOL",
    categoryLabel: "Academic Institution",
    categoryFilter: "education",
    location: "Bihar",
    tagline: "Excellence in Comprehensive Education & Character Building",
    image: "/img/Business/delivered_school.webp",
    description:
      "A premier co-educational institution nurturing academic excellence, holistic personality development, smart digital classrooms, and extensive sports facilities for future leaders.",
    features: [
      "Smart Interactive Classrooms",
      "Modern STEM & Science Labs",
      "Expansive Athletic Grounds",
      "Holistic Value-Based Learning",
    ],
    stats: [
      { label: "Campus", value: "Expansive Green" },
      { label: "Education", value: "Comprehensive" },
      { label: "Activities", value: "Sports & Arts" },
    ],
    address: "Campus Enclave, Bihar",
    contactInfo: "+91 98765 43210",
    highlights: [
      "Wide open campus with full-sized athletic grounds and play courts",
      "Dedicated computer labs, library, and science practical rooms",
      "Experienced faculty focusing on intellectual, moral, and physical growth",
      "Safe and secure campus environment with transport facilities",
    ],
  },
];

type FilterType = "all" | "hospitality" | "healthcare" | "education";

export default function Diversified() {
  const [sectors, setSectors] = useState<BusinessSector[]>(SECTORS);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [selectedSector, setSelectedSector] = useState<BusinessSector | null>(null);

  useEffect(() => {
    fetch("/api/admin/diversified")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSectors(data);
        }
      })
      .catch((err) => console.error("Error fetching diversified sectors:", err));
  }, []);

  // Drag / swipe states
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  // Filtered items
  const filteredSectors = useMemo(() => {
    if (activeFilter === "all") return sectors;
    return sectors.filter((s) => s.categoryFilter === activeFilter);
  }, [activeFilter, sectors]);

  // Update visible items count based on responsive breakpoint
  const updateVisibleCount = useCallback(() => {
    if (typeof window === "undefined") return;
    const width = window.innerWidth;
    if (width <= 640) {
      setVisibleCount(1);
    } else if (width <= 1024) {
      setVisibleCount(2);
    } else {
      setVisibleCount(3);
    }
  }, []);

  useEffect(() => {
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, [updateVisibleCount]);

  // Max index possible
  const maxIndex = useMemo(() => {
    return Math.max(0, filteredSectors.length - visibleCount);
  }, [filteredSectors.length, visibleCount]);

  // Reset index when filter or maxIndex changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeFilter]);

  // Next / Prev slide handlers with infinite loop
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Autoplay
  useEffect(() => {
    if (paused || selectedSector !== null || maxIndex === 0) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4500);

    return () => clearInterval(interval);
  }, [paused, selectedSector, maxIndex, handleNext]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedSector) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedSector]);

  // Pointer drag gestures
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button, a")) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragOffset(0);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - dragStartX;
    setDragOffset(diff);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset < -50) {
      handleNext();
    } else if (dragOffset > 50) {
      handlePrev();
    }
    setDragOffset(0);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    }
  };

  // Close modal on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedSector(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Category Icon SVG
  const renderCategoryIcon = (category: BusinessSector["category"]) => {
    switch (category) {
      case "HOTEL":
        return (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18M3 7v14M21 7v14M6 11h2M6 15h2M11 11h2M11 15h2M16 11h2M16 15h2M9 3h6v4H9z" />
          </svg>
        );
      case "RESORT":
        return (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83M12 7a5 5 0 100 10 5 5 0 000-10z" />
          </svg>
        );
      case "HOSPITAL":
        return (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            <path d="M12 7v6M9 10h6" />
          </svg>
        );
      case "SCHOOL":
        return (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
          </svg>
        );
    }
  };

  return (
    <section
      id="diversified"
      className={styles.section}
      aria-label="Our Diversified Businesses"
    >
      <div className="container">
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.badgePill}>
            <span className={styles.badgeDot} />
            Group Ecosystem
          </div>
          <h2 className={styles.title}>
            OUR <span className={styles.goldText}>DIVERSIFIED</span> BUSINESSES
          </h2>
          <p className={styles.subtitle}>
            From premier 4-star hospitality and tranquil boutique getaways to advanced critical healthcare and accredited academic institutions, Patliputra Group builds high-value assets and enduring community impact.
          </p>
        </div>

        {/* Toolbar: Category Filters & Carousel Controls */}
        <div className={styles.toolbar}>
          {/* Category Filter Pills */}
          <div className={styles.filters} role="tablist" aria-label="Filter businesses by category">
            <button
              type="button"
              className={`${styles.filterBtn} ${activeFilter === "all" ? styles.filterBtnActive : ""}`}
              onClick={() => setActiveFilter("all")}
              role="tab"
              aria-selected={activeFilter === "all"}
            >
              All Verticals
              <span className={styles.filterCount}>{SECTORS.length}</span>
            </button>
            <button
              type="button"
              className={`${styles.filterBtn} ${activeFilter === "hospitality" ? styles.filterBtnActive : ""}`}
              onClick={() => setActiveFilter("hospitality")}
              role="tab"
              aria-selected={activeFilter === "hospitality"}
            >
              Hotels & Resorts
              <span className={styles.filterCount}>
                {SECTORS.filter((s) => s.categoryFilter === "hospitality").length}
              </span>
            </button>
            <button
              type="button"
              className={`${styles.filterBtn} ${activeFilter === "healthcare" ? styles.filterBtnActive : ""}`}
              onClick={() => setActiveFilter("healthcare")}
              role="tab"
              aria-selected={activeFilter === "healthcare"}
            >
              Healthcare
              <span className={styles.filterCount}>
                {SECTORS.filter((s) => s.categoryFilter === "healthcare").length}
              </span>
            </button>
            <button
              type="button"
              className={`${styles.filterBtn} ${activeFilter === "education" ? styles.filterBtnActive : ""}`}
              onClick={() => setActiveFilter("education")}
              role="tab"
              aria-selected={activeFilter === "education"}
            >
              Education
              <span className={styles.filterCount}>
                {SECTORS.filter((s) => s.categoryFilter === "education").length}
              </span>
            </button>
          </div>

          {/* Navigation Controls */}
          <div className={styles.navControls}>
            <div className={styles.slideCounter} aria-live="polite">
              <span className={styles.currentSlideNum}>
                {String(currentIndex + 1).padStart(2, "0")}
              </span>{" "}
              / {String(Math.max(1, maxIndex + 1)).padStart(2, "0")}
            </div>

            <div className={styles.navArrowGroup}>
              <button
                type="button"
                className={styles.navBtn}
                onClick={handlePrev}
                aria-label="Previous slide"
                disabled={maxIndex === 0}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                className={styles.navBtn}
                onClick={handleNext}
                aria-label="Next slide"
                disabled={maxIndex === 0}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Viewport & Draggable Track */}
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
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          aria-roledescription="carousel"
          aria-label="Diversified business verticals"
        >
          <div
            className={`${styles.carouselTrack} ${isDragging ? styles.trackDragging : ""}`}
          >
            {filteredSectors.map((sec, index) => (
              <div
                key={sec.id}
                className={styles.slideItem}
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${filteredSectors.length}: ${sec.title}`}
              >
                <article className={styles.card}>
                  {/* Card Media */}
                  <div className={styles.imageContainer}>
                    <img
                      src={sec.image}
                      alt={`${sec.title} - ${sec.categoryLabel}`}
                      className={styles.image}
                      width={600}
                      height={380}
                      loading="lazy"
                      draggable={false}
                    />
                    <div className={styles.imageOverlay} />
                    <span className={styles.categoryBadge}>
                      {renderCategoryIcon(sec.category)}
                      {sec.category}
                    </span>
                    <span className={styles.groupTag}>Patliputra Group</span>
                  </div>

                  {/* Card Body */}
                  <div className={styles.cardContent}>
                    <div className={styles.metaRow}>
                      <span className={styles.locationBadge}>
                        <svg className={styles.locationIcon} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {sec.location}
                      </span>
                      <span className={styles.sectorSubtype}>{sec.categoryLabel}</span>
                    </div>

                    <h3 className={styles.cardTitle}>{sec.title}</h3>
                    <p className={styles.cardTagline}>{sec.tagline}</p>
                    <p className={styles.description}>{sec.description}</p>

                    {/* Features List */}
                    <div className={styles.featuresList}>
                      {sec.features.map((feat) => (
                        <span key={feat} className={styles.featurePill}>
                          <span className={styles.featureDot} />
                          {feat}
                        </span>
                      ))}
                    </div>

                    {/* Card Footer */}
                    <div className={styles.cardFooter}>
                      <div className={styles.cardStat}>
                        <span className={styles.statValue}>{sec.stats[0]?.value}</span>
                        <span className={styles.statLabel}>{sec.stats[0]?.label}</span>
                      </div>

                      <button
                        type="button"
                        className={styles.exploreBtn}
                        onClick={() => setSelectedSector(sec)}
                        aria-label={`View full details about ${sec.title}`}
                      >
                        Explore Venture
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Pagination Dots */}
        {maxIndex > 0 && (
          <div className={styles.paginationArea} aria-hidden="true">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`${styles.dot} ${currentIndex === idx ? styles.dotActive : ""}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Interactive Detail Modal / Drawer */}
      {selectedSector && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedSector(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-sector-title"
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={() => setSelectedSector(null)}
              aria-label="Close modal"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Modal Image */}
            <div className={styles.modalImageContainer}>
              <img
                src={selectedSector.image}
                alt={selectedSector.title}
                className={styles.modalImage}
              />
              <div className={styles.imageOverlay} />
              <span className={styles.categoryBadge}>
                {renderCategoryIcon(selectedSector.category)}
                {selectedSector.category}
              </span>
            </div>

            {/* Modal Body */}
            <div className={styles.modalBody}>
              <div className={styles.modalHeaderRow}>
                <div>
                  <span className={styles.sectorSubtype}>{selectedSector.categoryLabel}</span>
                  <h3 id="modal-sector-title" className={styles.modalTitle}>
                    {selectedSector.title}
                  </h3>
                </div>
                <span className={styles.locationBadge}>
                  <svg className={styles.locationIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {selectedSector.location}
                </span>
              </div>

              <p className={styles.modalTagline}>{selectedSector.tagline}</p>
              <p className={styles.modalDescription}>{selectedSector.description}</p>

              {/* Stats Highlights */}
              <div className={styles.modalStatsGrid}>
                {selectedSector.stats.map((st) => (
                  <div key={st.label} className={styles.modalStatCard}>
                    <div className={styles.modalStatCardVal}>{st.value}</div>
                    <div className={styles.modalStatCardLbl}>{st.label}</div>
                  </div>
                ))}
              </div>

              {/* Highlights List */}
              <h4 className={styles.modalSectionTitle}>Key Highlights & Facilities</h4>
              <div className={styles.modalHighlightsList}>
                {selectedSector.highlights.map((item, idx) => (
                  <div key={idx} className={styles.modalHighlightItem}>
                    <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Features Chips */}
              <h4 className={styles.modalSectionTitle}>Core Amenities</h4>
              <div className={styles.featuresList}>
                {selectedSector.features.map((feat) => (
                  <span key={feat} className={styles.featurePill}>
                    <span className={styles.featureDot} />
                    {feat}
                  </span>
                ))}
              </div>

              {/* Modal Footer / Direct Inquiry */}
              <div className={styles.modalFooter}>
                <div className={styles.modalAddress}>
                  <svg className={styles.locationIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{selectedSector.address}</span>
                </div>

                <Link href="/contact" className={styles.modalContactBtn} onClick={() => setSelectedSector(null)}>
                  Inquire With Group
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
