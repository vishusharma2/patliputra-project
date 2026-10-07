import Link from "next/link";
import styles from "./About.module.css";

export default function About() {
  return (
    <article
      className={styles.aboutSection}
      aria-label="About Patliputra Group"
    >
      <section className={styles.introBlock}>
        <div className="container">
          <div className={styles.introGrid}>
            {/* Left Column: Text Content */}
            <div className={styles.introContent}>
              <div className={styles.sectionEyebrow}>
                <span className={styles.eyebrowLine} aria-hidden="true" />
                <span>Since 1989 &bull; Three Decades of Distinction</span>
              </div>

              <h2 className={styles.mainHeading}>At Patliputra Group</h2>
              <div className={styles.headingUnderline} aria-hidden="true" />

              <p className={styles.introParagraph}>
                Excellence is not just a principle—it is our foundation. Over
                the past three decades, Patliputra Group has grown into one of
                India&apos;s most trusted and fastest-growing real estate
                companies, shaping skylines and lifestyles across Bihar,
                Jharkhand, Haryana, and Uttar Pradesh.
              </p>

              <p className={styles.introParagraph}>
                With a legacy built on <strong>innovation</strong>,{" "}
                <strong>integrity</strong>, and{" "}
                <strong>customer-first values</strong>, we deliver world-class
                residential, commercial, and mixed-use developments that set new
                benchmarks in design, quality, and sustainability. Whether
                it&apos;s creating vibrant communities, iconic commercial hubs,
                or future-ready workspaces, Patliputra Group stands at the
                forefront of transforming real estate into a catalyst for growth
                and prosperity.
              </p>
            </div>

            {/* Right Column: Architectural Flagship Media */}
            <div className={styles.introMediaWrap}>
              <div className={styles.mediaFrame}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/img/signature_park.jpg"
                  alt="Patliputra Signature Park - Iconic mixed-use landmark development in Patna"
                  className={styles.introImage}
                  loading="lazy"
                />
                <div className={styles.mediaBadge}>
                  <div>
                    <h3 className={styles.badgeTitle}>
                      Patliputra Signature Park
                    </h3>
                    <span className={styles.badgeTag}>
                      Flagship Mixed-Use Landmark
                    </span>
                  </div>
                  <span style={{ color: "#deb360", fontSize: "1.1rem" }}>
                    <img
                      src="img/logo_final.png"
                      alt="logo"
                      height={"50px"}
                      width={"50px"}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Real Estate Milestones Strip */}
          <div className={styles.statsStrip}>
            <div className={styles.statItem}>
              <div className={styles.statNum}>35+</div>
              <div className={styles.statLabel}>Years Proven Legacy</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNum}>4 States</div>
              <div className={styles.statLabel}>
                Bihar, Jharkhand, Haryana &amp; UP
              </div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNum}>10,000+</div>
              <div className={styles.statLabel}>
                Families &amp; Businesses Housed
              </div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNum}>100%</div>
              <div className={styles.statLabel}>
                RERA Compliant Transparency
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Waveform Frequency Divider */}
      <div className={styles.waveformDivider} aria-hidden="true">
        <div className={styles.waveformBars}>
          {[
            8, 14, 20, 28, 36, 26, 18, 12, 22, 32, 20, 14, 24, 34, 28, 18, 10,
            26, 36, 30, 20, 12, 22, 34, 24, 16, 28, 36, 22, 14, 26, 32, 18, 10,
            24, 34, 28, 16, 22, 30, 20, 12, 28, 36, 24, 16, 22, 30, 18, 8,
          ].map((h, idx) => (
            <span
              key={idx}
              className={styles.bar}
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
      </div>

      <section className={styles.cmdSection}>
        <div className="container">
          <div className={styles.cmdCard}>
            <div className={styles.cmdGrid}>
              {/* Left Column: CMD Letter & Speech */}
              <div className={styles.cmdLeft}>
                <div className={styles.cmdEyebrow}>
                  <span>◈ Leadership Address</span>
                </div>
                <h2 className={styles.cmdHeading}>CMD MESSAGE</h2>

                {/* Highlighted Opening Quote */}
                <div className={styles.cmdQuoteBlock}>
                  <p className={styles.cmdQuoteText}>
                    &ldquo;At Patliputra Group, we believe real estate is not
                    just about land and structures &ndash; it is about creating
                    a legacy for generations to cherish.&rdquo;
                  </p>
                </div>

                <p className={styles.cmdParagraph}>
                  Since the very beginning, our vision has been clear: to{" "}
                  <strong style={{ color: "#111322" }}>
                    make quality real estate accessible and reliable
                  </strong>
                  . Over the years, we have faced challenges, embraced
                  opportunities, and continued to grow with a deep sense of{" "}
                  <strong style={{ color: "#111322" }}>
                    responsibility towards our customers, partners, and society
                  </strong>
                  .
                </p>

                <p className={styles.cmdParagraph}>
                  The strength of Patliputra Group lies in our{" "}
                  <strong style={{ color: "#111322" }}>
                    people and values
                  </strong>
                  . With a talented team of professionals from leading
                  institutions like IIT and IIM, we are constantly innovating to
                  deliver world-class projects. We are guided by the belief that
                  when the going gets tough, the tough get going &ndash; and it
                  is this mindset that has helped us earn the trust of thousands
                  of families and businesses.
                </p>

                <p className={styles.cmdParagraph}>
                  As Eastern India&apos;s leading real estate developer, we are
                  committed to shaping the future with sustainable development,
                  cutting-edge technology, and customer delight. With every
                  project, we reaffirm our mission of building not just spaces,
                  but{" "}
                  <strong style={{ color: "#111322" }}>
                    landmarks that define aspirations and stand the test of time
                  </strong>
                  .
                </p>

                {/* Sign-off */}
                <div className={styles.cmdSignoffWrap}>
                  <div>
                    <div className={styles.cmdSignText}>
                      &ndash; Anil Kumar, CMD
                    </div>
                    <div className={styles.cmdOfficialTitle}>
                      Chairman &amp; Managing Director &bull; Patliputra Group
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Authentic CMD Portrait */}
              <div className={styles.cmdPhotoWrap}>
                <div className={styles.cmdPhotoContainer}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/img/anilkumar.jpg"
                    alt="Anil Kumar, CMD of Patliputra Group"
                    className={styles.cmdPhoto}
                    loading="lazy"
                  />
                  <div className={styles.cmdPhotoCaption}>
                    <h3 className={styles.cmdCaptionName}>Anil Kumar</h3>
                    <p className={styles.cmdCaptionRole}>
                      Chairman &amp; Managing Director
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Waveform Frequency Divider */}
      <div className={styles.waveformDivider} aria-hidden="true">
        <div className={styles.waveformBars}>
          {[
            10, 16, 24, 32, 22, 14, 26, 36, 28, 18, 12, 22, 34, 24, 16, 28, 36,
            20, 12, 24, 34, 28, 18, 10, 22, 32, 20, 14, 26, 36, 26, 18, 12, 24,
            34, 22, 14, 26, 36, 28, 18, 12, 20, 32, 22, 14, 24, 34, 20, 10,
          ].map((h, idx) => (
            <span
              key={idx}
              className={styles.bar}
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
      </div>

      <section className={styles.pillarsSection}>
        <div className="container">
          <div className={styles.pillarsGrid}>
            {/* PILLAR 1: OUR VISION */}
            <div className={styles.pillarCard}>
              <div className={styles.pillarHeader}>
                <div className={styles.pillarIconWrap}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="4" />
                    <line x1="21.17" y1="8" x2="12" y2="8" />
                    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
                    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
                  </svg>
                </div>
                <h3 className={styles.pillarTitle}>Our Vision</h3>
              </div>
              <p className={styles.visionText}>
                To emerge as a nationally recognized, globally respected real
                estate leader that transforms the way India lives, works, and
                grows. We aspire to create sustainable communities and iconic
                developments that reflect excellence, innovation, and integrity
                &ndash; making Patliputra Group a name synonymous with trust,
                quality, and progress.
              </p>
            </div>

            {/* PILLAR 2: OUR MISSION */}
            <div className={styles.pillarCard}>
              <div className={styles.pillarHeader}>
                <div className={styles.pillarIconWrap}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <h3 className={styles.pillarTitle}>Our Mission</h3>
              </div>

              <ul className={styles.missionList}>
                <li className={styles.missionItem}>
                  <span className={styles.bulletMark}>&bull;</span>
                  <span>
                    To deliver value-driven real estate solutions that blend
                    affordability with world-class quality.
                  </span>
                </li>
                <li className={styles.missionItem}>
                  <span className={styles.bulletMark}>&bull;</span>
                  <span>
                    To incorporate innovation, modern technology, and
                    sustainability into every development.
                  </span>
                </li>
                <li className={styles.missionItem}>
                  <span className={styles.bulletMark}>&bull;</span>
                  <span>
                    To create lasting relationships with customers through
                    transparency, ethics, and reliability.
                  </span>
                </li>
                <li className={styles.missionItem}>
                  <span className={styles.bulletMark}>&bull;</span>
                  <span>
                    To contribute towards urban transformation with thoughtfully
                    designed residential, commercial, and retail spaces.
                  </span>
                </li>
                <li className={styles.missionItem}>
                  <span className={styles.bulletMark}>&bull;</span>
                  <span>
                    To build communities that foster growth, connectivity, and
                    long-term prosperity.
                  </span>
                </li>
                <li className={styles.missionItem}>
                  <span className={styles.bulletMark}>&bull;</span>
                  <span>
                    To nurture a work culture driven by excellence, respect,
                    integrity, and continuous improvement.
                  </span>
                </li>
              </ul>
            </div>

            {/* PILLAR 3: OUR CORE VALUES */}
            <div className={styles.pillarCard}>
              <div className={styles.pillarHeader}>
                <div className={styles.pillarIconWrap}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 className={styles.pillarTitle}>Our Core Values</h3>
              </div>

              <div className={styles.valuesGrid}>
                <div className={styles.valueItemCard}>
                  <h4 className={styles.valueHeading}>
                    <span style={{ color: "#c8a45c" }}>◈</span> Integrity
                  </h4>
                  <p className={styles.valueDesc}>
                    Building on a foundation of honesty and transparency.
                  </p>
                </div>

                <div className={styles.valueItemCard}>
                  <h4 className={styles.valueHeading}>
                    <span style={{ color: "#c8a45c" }}>◈</span> Innovation
                  </h4>
                  <p className={styles.valueDesc}>
                    Constantly adopting new ideas, technology, and design.
                  </p>
                </div>

                <div className={styles.valueItemCard}>
                  <h4 className={styles.valueHeading}>
                    <span style={{ color: "#c8a45c" }}>◈</span> Excellence
                  </h4>
                  <p className={styles.valueDesc}>
                    Striving for the highest standards in everything we do.
                  </p>
                </div>

                <div className={styles.valueItemCard}>
                  <h4 className={styles.valueHeading}>
                    <span style={{ color: "#c8a45c" }}>◈</span> Sustainability
                  </h4>
                  <p className={styles.valueDesc}>
                    Developing eco-friendly projects with future generations in
                    mind.
                  </p>
                </div>

                <div className={styles.valueItemCard}>
                  <h4 className={styles.valueHeading}>
                    <span style={{ color: "#c8a45c" }}>◈</span>{" "}
                    Customer-Centricity
                  </h4>
                  <p className={styles.valueDesc}>
                    Placing customers at the heart of every decision.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Luxury Executive Call to Action Strip */}
          <div className={styles.bottomCtaBanner}>
            <div>
              <h4 className={styles.ctaHeading}>
                Experience the Patliputra Legacy
              </h4>
              <p className={styles.ctaSub}>
                Connect with our advisory desk or explore our portfolio of
                landmark ongoing and delivered projects.
              </p>
            </div>
            <div className={styles.ctaButtonGroup}>
              <Link href="/properties" className={styles.ctaPrimaryBtn}>
                <span>Explore Properties</span>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/contact" className={styles.ctaSecondaryBtn}>
                <span>Schedule Site Visit</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
