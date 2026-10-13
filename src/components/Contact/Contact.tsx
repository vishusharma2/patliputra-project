"use client";

import { useState, FormEvent } from "react";
import styles from "./Contact.module.css";
import MapPinIcon from "@/components/icons/MapPinIcon";
import PhoneIcon from "@/components/icons/PhoneIcon";
import MailIcon from "@/components/icons/MailIcon";
import FacebookIcon from "@/components/icons/FacebookIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";
import TwitterIcon from "@/components/icons/TwitterIcon";
import YouTubeIcon from "@/components/icons/YouTubeIcon";
import LinkedInIcon from "@/components/icons/LinkedInIcon";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import CheckIcon from "@/components/icons/CheckIcon";
import SendIcon from "@/components/icons/SendIcon";
import NavigationIcon from "@/components/icons/NavigationIcon";
import ExternalLinkIcon from "@/components/icons/ExternalLinkIcon";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyType: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap");
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(
      "301, Maharaja Kameshwar Complex, Fraser Road Area, Patna, Bihar 800001"
    );
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const dataToSend = { ...formData };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      const data = await res.json();
      const waUrl =
        data?.whatsappUrl ||
        `https://api.whatsapp.com/send?phone=917303665845&text=${encodeURIComponent(
          `Hi Patliputra Group, I submitted an inquiry from the website.\nName: ${dataToSend.name}\nPhone: ${dataToSend.phone}\nRequirement: ${dataToSend.propertyType || "General"}`,
        )}`;

      // Clear all form fields only after submission finishes
      setFormData({
        name: "",
        email: "",
        phone: "",
        propertyType: "",
        message: "",
      });

      setWhatsappUrl(waUrl);
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting contact inquiry:", err);
      // Clear form after submission even if error
      setFormData({
        name: "",
        email: "",
        phone: "",
        propertyType: "",
        message: "",
      });
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitted(false), 12000);
    }
  };

  return (
    <section id="contact" className={styles.contact} aria-label="Contact us">
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.infoCol}>
            <span className="section-label">Get In Touch</span>
            <h2 className="section-title">
              Schedule Your <em>Personal</em> Visit
            </h2>
            <p className={styles.description}>
              Experience Patliputra Residences firsthand. Our team of property
              experts will guide you through our premium apartments and help you
              find your perfect home.
            </p>

            <div className={styles.contactItems}>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <MapPinIcon size={22} />
                </div>
                <div>
                  <strong>Headquarters & Registered Office</strong>
                  <p>
                    301, Maharaja Kameshwar Complex,
                    <br />
                    Fraser Road Area, Patna, Bihar 800001
                  </p>
                </div>
              </div>

              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <PhoneIcon size={22} />
                </div>
                <div>
                  <strong>Call Us</strong>
                  <p>
                    <a href="tel:+919876543210">+91 98765 43210</a>
                  </p>
                  <p>
                    <a href="tel:+919876543211">+91 98765 43211</a>
                  </p>
                </div>
              </div>

              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <MailIcon size={22} />
                </div>
                <div>
                  <strong>Email Us</strong>
                  <p>
                    <a href="mailto:info@patliputraresidences.com">
                      info@patliputraresidences.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.social}>
              <a
                href="https://www.facebook.com/p/Patliputra-Builders-Limited-100063808999653/"
                aria-label="Facebook"
                target="_blank"
                className={styles.socialLink}
              >
                <FacebookIcon size={20} />
              </a>
              <a href="#" aria-label="Instagram" className={styles.socialLink}>
                <InstagramIcon size={20} />
              </a>
              <a href="#" aria-label="Twitter" className={styles.socialLink}>
                <TwitterIcon size={20} />
              </a>
              <a href="#" aria-label="YouTube" className={styles.socialLink}>
                <YouTubeIcon size={20} />
              </a>
              <a
                href="https://www.linkedin.com/company/patliputra-builders-limited/about/"
                aria-label="LinkedIn"
                target="_blank"
                className={styles.socialLink}
              >
                <LinkedInIcon size={20} />
              </a>
            </div>
          </div>

          <div className={styles.formCol}>
            <form
              onSubmit={handleSubmit}
              className={styles.form}
              id="contact-form"
              aria-label="Contact form"
            >
              <h3 className={styles.formTitle}>Request a Callback</h3>
              <p className={styles.formSubtitle}>
                Fill in your details and our team will reach out within 24
                hours.
              </p>

              <div className={styles.formGroup}>
                <input
                  type="text"
                  id="contact-name"
                  placeholder="Your Full Name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={styles.input}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <input
                    type="email"
                    id="contact-email"
                    placeholder="Email Address"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <input
                    type="tel"
                    id="contact-phone"
                    placeholder="Phone Number"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <select
                  id="contact-property-type"
                  value={formData.propertyType}
                  onChange={(e) =>
                    setFormData({ ...formData, propertyType: e.target.value })
                  }
                  className={styles.input}
                  required
                >
                  <option value="">Select Property Type</option>
                  <option value="2bhk">2 BHK - The Luxe Suite</option>
                  <option value="3bhk">3 BHK - The Premium Haven</option>
                  <option value="4bhk">4 BHK - The Royal Penthouse</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <textarea
                  id="contact-message"
                  placeholder="Your Message (Optional)"
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className={styles.input}
                />
              </div>

              {submitted && (
                <div
                  style={{
                    background: "rgba(37, 211, 102, 0.1)",
                    border: "1px solid rgba(37, 211, 102, 0.3)",
                    borderRadius: "8px",
                    padding: "14px 18px",
                    marginBottom: "16px",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 10px 0",
                      color: "#1b8744",
                      fontWeight: 600,
                      fontSize: "0.92rem",
                    }}
                  >
                    ✓ Thank you! Details have been forwarded to our team via
                    email.
                  </p>
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        background: "#25D366",
                        color: "#ffffff",
                        padding: "10px 16px",
                        borderRadius: "6px",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        textDecoration: "none",
                        width: "100%",
                      }}
                    >
                      <WhatsAppIcon size={18} />
                      Connect directly on WhatsApp
                    </a>
                  )}
                </div>
              )}

              {isSubmitting && (
                <div className="form-loading-bar-track">
                  <div className="form-loading-bar-fill" />
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn btn--primary btn--lg ${styles.submitBtn}`}
                id="contact-submit"
                style={
                  isSubmitting
                    ? { opacity: 0.8, cursor: "not-allowed" }
                    : undefined
                }
              >
                {isSubmitting ? (
                  "Sending Enquiry..."
                ) : submitted ? (
                  <>
                    <CheckIcon size={20} />
                    Sent Successfully!
                  </>
                ) : (
                  <>
                    Send Enquiry
                    <SendIcon size={20} />
                  </>
                )}
              </button>

              <p className={styles.formDisclaimer}>
                By submitting, you agree to our privacy policy and consent to
                being contacted regarding your inquiry.
              </p>
            </form>
          </div>
        </div>

        {/* ================= OUR LOCATION & GOOGLE MAP SECTION ================= */}
        <div className={styles.locationSection}>
          <div className={styles.locationHeader}>
            <span className={styles.locationBadge}>Headquarters & Directions</span>
            <h2 className={styles.locationTitle}>
              Our <em>Location</em>
            </h2>
            <p className={styles.locationSubtitle}>
              Visit our registered headquarters on Fraser Road in the central business district of Patna,
              within walking distance of Patna Junction railway station, Mahavir Mandir, and Exhibition Road.
            </p>
          </div>

          <div className={styles.mapWrapper}>
            {/* Map Mode Switcher (Roadmap vs Satellite) */}
            <div className={styles.mapModeSwitcher} role="group" aria-label="Map View Mode">
              <button
                type="button"
                className={`${styles.mapModeBtn} ${
                  mapType === "roadmap" ? styles.mapModeBtnActive : ""
                }`}
                onClick={() => setMapType("roadmap")}
              >
                🗺️ Map View
              </button>
              <button
                type="button"
                className={`${styles.mapModeBtn} ${
                  mapType === "satellite" ? styles.mapModeBtnActive : ""
                }`}
                onClick={() => setMapType("satellite")}
              >
                🛰️ Satellite View
              </button>
            </div>

            {/* Floating Location Card matching the reference design */}
            <div className={styles.mapCardOverlay}>
              <span className={styles.mapCardBadge}>Corporate Headquarters</span>
              <h3 className={styles.mapCardName}>PATLIPUTRA BUILDERS LTD.</h3>
              <p className={styles.mapCardAddress}>
                301, Maharaja Kameshwar Complex,
                <br />
                Fraser Road Area, Patna, Bihar 800001
              </p>

              <div className={styles.mapCardRating}>
                <span className={styles.ratingNumber}>3.5</span>
                <div className={styles.stars} aria-label="Rating: 3.5 out of 5 stars">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span style={{ opacity: 0.35 }}>★</span>
                </div>
                <span className={styles.reviewsCount}>(16 Google Reviews)</span>
              </div>

              <div className={styles.mapCardActions}>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Patliputra+Builders+Ltd,+301,+Maharaja+Kameshwar+Complex,+Fraser+Road+Area,+Patna,+Bihar+800001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.openInMapsBtn}
                >
                  <ExternalLinkIcon size={16} />
                  Open in Maps
                </a>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Patliputra+Builders+Ltd,+301,+Maharaja+Kameshwar+Complex,+Fraser+Road+Area,+Patna,+Bihar+800001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.directionsBtn}
                  title="Get Directions"
                  aria-label="Get Directions"
                >
                  <NavigationIcon size={18} />
                </a>
              </div>

              <button
                type="button"
                className={styles.copyAddressBtn}
                onClick={handleCopyAddress}
              >
                {copiedAddress ? (
                  <>
                    <CheckIcon size={14} />
                    Address Copied to Clipboard!
                  </>
                ) : (
                  <>📋 Copy Full Address</>
                )}
              </button>
            </div>

            {/* Embedded Google Maps */}
            <iframe
              title="Patliputra Builders Ltd Location Map"
              src={
                mapType === "roadmap"
                  ? "https://maps.google.com/maps?q=25.6055,85.1373&hl=en&z=16&output=embed"
                  : "https://maps.google.com/maps?q=25.6055,85.1373&hl=en&t=k&z=17&output=embed"
              }
              className={styles.mapIframe}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Strategic Landmarks & Connectivity Highlights */}
          <div className={styles.landmarksGrid}>
            <div className={styles.landmarkCard}>
              <div className={styles.landmarkIcon}>🚆</div>
              <div className={styles.landmarkInfo}>
                <strong>Patna Junction Railway Station</strong>
                <span>500 m • 3 mins walk</span>
              </div>
            </div>

            <div className={styles.landmarkCard}>
              <div className={styles.landmarkIcon}>🛕</div>
              <div className={styles.landmarkInfo}>
                <strong>Mahavir Mandir & ISKCON Temple</strong>
                <span>600 m • 4 mins walk</span>
              </div>
            </div>

            <div className={styles.landmarkCard}>
              <div className={styles.landmarkIcon}>🏛️</div>
              <div className={styles.landmarkInfo}>
                <strong>Dak Bungalow Commercial Hub</strong>
                <span>400 m • 2 mins drive</span>
              </div>
            </div>

            <div className={styles.landmarkCard}>
              <div className={styles.landmarkIcon}>✈️</div>
              <div className={styles.landmarkInfo}>
                <strong>Jay Prakash Narayan Airport</strong>
                <span>5.8 km • 15 mins drive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
