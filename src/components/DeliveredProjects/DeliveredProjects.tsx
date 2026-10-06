import styles from "./DeliveredProjects.module.css";

interface DeliveredProject {
  name: string;
  location: string;
  image: string;
  description: string;
}

/** Add more delivered projects here; images live in /public/img/delivered/ */
const PROJECTS: DeliveredProject[] = [
  {
    name: "Satyam Apartment",
    location: "Boring Road, Patna",
    image: "/img/delivered/satyam.webp",
    description:
      "Located on Boring Road, Patna, this ready-to-move project offers premium apartments with Italian marble finishes, power backup, kids' play, yoga zone, green spaces, and 24×7 security.",
  },
  {
    name: "Viswamohini Apartment",
    location: "Patna",
    image: "/img/delivered/viswamohini.webp",
    description:
      "This premium residential project offers spacious 2 & 3 BHK apartments with modern layouts, quality finishes, and lifestyle amenities, ensuring comfort and convenience in a prime Patna location.",
  },
  {
    name: "Lalita Apartment",
    location: "Patna",
    image: "/img/delivered/lalita.webp",
    description:
      "This premium residential project offers spacious 2 & 3 BHK apartments with modern layouts, quality finishes, and lifestyle amenities, ensuring comfort and convenience in a prime Patna location.",
  },
  {
    name: "Maharaja Kameshwar Complex",
    location: "Fraser Road, Patna",
    image: "/img/delivered/maharaja.webp",
    description:
      "Located in the bustling Fraser Road area of Patna, this landmark development features a single tower rising across 6 floors, thoughtfully designed to accommodate 228 modern units.",
  },
];

export default function DeliveredProjects() {
  return (
    <section
      id="delivered-projects"
      className={styles.section}
      aria-labelledby="delivered-title"
    >
      <div className="container">
        <header className={styles.header}>
          <span className="section-label">Since 1989</span>
          <h2 id="delivered-title" className={styles.title}>
            Our Legacy of <span className={styles.gold}>Delivered</span>{" "}
            Projects
          </h2>
          <div className={styles.ornament} aria-hidden="true">
            <span />
            <i />
            <span />
          </div>
        </header>

        <div className={styles.grid}>
          {PROJECTS.map((p, i) => (
            <article
              key={p.name}
              className={styles.card}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={styles.media}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={`${p.name}, ${p.location}`}
                  className={styles.image}
                  loading="lazy"
                />
                <span className={styles.badge}>
                  <span>Delivered</span>
                </span>
                <span className={styles.index} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div className={styles.body}>
                <h3 className={styles.name}>{p.name}</h3>
                <p className={styles.location}>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    aria-hidden="true"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {p.location}
                </p>
                <p className={styles.description}>{p.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
