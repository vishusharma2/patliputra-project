import Link from "next/link";
import styles from "./PageBanner.module.css";

interface PageBannerProps {
  title: string;
  subtitle?: string;
  breadcrumb: string;
  highlightWord?: string;
}

export default function PageBanner({
  title,
  breadcrumb,
  highlightWord,
}: PageBannerProps) {
  return (
    <section className={styles.banner} aria-label={`${title} Header`}>
      <div className={styles.bannerPattern} />
      <div className={styles.bannerGlow} />

      <div className={styles.container}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbCurrent}>{breadcrumb}</span>
        </nav>

        <h1 className={styles.title}>
          {highlightWord && title.toLowerCase().includes(highlightWord.toLowerCase()) ? (
            title.split(new RegExp(`(${highlightWord})`, "i")).map((part, i) =>
              part.toLowerCase() === highlightWord.toLowerCase() ? (
                <span key={i} className={styles.titleHighlight}>
                  {part}
                </span>
              ) : (
                part
              )
            )
          ) : (
            title
          )}
        </h1>
      </div>
    </section>
  );
}
