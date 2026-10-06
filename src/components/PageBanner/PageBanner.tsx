import Link from "next/link";
import styles from "./PageBanner.module.css";

interface PageBannerProps {
  title: string;
  subtitle: string;
  breadcrumb: string;
  highlightWord?: string;
}

export default function PageBanner({
  title,
  subtitle,
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
          {highlightWord ? (
            <>
              {title.replace(highlightWord, "")}
              <span className={styles.titleHighlight}>{highlightWord}</span>
            </>
          ) : (
            title
          )}
        </h1>

        <p className={styles.subtitle}>{subtitle}</p>
      </div>
    </section>
  );
}
