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

const mediaItems: MediaItem[] = [
  {
    id: "news-signature-park-1",
    category: "clipping",
    source: "NATIONAL PRESS & DAINIK JAGRAN",
    date: "LAUNCH EVENT",
    headline:
      "पाटलिपुत्र सिग्नेचर पार्क का भव्य शुभारंभ, दिल्ली के सांसद मनोज तिवारी ने भी बुक कराया अपना फ्लैट",
    englishTitle:
      "Grand Launch of Patliputra Signature Park in Chi V, Greater Noida",
    excerpt:
      "दिल्ली के माननीय सांसद श्री मनोज तिवारी ने ग्रेटर नोएडा के प्रतिष्ठित क्षेत्र Chi V में पाटलिपुत्र सिग्नेचर पार्क का भव्य उद्घाटन किया। उन्होंने खुलासा किया कि पटना में भी उनका घर इसी बिल्डर ने बनाया है और इस नए प्रोजेक्ट में भी अपना स्टूडियो अपार्टमेंट बुक कराया। प्रबंध निदेशक श्री अनिल कुमार ने 2026 तक पजेशन का संकल्प व्यक्त किया।",
    image: "/img/news/delivered_news1.webp",
    tag: "NEWSPAPER CLIPPING",
    isClipping: true,
    highlights: [
      "उद्घाटन: सांसद मनोज तिवारी",
      "लोकेशन: Chi V, ग्रेटर नोएडा",
      "12% अश्योर्ड रिटर्न ऑफर",
      "पजेशन संकल्प: 2026",
    ],
  },
  {
    id: "news-signature-park-2",
    category: "clipping",
    source: "REGIONAL HINDI MEDIA",
    date: "EXPANSION EDITION",
    headline:
      "50 लाख स्क्वायर फीट डिलीवरी का विश्वास: ग्रेटर नोएडा में पाटलिपुत्र सिग्नेचर पार्क",
    englishTitle:
      "Proven Track Record: 50 Lakh+ Sq. Ft. Successfully Delivered Nationwide",
    excerpt:
      "प्रबंध निदेशक श्री अनिल कुमार ने सभी आगंतुकों का आभार व्यक्त करते हुए कहा कि पाटलिपुत्र ग्रुप ने विभिन्न शहरों में 50 लाख वर्ग फीट से अधिक कमर्शियल और रेजिडेंशियल प्रोजेक्ट्स डिलीवर किए हैं। सभी खरीदारों को 5 लाख रुपये तक का इनॉग्रल डिस्काउंट और 12% तक का अश्योर्ड रिटर्न पजेशन तक दिया जाएगा।",
    image: "/img/news/delivered_news2.webp",
    tag: "NEWSPAPER CLIPPING",
    isClipping: true,
    highlights: [
      "50L+ Sq. Ft. Delivered",
      "₹5 लाख इनॉग्रल डिस्काउंट",
      "अपकमिंग फिल्म सिटी के निकट",
      "अत्याधुनिक सुविधाएं",
    ],
  },
  {
    id: "news-signature-park-3",
    category: "clipping",
    source: "AMAR UJALA & CITY DESK",
    date: "NCR LAUNCH",
    headline:
      "फिल्म सिटी के नजदीक विश्वस्तरीय सुविधाओं से युक्त नया मील का पत्थर",
    englishTitle:
      "Strategic Chi V Location Near Upcoming Film City with World-Class Living",
    excerpt:
      "अत्याधुनिक सुविधाओं, प्राइम लोकेशन और बेहतरीन कनेक्टिविटी के कारण निवेशकों और होम बायर्स के लिए यह एक आकर्षक अवसर प्रस्तुत करता है। ग्रेटर नोएडा के रियल एस्टेट सेक्टर में यह प्रोजेक्ट एक नया मील का पत्थर साबित होगा, जहां गुणवत्ता और विश्वसनीयता का नया परिचय मिला है।",
    image: "/img/news/delivered_news4.webp",
    tag: "NEWSPAPER CLIPPING",
    isClipping: true,
    highlights: [
      "फिल्म सिटी के नजदीक",
      "निवेशकों में भारी उत्साह",
      "Chi V प्राइम लोकेशन",
      "विश्वस्तरीय सुविधाएं",
    ],
  },
];

export default function MediaEvents() {
  const [activeModalItem, setActiveModalItem] = useState<MediaItem | null>(
    null,
  );

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
          {mediaItems.map((item) => (
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
