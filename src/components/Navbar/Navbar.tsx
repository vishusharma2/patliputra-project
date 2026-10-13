"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

interface DropdownItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

interface NavLinkItem {
  label: string;
  href?: string;
  isDropdown?: boolean;
  dropdownHeader?: string;
  dropdownItems?: DropdownItem[];
}

const navLinks: NavLinkItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    isDropdown: true,
    dropdownHeader: "ABOUT PATLIPUTRA",
    dropdownItems: [
      { label: "About Us", href: "/about" },
      { label: "Why Choose Us", href: "/why-us" },
      { label: "Diversified Ventures", href: "/diversified" },
      { label: "Career", href: "/career" },
    ],
  },
  {
    label: "Our Services",
    isDropdown: true,
    dropdownHeader: "OUR SERVICES",
    dropdownItems: [
      {
        label: "Signature_Park",
        href: "https://signaturepark.app/",
        isExternal: true,
      },
      {
        label: "Loan Enquiries",
        href: "https://signaturepark.app/loan-enquiries",
        isExternal: true,
      },
      {
        label: "Tax Benefit Information",
        href: "https://signaturepark.app/tax-benefit-information",
        isExternal: true,
      },
      {
        label: "NRI Corner - Information Kit",
        href: "https://signaturepark.app/nri",
        isExternal: true,
      },
      {
        label: "Statutory Approvals",
        href: "https://signaturepark.app/statutory-approvals",
        isExternal: true,
      },
      {
        label: "Privacy Policy",
        href: "/privacy",
      },
      {
        label: "Term & Condition",
        href: "/terms",
      },
    ],
  },
  { label: "Projects", href: "/properties" },
  {
    label: "Media",
    isDropdown: true,
    dropdownHeader: "MEDIA & INSIGHTS",
    dropdownItems: [
      { label: "Press & News", href: "/media" },
      { label: "Blogs", href: "/blogs" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteType, setQuoteType] = useState<"customer" | "broker">("customer");
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [submittedQuoteData, setSubmittedQuoteData] = useState<{
    name: string;
    phone: string;
    userType?: "customer" | "broker";
    whatsappUrl?: string;
  } | null>(null);
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    phone: "",
    unitType: "3 BHK",
    budget: "₹75L - ₹1.2 Cr",
    note: "",
  });
  const [brokerForm, setBrokerForm] = useState({
    name: "",
    currentAgency: "",
    phone: "",
    email: "",
    experience: "1 - 3 Years",
    reraNumber: "",
    note: "",
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.dropdownItem}`)) {
        setOpenDropdown(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
        setQuoteModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleLinkClick = (href: string) => {
    setMobileOpen(false);
    setOpenDropdown(null);
    if (pathname === href) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDropdownItemClick = (href: string, isExternal?: boolean) => {
    setOpenDropdown(null);
    setMobileOpen(false);
    if (isExternal) return;

    const [targetPath, hash] = href.split("#");
    if (pathname === targetPath && hash) {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  const handleDropdownToggle = (e: React.MouseEvent, label: string) => {
    e.preventDefault();
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingQuote(true);

    const isBroker = quoteType === "broker";
    const dataToSend = isBroker
      ? {
          userType: "broker" as const,
          name: brokerForm.name,
          currentAgency: brokerForm.currentAgency,
          phone: brokerForm.phone,
          email: brokerForm.email,
          experience: brokerForm.experience,
          reraNumber: brokerForm.reraNumber,
          note: brokerForm.note,
        }
      : {
          userType: "customer" as const,
          name: quoteForm.name,
          phone: quoteForm.phone,
          unitType: quoteForm.unitType,
          budget: quoteForm.budget,
          note: quoteForm.note,
        };

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      const data = await res.json();
      const fallbackWaText = isBroker
        ? `Hi Patliputra Group, I would like to Register as an Authorized Broker / Channel Partner.\nBroker Name: ${dataToSend.name}\nCurrent Agency: ${dataToSend.currentAgency || "Independent"}\nMobile: ${dataToSend.phone}\nEmail: ${dataToSend.email || "N/A"}\nExperience: ${dataToSend.experience}`
        : `Hi Patliputra Group, I submitted a quote request for ${dataToSend.unitType}.\nName: ${dataToSend.name}\nPhone: ${dataToSend.phone}`;

      const waUrl =
        data?.whatsappUrl ||
        `https://api.whatsapp.com/send?phone=917303665845&text=${encodeURIComponent(
          fallbackWaText
        )}`;

      // Clear the respective form fields only after submission completes
      if (isBroker) {
        setBrokerForm({
          name: "",
          currentAgency: "",
          phone: "",
          email: "",
          experience: "1 - 3 Years",
          reraNumber: "",
          note: "",
        });
      } else {
        setQuoteForm({
          name: "",
          phone: "",
          unitType: "3 BHK",
          budget: "₹75L - ₹1.2 Cr",
          note: "",
        });
      }

      setSubmittedQuoteData({
        name: dataToSend.name,
        phone: dataToSend.phone,
        userType: isBroker ? "broker" : "customer",
        whatsappUrl: waUrl,
      });
      setQuoteSubmitted(true);
    } catch (err) {
      console.error("Error submitting quote to server:", err);
      // Clear form after submission completes even if error
      if (isBroker) {
        setBrokerForm({
          name: "",
          currentAgency: "",
          phone: "",
          email: "",
          experience: "1 - 3 Years",
          reraNumber: "",
          note: "",
        });
      } else {
        setQuoteForm({
          name: "",
          phone: "",
          unitType: "3 BHK",
          budget: "₹75L - ₹1.2 Cr",
          note: "",
        });
      }
      setSubmittedQuoteData({
        name: dataToSend.name,
        phone: dataToSend.phone,
        userType: isBroker ? "broker" : "customer",
      });
      setQuoteSubmitted(true);
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  const isLinkActive = (link: NavLinkItem) => {
    if (link.isDropdown) {
      if (link.label === "About") {
        return (
          pathname === "/about" ||
          pathname === "/why-us" ||
          pathname === "/diversified" ||
          pathname === "/career"
        );
      }
      if (link.label === "Our Services") {
        return (
          pathname.startsWith("/services") ||
          pathname === "/privacy" ||
          pathname === "/terms"
        );
      }
      if (link.label === "Media") {
        return pathname === "/media" || pathname === "/blogs";
      }
    }
    if (!link.href) return false;
    if (link.href === "/") {
      return pathname === "/";
    }
    return pathname === link.href || pathname.startsWith(link.href + "/");
  };

  if (pathname === "/patliputra-login") {
    return null;
  }

  return (
    <>
      <header
        className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}
        role="banner"
      >
        {/* Main Navbar */}
        <nav className={styles.nav} aria-label="Main navigation">
          <Link
            href="/"
            className={styles.logo}
            onClick={() => handleLinkClick("/")}
          >
            <span className={styles.logoIcon}>
              <img
                src="https://mbfrobyozijbwglauqop.supabase.co/storage/v1/object/public/project%20images/logo%20and%20other/logo_final.png"
                alt="logo"
                height={"50px"}
                width={"50px"}
              />
            </span>
            <div className={styles.logoText}>
              <span className={styles.logoName}>PATLIPUTRA</span>
              <span className={styles.logoSub}>GROUP</span>
            </div>
          </Link>

          <ul className={`${styles.links} ${mobileOpen ? styles.open : ""}`}>
            {navLinks.map((link) => {
              if (link.isDropdown) {
                const isOpen = openDropdown === link.label;
                return (
                  <li
                    key={link.label}
                    className={`${styles.dropdownItem} ${
                      isOpen ? styles.dropdownActive : ""
                    }`}
                    onMouseEnter={() => handleMouseEnter(link.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      type="button"
                      className={`${styles.link} ${styles.dropdownTrigger} ${
                        isLinkActive(link) ? styles.active : ""
                      }`}
                      onClick={(e) => handleDropdownToggle(e, link.label)}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      aria-label={`${link.label} Menu`}
                    >
                      <span>{link.label}</span>
                      <svg
                        className={`${styles.dropdownChevron} ${
                          isOpen ? styles.dropdownChevronOpen : ""
                        }`}
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    <div
                      className={`${styles.dropdownMenu} ${
                        isOpen ? styles.dropdownMenuOpen : ""
                      }`}
                      role="menu"
                      aria-label={`${link.label} Submenu`}
                    >
                      {/* Reference Header */}
                      <div className={styles.dropdownHeader}>
                        <span className={styles.dropdownTitle}>
                          {link.dropdownHeader || link.label.toUpperCase()}
                        </span>
                        <div className={styles.dropdownBarTrack}>
                          <span className={styles.dropdownBarSquare} />
                          <span className={styles.dropdownBarLine} />
                        </div>
                      </div>

                      {/* Options list */}
                      <ul className={styles.dropdownList}>
                        {link.dropdownItems?.map((item) => (
                          <li
                            key={item.label}
                            className={styles.dropdownListItem}
                            role="none"
                          >
                            {item.isExternal ? (
                              <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.dropdownLink}
                                role="menuitem"
                                onClick={() =>
                                  handleDropdownItemClick(item.href, true)
                                }
                              >
                                <span
                                  className={styles.itemBullet}
                                  aria-hidden="true"
                                >
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polyline points="9 18 15 12 9 6" />
                                  </svg>
                                </span>
                                <span className={styles.itemLabel}>
                                  {item.label}
                                </span>
                                <svg
                                  className={styles.externalIcon}
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  aria-label="External link"
                                >
                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                  <polyline points="15 3 21 3 21 9" />
                                  <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                              </a>
                            ) : (
                              <Link
                                href={item.href}
                                className={styles.dropdownLink}
                                role="menuitem"
                                onClick={() =>
                                  handleDropdownItemClick(item.href)
                                }
                              >
                                <span
                                  className={styles.itemBullet}
                                  aria-hidden="true"
                                >
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polyline points="9 18 15 12 9 6" />
                                  </svg>
                                </span>
                                <span className={styles.itemLabel}>
                                  {item.label}
                                </span>
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              }

              return (
                <li key={link.href}>
                  <Link
                    href={link.href!}
                    className={`${styles.link} ${
                      isLinkActive(link) ? styles.active : ""
                    }`}
                    onClick={() => handleLinkClick(link.href!)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}

            {/* Mobile Quote CTA inside drawer */}
            <li className={styles.mobileQuoteItem}>
              <button
                type="button"
                className={styles.mobileQuoteBtn}
                onClick={() => {
                  setMobileOpen(false);
                  setQuoteModalOpen(true);
                }}
              >
                <span>Get A Quote</span>
                <span>➔</span>
              </button>
            </li>
          </ul>

          <div className={styles.actions}>
            <a
              href="tel:+919876543210"
              className={styles.phone}
              aria-label="Call Patliputra Sales Hotline"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>+91 98765 43210</span>
            </a>

            <button
              type="button"
              className={styles.quoteBtn}
              onClick={() => setQuoteModalOpen(true)}
              aria-label="Request property quotation"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <span>Get A Quote</span>
            </button>

            <button
              className={`${styles.burger} ${
                mobileOpen ? styles.burgerOpen : ""
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>
      </header>

      {/* Instant Quote Request Modal */}
      {quoteModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => {
            setQuoteModalOpen(false);
            setQuoteSubmitted(false);
            setQuoteForm({
              name: "",
              phone: "",
              unitType: "3 BHK",
              budget: "₹75L - ₹1.2 Cr",
              note: "",
            });
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="quote-modal-title"
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={() => {
                setQuoteModalOpen(false);
                setQuoteSubmitted(false);
                setQuoteForm({
                  name: "",
                  phone: "",
                  unitType: "3 BHK",
                  budget: "₹75L - ₹1.2 Cr",
                  note: "",
                });
                setBrokerForm({
                  name: "",
                  currentAgency: "",
                  phone: "",
                  email: "",
                  experience: "1 - 3 Years",
                  reraNumber: "",
                  note: "",
                });
              }}
              aria-label="Close quote modal"
            >
              ✕
            </button>

            <div className={styles.modalHeader}>
              <span className={styles.modalBadge}>
                {quoteType === "customer"
                  ? "Instant Quotation & Pricing"
                  : "Channel Partner Network"}
              </span>
              <h3 id="quote-modal-title" className={styles.modalTitle}>
                {quoteType === "customer"
                  ? "REQUEST A CUSTOM QUOTE"
                  : "REGISTER AS A BROKER"}
              </h3>
              <p className={styles.modalDesc}>
                {quoteType === "customer"
                  ? "Receive official price sheets, floor inventory, and flexible payment plans delivered to your WhatsApp & Email."
                  : "Join Patliputra Group's authorized broker network. Gain direct access to premium project inventory, competitive commission structures, and priority site visits."}
              </p>
            </div>

            {quoteSubmitted ? (
              <div className={styles.modalSuccess}>
                <div className={styles.successIcon}>✓</div>
                <h4>
                  {submittedQuoteData?.userType === "broker"
                    ? "Broker Registration Submitted!"
                    : "Quote Request Received!"}
                </h4>
                <p>
                  Thank you,{" "}
                  <strong>{submittedQuoteData?.name || (quoteType === "broker" ? "Partner" : "Customer")}</strong>.
                  Your {submittedQuoteData?.userType === "broker" ? "broker registration application" : "request"} details have been dispatched to our team via
                  email.
                </p>
                {submittedQuoteData?.whatsappUrl && (
                  <a
                    href={submittedQuoteData.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      background: "#25D366",
                      color: "#ffffff",
                      padding: "11px 18px",
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      textDecoration: "none",
                      marginBottom: "14px",
                      width: "100%",
                      boxShadow: "0 4px 15px rgba(37,211,102,0.3)",
                    }}
                  >
                    <WhatsAppIcon size={18} />
                    Chat on WhatsApp (+91 7303665845)
                  </a>
                )}
                <button
                  type="button"
                  className={styles.modalSubmitBtn}
                  onClick={() => {
                    setQuoteSubmitted(false);
                    setSubmittedQuoteData(null);
                    setQuoteModalOpen(false);
                    setQuoteForm({
                      name: "",
                      phone: "",
                      unitType: "3 BHK",
                      budget: "₹75L - ₹1.2 Cr",
                      note: "",
                    });
                    setBrokerForm({
                      name: "",
                      currentAgency: "",
                      phone: "",
                      email: "",
                      experience: "1 - 3 Years",
                      reraNumber: "",
                      note: "",
                    });
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                {/* Customer vs Broker Toggle Option */}
                <div
                  className={styles.quoteTypeToggle}
                  role="tablist"
                  aria-label="Quote Inquiry Type"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={quoteType === "customer"}
                    className={`${styles.quoteTypeBtn} ${
                      quoteType === "customer" ? styles.quoteTypeBtnActive : ""
                    }`}
                    onClick={() => setQuoteType("customer")}
                  >
                    <span>👤</span> Direct Customer
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={quoteType === "broker"}
                    className={`${styles.quoteTypeBtn} ${
                      quoteType === "broker" ? styles.quoteTypeBtnActive : ""
                    }`}
                    onClick={() => setQuoteType("broker")}
                  >
                    <span>🏢</span> Register as a Broker
                  </button>
                </div>

                {quoteType === "customer" ? (
                  /* ================= CUSTOMER FORM ================= */
                  <form onSubmit={handleQuoteSubmit} className={styles.modalForm}>
                    <div className={styles.modalRow}>
                      <div className={styles.modalField}>
                        <label>Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ramesh Kumar"
                          value={quoteForm.name || ""}
                          onChange={(e) =>
                            setQuoteForm({ ...quoteForm, name: e.target.value })
                          }
                        />
                      </div>
                      <div className={styles.modalField}>
                        <label>Phone Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={quoteForm.phone || ""}
                          onChange={(e) =>
                            setQuoteForm({ ...quoteForm, phone: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className={styles.modalRow}>
                      <div className={styles.modalField}>
                        <label>Unit Configuration</label>
                        <select
                          value={quoteForm.unitType || "3 BHK"}
                          onChange={(e) =>
                            setQuoteForm({
                              ...quoteForm,
                              unitType: e.target.value,
                            })
                          }
                        >
                          <option value="2 BHK">2 BHK Luxury Apartment</option>
                          <option value="3 BHK">3 BHK Premium Residence</option>
                          <option value="4 BHK / Penthouse">
                            4 BHK / Penthouse
                          </option>
                          <option value="Commercial Unit">
                            Commercial Office / Retail
                          </option>
                        </select>
                      </div>
                      <div className={styles.modalField}>
                        <label>Expected Budget</label>
                        <select
                          value={quoteForm.budget || "₹75L - ₹1.2 Cr"}
                          onChange={(e) =>
                            setQuoteForm({
                              ...quoteForm,
                              budget: e.target.value,
                            })
                          }
                        >
                          <option value="₹45L - ₹75L">
                            ₹45 Lakhs – ₹75 Lakhs
                          </option>
                          <option value="₹75L - ₹1.2 Cr">
                            ₹75 Lakhs – ₹1.2 Crores
                          </option>
                          <option value="₹1.2 Cr - ₹2.5 Cr">
                            ₹1.2 Crores – ₹2.5 Crores
                          </option>
                          <option value="Above ₹2.5 Cr">Above ₹2.5 Crores</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.modalField}>
                      <label>Custom Note (Optional)</label>
                      <textarea
                        rows={3}
                        placeholder="Any specific preferences, questions, or notes..."
                        value={quoteForm.note || ""}
                        onChange={(e) =>
                          setQuoteForm({ ...quoteForm, note: e.target.value })
                        }
                      />
                    </div>

                    {isSubmittingQuote && (
                      <div className="form-loading-bar-track">
                        <div className="form-loading-bar-fill" />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmittingQuote}
                      className={styles.modalSubmitBtn}
                      style={
                        isSubmittingQuote
                          ? { opacity: 0.8, cursor: "not-allowed" }
                          : undefined
                      }
                    >
                      {isSubmittingQuote
                        ? "Submitting Request..."
                        : "Get Instant Quotation ➔"}
                    </button>
                  </form>
                ) : (
                  /* ================= REGISTER AS A BROKER FORM ================= */
                  <form onSubmit={handleQuoteSubmit} className={styles.modalForm}>
                    <div className={styles.modalRow}>
                      <div className={styles.modalField}>
                        <label>Broker Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Vikas Verma"
                          value={brokerForm.name || ""}
                          onChange={(e) =>
                            setBrokerForm({ ...brokerForm, name: e.target.value })
                          }
                        />
                      </div>
                      <div className={styles.modalField}>
                        <label>Current Agency *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Patna Realty Advisors / Independent"
                          value={brokerForm.currentAgency || ""}
                          onChange={(e) =>
                            setBrokerForm({
                              ...brokerForm,
                              currentAgency: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className={styles.modalRow}>
                      <div className={styles.modalField}>
                        <label>Mobile Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={brokerForm.phone || ""}
                          onChange={(e) =>
                            setBrokerForm({ ...brokerForm, phone: e.target.value })
                          }
                        />
                      </div>
                      <div className={styles.modalField}>
                        <label>Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="broker@agency.com"
                          value={brokerForm.email || ""}
                          onChange={(e) =>
                            setBrokerForm({ ...brokerForm, email: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className={styles.modalRow}>
                      <div className={styles.modalField}>
                        <label>Experience in Real Estate *</label>
                        <select
                          value={brokerForm.experience || "1 - 3 Years"}
                          onChange={(e) =>
                            setBrokerForm({
                              ...brokerForm,
                              experience: e.target.value,
                            })
                          }
                        >
                          <option value="Less than 1 Year">Less than 1 Year</option>
                          <option value="1 - 3 Years">1 – 3 Years</option>
                          <option value="3 - 5 Years">3 – 5 Years</option>
                          <option value="5 - 10 Years">5 – 10 Years</option>
                          <option value="10+ Years">10+ Years</option>
                        </select>
                      </div>
                      <div className={styles.modalField}>
                        <label>RERA Registration No (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. BR-RERA-AG-XXXX"
                          value={brokerForm.reraNumber || ""}
                          onChange={(e) =>
                            setBrokerForm({
                              ...brokerForm,
                              reraNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className={styles.modalField}>
                      <label>Primary Focus / Operating Cities (Optional)</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Luxury Residential, Commercial, Land, Greater Patna, Bihta..."
                        value={brokerForm.note || ""}
                        onChange={(e) =>
                          setBrokerForm({ ...brokerForm, note: e.target.value })
                        }
                      />
                    </div>

                    {isSubmittingQuote && (
                      <div className="form-loading-bar-track">
                        <div className="form-loading-bar-fill" />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmittingQuote}
                      className={styles.modalSubmitBtn}
                      style={
                        isSubmittingQuote
                          ? { opacity: 0.8, cursor: "not-allowed" }
                          : undefined
                      }
                    >
                      {isSubmittingQuote
                        ? "Registering Broker..."
                        : "Register as a Broker ➔"}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
