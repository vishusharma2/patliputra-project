"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Footer.module.css";

interface RecentPost {
  title: string;
  date: string;
  image: string;
}

const recentPosts: RecentPost[] = [
  {
    title: "Top 5 High-ROI Investment Corridors in Patna for 2024",
    date: "14 MARCH 2024",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=120&q=80",
  },
  {
    title: "Patliputra Twin Towers Reaches 25th Floor Milestone",
    date: "28 FEBRUARY 2024",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&q=80",
  },
  {
    title: "Understanding Bihar RERA Regulations Before Buying",
    date: "10 JANUARY 2024",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=120&q=80",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  const handleLinkClick = (href: string) => {
    if (pathname === href) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className="container">
        <div className={styles.grid}>
          {/* Brand Info */}
          <div className={styles.brandCol}>
            <Link
              href="/"
              className={styles.logo}
              onClick={() => handleLinkClick("/")}
            >
              <span className={styles.logoIcon}>◈</span>
              <div className={styles.logoText}>
                <span className={styles.logoName}>PATLIPUTRA</span>
                <span className={styles.logoSub}>GROUP</span>
              </div>
            </Link>

            <p className={styles.brandDesc}>
              Shaping Patna&apos;s urban skyline for over 25 years. Patliputra Group represents uncompromising structural excellence,
              timeless aesthetics, and the highest standards of transparency in Bihar&apos;s real estate ecosystem.
            </p>

            <div className={styles.socialLinks}>
              <a href="#" aria-label="Facebook" className={styles.socialIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className={styles.socialIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className={styles.socialIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="#" aria-label="YouTube" className={styles.socialIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                </svg>
              </a>
            </div>
          </div>

          {/* Recent News */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>RECENT NEWS</h4>
            <div className={styles.postsList}>
              {recentPosts.map((post) => (
                <article key={post.title} className={styles.postItem}>
                  <img
                    src={post.image}
                    alt={post.title}
                    className={styles.postThumb}
                    width={56}
                    height={56}
                    loading="lazy"
                  />
                  <div className={styles.postContent}>
                    <span className={styles.postDate}>{post.date}</span>
                    <Link
                      href="/media"
                      className={styles.postTitle}
                      onClick={() => handleLinkClick("/media")}
                    >
                      {post.title}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>QUICK LINKS</h4>
            <ul className={styles.linksList}>
              <li>
                <Link href="/" onClick={() => handleLinkClick("/")}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" onClick={() => handleLinkClick("/about")}>
                  About Patliputra Group
                </Link>
              </li>
              <li>
                <Link href="/masterpiece" onClick={() => handleLinkClick("/masterpiece")}>
                  Our Masterpiece
                </Link>
              </li>
              <li>
                <Link href="/properties" onClick={() => handleLinkClick("/properties")}>
                  Ongoing Projects
                </Link>
              </li>
              <li>
                <Link href="/diversified" onClick={() => handleLinkClick("/diversified")}>
                  Diversified Verticals
                </Link>
              </li>
              <li>
                <Link href="/landmarks" onClick={() => handleLinkClick("/landmarks")}>
                  Upcoming Landmarks
                </Link>
              </li>
              <li>
                <Link href="/why-us" onClick={() => handleLinkClick("/why-us")}>
                  Why Invest With Us
                </Link>
              </li>
              <li>
                <Link href="/contact" onClick={() => handleLinkClick("/contact")}>
                  Schedule Site Visit
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>CONTACT INFO</h4>
            <div className={styles.contactList}>
              <div className={styles.contactBlock}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div>
                  <strong>Corporate Headquarters</strong>
                  <p>Patliputra Colony, Main Road, Patna - 800013, Bihar</p>
                </div>
              </div>

              <div className={styles.contactBlock}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <div>
                  <strong>Direct Inquiries</strong>
                  <p>
                    <a href="tel:+919876543210">+91 98765 43210</a> /{" "}
                    <a href="tel:+916122234567">+91 612 2234567</a>
                  </p>
                </div>
              </div>

              <div className={styles.contactBlock}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <div>
                  <strong>Email Support</strong>
                  <p>
                    <a href="mailto:info@patliputragroup.com">
                      info@patliputragroup.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            &copy; {currentYear} Patliputra Group. All Rights Reserved. RERA Bihar Reg: BRERAP00234-1/2023.
          </p>
          <div className={styles.bottomLinks}>
            <Link href="/about">Privacy Policy</Link>
            <span>&bull;</span>
            <Link href="/about">Terms &amp; Conditions</Link>
            <span>&bull;</span>
            <a href="/sitemap.xml">XML Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
