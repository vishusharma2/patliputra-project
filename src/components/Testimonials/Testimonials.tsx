"use client";

import { useState, useEffect } from "react";
import styles from "./Testimonials.module.css";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  text: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Rajesh Kumar",
    role: "Business Owner",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "Patliputra Residences exceeded all our expectations. The attention to detail in every corner of our 3 BHK is remarkable. From the imported marble flooring to the smart home features, everything speaks luxury. Our family has never been happier!",
    rating: 5,
  },
  {
    id: "t2",
    name: "Priya Sharma",
    role: "IT Professional",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "Moving to Patliputra Residences was the best decision we made. The location is perfect — close to work, schools, and hospitals. The community feeling here is wonderful, and the clubhouse has become our family's favorite weekend spot.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Dr. Amit Sinha",
    role: "Surgeon, AIIMS",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    text: "As someone who values peace and tranquility after long hospital shifts, this residence offers the perfect sanctuary. The green spaces, the yoga deck, and the overall serenity make it an oasis in the city. Truly world-class living.",
    rating: 5,
  },
  {
    id: "t4",
    name: "Sneha Gupta",
    role: "Architect",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "Being an architect myself, I appreciate the design philosophy behind Patliputra Residences. The floor plans are brilliant, natural light flows beautifully, and the material choices are top-notch. It's rare to find such quality in Patna.",
    rating: 5,
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className={styles.testimonials} aria-label="Testimonials">
      <div className={styles.bgPattern} />
      <div className="container">
        <div className={styles.header}>
          <span className="section-label">Testimonials</span>
          <h2 className="section-title section-title--light">
            What Our <em>Residents</em> Say
          </h2>
          <p className="section-subtitle section-subtitle--light">
            Hear from the families who call Patliputra Residences home.
          </p>
        </div>

        <div className={styles.carousel}>
          <div className={styles.cards}>
            {testimonials.map((t, index) => (
              <article
                key={t.id}
                className={`${styles.card} ${
                  index === activeIndex ? styles.cardActive : ""
                }`}
                aria-hidden={index !== activeIndex}
              >
                <div className={styles.quote}>&ldquo;</div>
                <p className={styles.cardText}>{t.text}</p>
                <div className={styles.stars}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="var(--color-primary)" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <div className={styles.author}>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    width={56}
                    height={56}
                    className={styles.avatar}
                    loading="lazy"
                  />
                  <div>
                    <strong className={styles.authorName}>{t.name}</strong>
                    <span className={styles.authorRole}>{t.role}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.dots}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${
                  index === activeIndex ? styles.dotActive : ""
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
