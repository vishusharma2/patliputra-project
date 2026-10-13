"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Footer.module.css";
import FacebookIcon from "@/components/icons/FacebookIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";
import LinkedInIcon from "@/components/icons/LinkedInIcon";
import YouTubeIcon from "@/components/icons/YouTubeIcon";
import MapPinIcon from "@/components/icons/MapPinIcon";
import PhoneIcon from "@/components/icons/PhoneIcon";
import MailIcon from "@/components/icons/MailIcon";

interface NewsItem {
  id: string;
  source?: string;
  date?: string;
  headline: string;
  englishTitle?: string;
  image: string;
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  // Extract 2 latest news items from media
  const [latestPosts, setLatestPosts] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch("/api/admin/news")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLatestPosts(data.slice(0, 2));
        }
      })
      .catch((err) =>
        console.error("Error fetching latest news for footer:", err),
      );
  }, []);

  const handleLinkClick = (href: string) => {
    if (pathname === href) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (pathname === "/patliputra-login") {
    return null;
  }

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
              <span className={styles.logoIcon}>
                <img
                  src="https://mbfrobyozijbwglauqop.supabase.co/storage/v1/object/public/project%20images/logo%20and%20other/logo_final.png"
                  alt="logo"
                  height={"60px"}
                  width={"60px"}
                />
              </span>
              <div className={styles.logoText}>
                <span className={styles.logoName}>PATLIPUTRA</span>
                <span className={styles.logoSub}>GROUP</span>
              </div>
            </Link>

            <p className={styles.brandDesc}>
              Shaping Patna&apos;s urban skyline for over 35 years. Patliputra
              Group represents uncompromising structural excellence, timeless
              aesthetics, and the highest standards of transparency in
              Bihar&apos;s real estate ecosystem.
            </p>

            <div className={styles.socialLinks}>
              <a
                href="https://www.facebook.com/p/Patliputra-Builders-Limited-100063808999653/"
                target="_blank"
                aria-label="Facebook"
                className={styles.socialIcon}
              >
                <FacebookIcon size={18} />
              </a>
              <a href="#" aria-label="Instagram" className={styles.socialIcon}>
                <InstagramIcon size={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/patliputra-builders-limited/about/"
                aria-label="LinkedIn"
                target="_blank"
                className={styles.socialIcon}
              >
                <LinkedInIcon size={18} />
              </a>
              <a href="#" aria-label="YouTube" className={styles.socialIcon}>
                <YouTubeIcon size={18} />
              </a>
            </div>
          </div>

          {/* Recent News - 2 Latest */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>RECENT NEWS</h4>
            {latestPosts && latestPosts.length > 0 ? (
              <div className={styles.postsList}>
                {latestPosts.map((post) => (
                  <article key={post.id} className={styles.postItem}>
                    <Link
                      href="/media"
                      className={styles.postThumbLink}
                      onClick={() => handleLinkClick("/media")}
                    >
                      <img
                        src={post.image}
                        alt={post.englishTitle || post.headline}
                        className={styles.postThumb}
                        width={56}
                        height={56}
                        loading="lazy"
                      />
                    </Link>
                    <div className={styles.postContent}>
                      <span className={styles.postDate}>
                        {post.date || "RECENT COVERAGE"}
                      </span>
                      <Link
                        href="/media"
                        className={styles.postTitle}
                        onClick={() => handleLinkClick("/media")}
                      >
                        {post.englishTitle || post.headline}
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p
                style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}
              >
                No recent news published yet.
              </p>
            )}
          </div>

          {/* Contact Info */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>CONTACT INFO</h4>
            <div className={styles.contactList}>
              <div className={styles.contactBlock}>
                <MapPinIcon size={18} />
                <div>
                  <strong>Corporate Headquarters</strong>
                  <p>Patliputra Colony, Main Road, Patna - 800013, Bihar</p>
                </div>
              </div>

              <div className={styles.contactBlock}>
                <PhoneIcon size={18} />
                <div>
                  <strong>Direct Inquiries</strong>
                  <p>
                    <a href="tel:+919876543210">+91 98765 43210</a> /{" "}
                    <a href="tel:+916122234567">+91 612 2234567</a>
                  </p>
                </div>
              </div>

              <div className={styles.contactBlock}>
                <MailIcon size={18} />
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
            &copy; {currentYear} Patliputra Group. All Rights Reserved.
          </p>
          <div className={styles.bottomLinks}>
            <Link href="https://github.com/vishusharma2/" target="Blank">
              Made By VS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
