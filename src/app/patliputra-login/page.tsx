"use client";

import { useState, useEffect, FormEvent, KeyboardEvent } from "react";
import Link from "next/link";
import styles from "./AdminLogin.module.css";
import initialData from "@/data/projectsData.json";

// Admin default credentials for demonstration & testing
const DEMO_ADMIN_ID = "admin@patliputragroup.com";
const DEMO_ADMIN_PASS = "Patliputra@Admin2026";

interface DeliveredProject {
  id?: string;
  order?: number;
  name: string;
  location: string;
  image: string;
  description: string;
}

interface OngoingProject {
  id: string;
  order?: number;
  type: string;
  title: string;
  location: string;
  area: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  image: string;
  tag?: string;
  rera: string;
  features: string[];
}

const DELIVERED_PRESET_IMAGES = [
  { name: "Satyam Apartment", url: "/img/delivered/satyam.webp" },
  { name: "Viswamohini", url: "/img/delivered/viswamohini.webp" },
  { name: "Lalita Apartment", url: "/img/delivered/lalita.webp" },
  { name: "Maharaja Kameshwar", url: "/img/delivered/maharaja.webp" },
  { name: "Patliputra Nirvana", url: "/img/delivered/nirvana.webp" },
  { name: "Patliputra Exotica", url: "/img/delivered/exotica.webp" },
  { name: "Patligram Heights", url: "/img/delivered/patligram.webp" },
  { name: "Alina Heritage", url: "/img/delivered/alina.webp" },
  { name: "Madhuri Complex", url: "/img/delivered/madhuri.webp" },
  { name: "Jyotipuram", url: "/img/delivered/jyotipuram.webp" },
  { name: "Patliputra Mall & Towers", url: "/img/delivered/pmall.webp" },
  { name: "Central Park Residences", url: "/img/delivered/park.webp" },
];

const ONGOING_PRESET_IMAGES = [
  {
    name: "Luxury High-Rise Tower",
    url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
  },
  {
    name: "Modern Glass Facade",
    url: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&q=80",
  },
  {
    name: "Executive Villa & Penthouse",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  },
  {
    name: "Skyline Residences",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  },
  {
    name: "Contemporary Green Living",
    url: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&q=80",
  },
];

export default function PatliputraLoginPage() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [capsLockActive, setCapsLockActive] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Project Management State
  const [activeTab, setActiveTab] = useState<
    "delivered" | "ongoing" | "overview"
  >("delivered");
  const [deliveredProjects, setDeliveredProjects] = useState<
    DeliveredProject[]
  >(initialData.delivered || []);
  const [ongoingProjects, setOngoingProjects] = useState<OngoingProject[]>(
    initialData.ongoing || [],
  );

  // Modals for Adding Projects
  const [showAddDeliveredModal, setShowAddDeliveredModal] = useState(false);
  const [showAddOngoingModal, setShowAddOngoingModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add Delivered Form State
  const [newDelivered, setNewDelivered] = useState({
    name: "",
    location: "Patna",
    image: "/img/delivered/satyam.webp",
    description: "",
  });

  // Add Ongoing Form State
  const [newOngoing, setNewOngoing] = useState({
    title: "",
    type: "3 & 4 BHK",
    location: "Bailey Road, Patna",
    area: "1,800 - 2,500 sq.ft.",
    price: "₹85 Lakhs*",
    bedrooms: 3,
    bathrooms: 3,
    image: ONGOING_PRESET_IMAGES[0].url,
    tag: "Under Construction",
    rera: "BRERAP00" + Math.floor(100 + Math.random() * 900) + "-1/2026",
    features:
      "Clubhouse Access, 24/7 Multi-Tier Security, High Speed Elevators, 100% Power Backup",
  });

  // Edit Project States & Modals
  const [editingDelivered, setEditingDelivered] =
    useState<DeliveredProject | null>(null);
  const [showEditDeliveredModal, setShowEditDeliveredModal] = useState(false);

  const [editingOngoing, setEditingOngoing] = useState<OngoingProject | null>(
    null
  );
  const [showEditOngoingModal, setShowEditOngoingModal] = useState(false);
  const [editingOngoingFeaturesStr, setEditingOngoingFeaturesStr] =
    useState("");

  // Check saved session on mount & set document title
  useEffect(() => {
    document.title =
      "Executive Security Gateway & Project Management | Patliputra Group";
    try {
      const savedSession = localStorage.getItem("patliputra_admin_session");
      if (savedSession === "active") {
        setIsAuthenticated(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch latest projects data whenever authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/admin/projects")
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            if (Array.isArray(data.delivered))
              setDeliveredProjects(data.delivered);
            if (Array.isArray(data.ongoing)) setOngoingProjects(data.ongoing);
          }
        })
        .catch((err) =>
          console.error("Error fetching projects in admin console:", err),
        );
    }
  }, [isAuthenticated]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3800);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Detect Caps Lock state
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState("CapsLock"));
    }
  };

  const handleQuickFill = () => {
    setAdminId(DEMO_ADMIN_ID);
    setPassword(DEMO_ADMIN_PASS);
    setErrorMessage("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!adminId.trim()) {
      setErrorMessage("Corporate identifier or email is required.");
      triggerShake();
      return;
    }

    if (!password) {
      setErrorMessage("Administrative security key is required.");
      triggerShake();
      return;
    }

    setIsLoading(true);

    // Simulate enterprise auth handshake
    setTimeout(() => {
      setIsLoading(false);

      const isValidUser =
        adminId.trim().toLowerCase() === DEMO_ADMIN_ID.toLowerCase() ||
        adminId.trim().toLowerCase() === "admin";
      const isValidPass =
        password === DEMO_ADMIN_PASS || password === "admin123";

      if (isValidUser && isValidPass) {
        setIsAuthenticated(true);
        try {
          localStorage.setItem("patliputra_admin_session", "active");
        } catch {
          // ignore storage errs
        }
        setToastMessage(
          "Security handshake verified. Welcome, Executive Director.",
        );
      } else {
        setErrorMessage(
          "Access Denied: Invalid administrator credentials or unverified terminal.",
        );
        triggerShake();
      }
    }, 900);
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 550);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setPassword("");
    try {
      localStorage.removeItem("patliputra_admin_session");
    } catch {
      // ignore
    }
    setToastMessage("Administrator session safely terminated.");
  };

  // Add Delivered Project Handler
  const handleCreateDelivered = async (e: FormEvent) => {
    e.preventDefault();
    if (!newDelivered.name.trim()) {
      alert("Please enter project name");
      return;
    }

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "delivered",
          project: {
            id: `delivered-${Date.now()}`,
            order: deliveredProjects.length + 1,
            name: newDelivered.name.trim(),
            location: newDelivered.location.trim() || "Patna",
            image: newDelivered.image || "/img/delivered/satyam.webp",
            description:
              newDelivered.description.trim() ||
              "Prestigious landmark delivered with highest structural integrity and premium finishes by Patliputra Group.",
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setDeliveredProjects(data.data.delivered);
        setShowAddDeliveredModal(false);
        setNewDelivered({
          name: "",
          location: "Patna",
          image: "/img/delivered/satyam.webp",
          description: "",
        });
        setToastMessage(
          `✓ Delivered project "${newDelivered.name}" published successfully!`,
        );
      } else {
        alert(data.error || "Failed to add delivered project");
      }
    } catch (err) {
      console.error("Error creating delivered project:", err);
      alert("Network error creating project");
    }
  };

  // Deletion inline confirmation state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Delete Delivered Project Handler
  const handleDeleteDelivered = async (id?: string, name?: string) => {
    if (!id) return;

    try {
      const res = await fetch(
        `/api/admin/projects?category=delivered&id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        },
      );

      const data = await res.json();
      if (res.ok && data.success) {
        setDeliveredProjects(data.data.delivered);
        setToastMessage(
          `✓ Delivered project "${name || id}" removed successfully.`,
        );
      } else {
        alert(data.error || "Failed to remove project");
      }
    } catch (err) {
      console.error("Error deleting delivered project:", err);
      alert("Network error deleting project");
    }
  };

  // Add Ongoing Project Handler
  const handleCreateOngoing = async (e: FormEvent) => {
    e.preventDefault();
    if (!newOngoing.title.trim()) {
      alert("Please enter project title");
      return;
    }

    const featureList = newOngoing.features
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "ongoing",
          project: {
            id: `ongoing-${Date.now()}`,
            order: ongoingProjects.length + 1,
            title: newOngoing.title.trim(),
            type: newOngoing.type.trim() || "3 & 4 BHK",
            location: newOngoing.location.trim() || "Bailey Road, Patna",
            area: newOngoing.area.trim() || "1,800 - 2,500 sq.ft.",
            price: newOngoing.price.trim() || "Price on Request",
            bedrooms: Number(newOngoing.bedrooms) || 3,
            bathrooms: Number(newOngoing.bathrooms) || 3,
            image: newOngoing.image || ONGOING_PRESET_IMAGES[0].url,
            tag: newOngoing.tag || "Under Construction",
            rera: newOngoing.rera.trim() || "BRERAP00-PENDING",
            features:
              featureList.length > 0
                ? featureList
                : ["Clubhouse Access", "24/7 Security", "Power Backup"],
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOngoingProjects(data.data.ongoing);
        setShowAddOngoingModal(false);
        setNewOngoing({
          title: "",
          type: "3 & 4 BHK",
          location: "Bailey Road, Patna",
          area: "1,800 - 2,500 sq.ft.",
          price: "₹85 Lakhs*",
          bedrooms: 3,
          bathrooms: 3,
          image: ONGOING_PRESET_IMAGES[0].url,
          tag: "Under Construction",
          rera: "BRERAP00" + Math.floor(100 + Math.random() * 900) + "-1/2026",
          features:
            "Clubhouse Access, 24/7 Multi-Tier Security, High Speed Elevators, 100% Power Backup",
        });
        setToastMessage(
          `✓ Ongoing project "${newOngoing.title}" published successfully!`,
        );
      } else {
        alert(data.error || "Failed to add ongoing project");
      }
    } catch (err) {
      console.error("Error creating ongoing project:", err);
      alert("Network error creating project");
    }
  };

  // Delete Ongoing Project Handler
  const handleDeleteOngoing = async (id: string, title: string) => {
    try {
      const res = await fetch(
        `/api/admin/projects?category=ongoing&id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        },
      );

      const data = await res.json();
      if (res.ok && data.success) {
        setOngoingProjects(data.data.ongoing);
        setToastMessage(`✓ Ongoing project "${title}" removed successfully.`);
      } else {
        alert(data.error || "Failed to remove project");
      }
    } catch (err) {
      console.error("Error deleting ongoing project:", err);
      alert("Network error deleting project");
    }
  };

  // Open Edit Delivered Modal
  const handleOpenEditDelivered = (project: DeliveredProject) => {
    setEditingDelivered({ ...project });
    setShowEditDeliveredModal(true);
  };

  // Submit Edit Delivered Project
  const handleUpdateDelivered = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingDelivered || !editingDelivered.id || !editingDelivered.name.trim()) {
      alert("Please enter a valid project name.");
      return;
    }

    try {
      const res = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "delivered",
          project: {
            ...editingDelivered,
            name: editingDelivered.name.trim(),
            location: editingDelivered.location.trim() || "Patna",
            image: editingDelivered.image || "/img/delivered/satyam.webp",
            description: editingDelivered.description.trim(),
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setDeliveredProjects(data.data.delivered);
        setShowEditDeliveredModal(false);
        setEditingDelivered(null);
        setToastMessage(
          `✓ Delivered project "${editingDelivered.name}" updated successfully!`
        );
      } else {
        alert(data.error || "Failed to update project");
      }
    } catch (err) {
      console.error("Error updating delivered project:", err);
      alert("Network error updating project");
    }
  };

  // Open Edit Ongoing Modal
  const handleOpenEditOngoing = (project: OngoingProject) => {
    setEditingOngoing({ ...project });
    setEditingOngoingFeaturesStr(
      Array.isArray(project.features) ? project.features.join(", ") : ""
    );
    setShowEditOngoingModal(true);
  };

  // Submit Edit Ongoing Project
  const handleUpdateOngoing = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingOngoing || !editingOngoing.id || !editingOngoing.title.trim()) {
      alert("Please enter a valid project title.");
      return;
    }

    const featureList = editingOngoingFeaturesStr
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "ongoing",
          project: {
            ...editingOngoing,
            title: editingOngoing.title.trim(),
            type: editingOngoing.type.trim() || "3 & 4 BHK",
            location: editingOngoing.location.trim() || "Bailey Road, Patna",
            area: editingOngoing.area.trim() || "1,800 - 2,500 sq.ft.",
            price: editingOngoing.price.trim() || "Price on Request",
            bedrooms: Number(editingOngoing.bedrooms) || 3,
            bathrooms: Number(editingOngoing.bathrooms) || 3,
            image: editingOngoing.image || ONGOING_PRESET_IMAGES[0].url,
            tag: editingOngoing.tag || "Under Construction",
            rera: editingOngoing.rera.trim() || "BRERAP00-PENDING",
            features:
              featureList.length > 0
                ? featureList
                : editingOngoing.features || [
                    "Clubhouse Access",
                    "24/7 Security",
                    "Power Backup",
                  ],
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOngoingProjects(data.data.ongoing);
        setShowEditOngoingModal(false);
        setEditingOngoing(null);
        setToastMessage(
          `✓ Ongoing project "${editingOngoing.title}" updated successfully!`
        );
      } else {
        alert(data.error || "Failed to update project");
      }
    } catch (err) {
      console.error("Error updating ongoing project:", err);
      alert("Network error updating project");
    }
  };

  return (
    <div className={styles.viewport}>
      {/* Dynamic Background Atmosphere */}
      <div className={styles.bgLayer} aria-hidden="true">
        <div className={styles.glowOrb1} />
        <div className={styles.glowOrb2} />
        <div className={styles.glowOrb3} />
        <div className={styles.gridOverlay} />
      </div>

      {/* Top Header Bar */}
      <header className={styles.topNav}>
        <Link href="/" className={styles.brandLink}>
          <div className={styles.monogramWrap}>
            <span className={styles.monogram}>
              <img
                src="/img/logo_final.png"
                alt="logo"
                height={"50px"}
                width={"50px"}
              />
            </span>
          </div>
          <div className={styles.brandTitleGroup}>
            <span className={styles.brandTitle}>PATLIPUTRA</span>
            <span className={styles.brandSubtitle}>EXECUTIVE PORTAL</span>
          </div>
        </Link>

        <div className={styles.securityBadge}>
          <span className={styles.statusDot} />
          <span>
            {isAuthenticated
              ? "AUTHENTICATED SESSION • FULL ADMIN PRIVILEGES"
              : "RESTRICTED ACCESS • 256-BIT ENCRYPTED"}
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className={styles.mainContainer}>
        {!isAuthenticated ? (
          /* ================= LOGIN FORM ================= */
          <div
            className={`${styles.loginCard} ${isShaking ? styles.shakeCard : ""}`}
          >
            <div className={styles.cardTopBar} />

            <div className={styles.cardHeader}>
              <div className={styles.lockIconWrap}>
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h1 className={styles.cardHeading}>Admin Authentication</h1>
              <p className={styles.cardDesc}>
                Enter authorized credentials to manage Delivered &amp; Ongoing
                projects
              </p>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div
                className={`${styles.alertBox} ${styles.alertBoxError}`}
                role="alert"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ flexShrink: 0, marginTop: "1px" }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errorMessage}</span>
                <button
                  type="button"
                  className={styles.alertCloseBtn}
                  onClick={() => setErrorMessage("")}
                  aria-label="Dismiss error"
                >
                  &times;
                </button>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <div className={styles.inputGroup}>
                <label htmlFor="admin-id" className={styles.inputLabel}>
                  Admin Identifier
                </label>
                <div className={styles.inputFieldWrapper}>
                  <span className={styles.fieldIcon}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    id="admin-id"
                    type="text"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    placeholder="name@patliputragroup.com"
                    className={styles.input}
                    autoComplete="username"
                    autoFocus
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.inputLabel}>
                  <span>Security Key</span>
                  {capsLockActive && (
                    <span className={styles.capsIndicator}>
                      ⚠️ Caps Lock ON
                    </span>
                  )}
                </div>
                <div className={styles.inputFieldWrapper}>
                  <span className={styles.fieldIcon}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="••••••••••••"
                    className={`${styles.input} ${styles.passwordInput}`}
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className={styles.eyeToggleBtn}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide security key" : "Show security key"
                    }
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
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
                    )}
                  </button>
                </div>
              </div>

              <div className={styles.formOptionsRow}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className={styles.customCheckbox}
                  />
                  <span>Trust this terminal</span>
                </label>
                <button
                  type="button"
                  className={styles.forgotLink}
                  onClick={() => setShowForgotModal(true)}
                >
                  Lost Access Key?
                </button>
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isLoading}
                id="admin-login-submit"
              >
                {isLoading ? (
                  <>
                    <span className={styles.spinner} />
                    <span>Verifying Session...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate &amp; Enter</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Helper Box */}
            <div className={styles.demoHelperBox}>
              <div className={styles.demoHelperText}>
                <strong>Authorized Test Profile</strong>
                <span>admin@patliputragroup.com</span>
              </div>
              <button
                type="button"
                className={styles.quickFillBtn}
                onClick={handleQuickFill}
                title="Populate test credentials"
              >
                Quick Fill
              </button>
            </div>

            <div className={styles.returnLinkWrap}>
              <Link href="/" className={styles.returnLink}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Return to Public Website</span>
              </Link>
            </div>
          </div>
        ) : (
          /* ================= AUTHENTICATED PROJECT MANAGEMENT SUITE ================= */
          <div className={styles.dashboardWrapper}>
            {/* Top Dashboard Header */}
            <div className={styles.dashboardHeader}>
              <div className={styles.dashHeaderInfo}>
                <div className={styles.adminAvatar}>
                  <img
                    src="/img/logo_final.png"
                    alt="logo"
                    height={"50px"}
                    width={"50px"}
                  />
                </div>
                <div>
                  <h1 className={styles.dashHeaderTitle}>
                    Executive Project Management Console
                  </h1>
                  <div className={styles.dashHeaderMeta}>
                    <span>
                      Authenticated: <strong>Director Level</strong>
                    </span>
                    <span>&bull;</span>
                    <span>
                      Status:{" "}
                      <strong style={{ color: "#2ecc71" }}>
                        Live Sync Active
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.dashHeaderActions}>
                <Link
                  href="/properties"
                  className={styles.btnSecondary}
                  target="_blank"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  <span>Preview Public Projects</span>
                </Link>
                <button
                  type="button"
                  className={styles.signOutBtn}
                  onClick={handleSignOut}
                  style={{ margin: 0, padding: "0.6rem 1.15rem" }}
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Tabs Container */}
            <div className={styles.tabsContainer} role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "delivered"}
                className={`${styles.tabBtn} ${activeTab === "delivered" ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveTab("delivered")}
              >
                <span>Delivered Projects</span>
                <span className={styles.tabCountBadge}>
                  {deliveredProjects.length}
                </span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "ongoing"}
                className={`${styles.tabBtn} ${activeTab === "ongoing" ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveTab("ongoing")}
              >
                <span>Ongoing Developments</span>
                <span className={styles.tabCountBadge}>
                  {ongoingProjects.length}
                </span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "overview"}
                className={`${styles.tabBtn} ${activeTab === "overview" ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                <span>Overview &amp; Metrics</span>
              </button>
            </div>

            {/* TAB 1: DELIVERED PROJECTS */}
            {activeTab === "delivered" && (
              <div>
                <div className={styles.toolbarRow}>
                  <div className={styles.toolbarTitle}>
                    <span>Delivered Projects Directory</span>
                    <span className={styles.tabCountBadge}>
                      {deliveredProjects.length} Total
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.addProjectBtn}
                    onClick={() => setShowAddDeliveredModal(true)}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>Add Delivered Project</span>
                  </button>
                </div>

                <div className={styles.projectsGrid}>
                  {deliveredProjects.map((p, index) => (
                    <div
                      key={p.id || `${p.name}-${index}`}
                      className={styles.projectCard}
                    >
                      <div className={styles.cardMedia}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt={p.name} loading="lazy" />
                        <span className={styles.cardStatusPill}>
                          Delivered &bull; #{String(p.order || index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className={styles.cardBody}>
                        <h3 className={styles.cardTitle}>{p.name}</h3>
                        <div className={styles.cardLocation}>
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span>{p.location}</span>
                        </div>
                        <p className={styles.cardDescText}>{p.description}</p>
                        <div className={styles.cardFooterAction}>
                          <span
                            style={{
                              fontSize: "0.72rem",
                              color: "rgba(255,255,255,0.4)",
                            }}
                          >
                            ID: {p.id || "legacy"}
                          </span>
                          <div className={styles.cardActionBtns}>
                            <button
                              type="button"
                              className={styles.editCardBtn}
                              onClick={() => handleOpenEditDelivered(p)}
                              title="Edit project information"
                            >
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                              >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                              <span>Edit</span>
                            </button>

                            {confirmDeleteId === p.id ? (
                              <div className={styles.deleteConfirmGroup}>
                                <button
                                  type="button"
                                  className={styles.deleteConfirmBtn}
                                  onClick={() => {
                                    setConfirmDeleteId(null);
                                    handleDeleteDelivered(p.id, p.name);
                                  }}
                                >
                                  Confirm
                                </button>
                                <button
                                  type="button"
                                  className={styles.deleteCancelBtn}
                                  onClick={() => setConfirmDeleteId(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                className={styles.deleteCardBtn}
                                onClick={() => setConfirmDeleteId(p.id || null)}
                              >
                                <svg
                                  width="13"
                                  height="13"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                                <span>Remove</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: ONGOING DEVELOPMENTS */}
            {activeTab === "ongoing" && (
              <div>
                <div className={styles.toolbarRow}>
                  <div className={styles.toolbarTitle}>
                    <span>Ongoing Developments Directory</span>
                    <span className={styles.tabCountBadge}>
                      {ongoingProjects.length} Active
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.addProjectBtn}
                    onClick={() => setShowAddOngoingModal(true)}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>Add Ongoing Project</span>
                  </button>
                </div>

                <div className={styles.projectsGrid}>
                  {ongoingProjects.map((p, index) => (
                    <div key={p.id} className={styles.projectCard}>
                      <div className={styles.cardMedia}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt={p.title} loading="lazy" />
                        <span className={styles.cardStatusPill}>
                          {p.tag || "Ongoing"} &bull; #{String(p.order || index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className={styles.cardBody}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "4px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.74rem",
                              fontWeight: 700,
                              color: "#deb360",
                              letterSpacing: "1px",
                            }}
                          >
                            {p.type}
                          </span>
                          <span
                            style={{
                              fontSize: "0.7rem",
                              color: "rgba(255,255,255,0.5)",
                            }}
                          >
                            {p.rera}
                          </span>
                        </div>
                        <h3 className={styles.cardTitle}>{p.title}</h3>
                        <div className={styles.cardLocation}>
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span>{p.location}</span>
                        </div>

                        <div className={styles.cardSpecsRow}>
                          <span>
                            Area: <strong>{p.area}</strong>
                          </span>
                          <span>
                            BHK: <strong>{p.bedrooms}</strong>
                          </span>
                          <span>
                            Baths: <strong>{p.bathrooms}</strong>
                          </span>
                          <span>
                            Price: <strong>{p.price}</strong>
                          </span>
                        </div>

                        <div className={styles.cardFooterAction}>
                          <span
                            style={{
                              fontSize: "0.72rem",
                              color: "rgba(255,255,255,0.4)",
                            }}
                          >
                            ID: {p.id}
                          </span>
                          <div className={styles.cardActionBtns}>
                            <button
                              type="button"
                              className={styles.editCardBtn}
                              onClick={() => handleOpenEditOngoing(p)}
                              title="Edit development information"
                            >
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                              >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                              <span>Edit</span>
                            </button>

                            {confirmDeleteId === p.id ? (
                              <div className={styles.deleteConfirmGroup}>
                                <button
                                  type="button"
                                  className={styles.deleteConfirmBtn}
                                  onClick={() => {
                                    setConfirmDeleteId(null);
                                    handleDeleteOngoing(p.id, p.title);
                                  }}
                                >
                                  Confirm
                                </button>
                                <button
                                  type="button"
                                  className={styles.deleteCancelBtn}
                                  onClick={() => setConfirmDeleteId(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                className={styles.deleteCardBtn}
                                onClick={() => setConfirmDeleteId(p.id)}
                              >
                                <svg
                                  width="13"
                                  height="13"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                                <span>Remove</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: OVERVIEW & AUDIT */}
            {activeTab === "overview" && (
              <div
                className={styles.dashboardCard}
                style={{ maxWidth: "100%", textAlign: "left" }}
              >
                <div
                  className={styles.verifiedBadge}
                  style={{ margin: "0 0 1rem 0" }}
                >
                  <svg
                    width="34"
                    height="34"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h2
                  className={styles.cardHeading}
                  style={{ textAlign: "left" }}
                >
                  Portfolio Health &amp; Audit Status
                </h2>
                <p
                  className={styles.cardDesc}
                  style={{ textAlign: "left", marginBottom: "2rem" }}
                >
                  Real-time synchronization between executive internal storage
                  and public client displays.
                </p>

                <div className={styles.statsGrid}>
                  <div className={styles.statItem}>
                    <div className={styles.statValue}>
                      {deliveredProjects.length}
                    </div>
                    <div className={styles.statLabel}>
                      Completed &amp; Delivered Projects
                    </div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statValue}>
                      {ongoingProjects.length}
                    </div>
                    <div className={styles.statLabel}>
                      Active Ongoing Landmarks
                    </div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statValue}>100%</div>
                    <div className={styles.statLabel}>
                      RERA Bihar Filing Compliance
                    </div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statValue}>35+ Years</div>
                    <div className={styles.statLabel}>
                      Patliputra Group Proven Legacy (Since 1989)
                    </div>
                  </div>
                </div>

                <div
                  style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}
                >
                  <Link
                    href="/properties"
                    className={styles.submitBtn}
                    style={{ maxWidth: "300px", textDecoration: "none" }}
                  >
                    View Live Website View
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODAL: ADD DELIVERED PROJECT */}
        {showAddDeliveredModal && (
          <div
            className={styles.modalBackdrop}
            onClick={() => setShowAddDeliveredModal(false)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <div>
                  <h3 className={styles.modalTitle}>Add Delivered Project</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background: "rgba(200, 164, 92, 0.15)",
                        border: "1px solid rgba(200, 164, 92, 0.35)",
                        color: "#deb360",
                        fontWeight: 600,
                      }}
                    >
                      Order Position: #{String(deliveredProjects.length + 1).padStart(2, "0")}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)" }}>
                      (First added remains #01 &bull; new project is appended sequentially)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.modalCloseBtn}
                  onClick={() => setShowAddDeliveredModal(false)}
                >
                  &times;
                </button>
              </div>

              <form
                onSubmit={handleCreateDelivered}
                className={styles.modalForm}
              >
                <div className={styles.formField}>
                  <label>Project Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Satyam Apartment"
                    value={newDelivered.name}
                    onChange={(e) =>
                      setNewDelivered({ ...newDelivered, name: e.target.value })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>Location in Patna *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Boring Road, Patna"
                    value={newDelivered.location}
                    onChange={(e) =>
                      setNewDelivered({
                        ...newDelivered,
                        location: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>Select Project Image Preset</label>
                  <div className={styles.imagePresetPicker}>
                    {DELIVERED_PRESET_IMAGES.map((img) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={img.url}
                        src={img.url}
                        alt={img.name}
                        title={img.name}
                        className={`${styles.presetThumb} ${
                          newDelivered.image === img.url
                            ? styles.presetThumbSelected
                            : ""
                        }`}
                        onClick={() =>
                          setNewDelivered({ ...newDelivered, image: img.url })
                        }
                      />
                    ))}
                  </div>
                </div>

                <div className={styles.formField}>
                  <label>Or Custom Image URL</label>
                  <input
                    type="text"
                    placeholder="/img/delivered/satyam.webp or https://..."
                    value={newDelivered.image}
                    onChange={(e) =>
                      setNewDelivered({
                        ...newDelivered,
                        image: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>Project Description</label>
                  <textarea
                    rows={3}
                    placeholder="Brief architectural details, amenities and landmark highlights..."
                    value={newDelivered.description}
                    onChange={(e) =>
                      setNewDelivered({
                        ...newDelivered,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.btnCancel}
                    onClick={() => setShowAddDeliveredModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.btnSubmit}>
                    Publish Delivered Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD ONGOING PROJECT */}
        {showAddOngoingModal && (
          <div
            className={styles.modalBackdrop}
            onClick={() => setShowAddOngoingModal(false)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <div>
                  <h3 className={styles.modalTitle}>Add Ongoing Development</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background: "rgba(200, 164, 92, 0.15)",
                        border: "1px solid rgba(200, 164, 92, 0.35)",
                        color: "#deb360",
                        fontWeight: 600,
                      }}
                    >
                      Order Position: #{String(ongoingProjects.length + 1).padStart(2, "0")}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)" }}>
                      (First added remains #01 &bull; new project is appended sequentially)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.modalCloseBtn}
                  onClick={() => setShowAddOngoingModal(false)}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleCreateOngoing} className={styles.modalForm}>
                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label>Project Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Patliputra Royal Crest"
                      value={newOngoing.title}
                      onChange={(e) =>
                        setNewOngoing({ ...newOngoing, title: e.target.value })
                      }
                    />
                  </div>

                  <div className={styles.formField}>
                    <label>Configuration Type *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 3 & 4 BHK Luxury Apartments"
                      value={newOngoing.type}
                      onChange={(e) =>
                        setNewOngoing({ ...newOngoing, type: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label>Location *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bailey Road, Patna"
                      value={newOngoing.location}
                      onChange={(e) =>
                        setNewOngoing({
                          ...newOngoing,
                          location: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className={styles.formField}>
                    <label>Status Tag</label>
                    <select
                      value={newOngoing.tag}
                      onChange={(e) =>
                        setNewOngoing({ ...newOngoing, tag: e.target.value })
                      }
                    >
                      <option value="Under Construction">
                        Under Construction
                      </option>
                      <option value="Ready To Move In">Ready To Move In</option>
                      <option value="Ultra Luxury">Ultra Luxury</option>
                      <option value="Upcoming Launch">Upcoming Launch</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label>Carpet Area</label>
                    <input
                      type="text"
                      placeholder="e.g. 1,850 - 2,400 sq.ft."
                      value={newOngoing.area}
                      onChange={(e) =>
                        setNewOngoing({ ...newOngoing, area: e.target.value })
                      }
                    />
                  </div>

                  <div className={styles.formField}>
                    <label>Starting Price</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹88 Lakhs*"
                      value={newOngoing.price}
                      onChange={(e) =>
                        setNewOngoing({ ...newOngoing, price: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label>Bedrooms (BHK)</label>
                    <input
                      type="number"
                      min={1}
                      max={8}
                      value={newOngoing.bedrooms}
                      onChange={(e) =>
                        setNewOngoing({
                          ...newOngoing,
                          bedrooms: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className={styles.formField}>
                    <label>Bathrooms</label>
                    <input
                      type="number"
                      min={1}
                      max={8}
                      value={newOngoing.bathrooms}
                      onChange={(e) =>
                        setNewOngoing({
                          ...newOngoing,
                          bathrooms: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div className={styles.formField}>
                  <label>RERA Registration Number</label>
                  <input
                    type="text"
                    placeholder="e.g. BRERAP00189-2/2026"
                    value={newOngoing.rera}
                    onChange={(e) =>
                      setNewOngoing({ ...newOngoing, rera: e.target.value })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>Select Architectural Image Preset</label>
                  <div className={styles.imagePresetPicker}>
                    {ONGOING_PRESET_IMAGES.map((img) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={img.url}
                        src={img.url}
                        alt={img.name}
                        title={img.name}
                        className={`${styles.presetThumb} ${
                          newOngoing.image === img.url
                            ? styles.presetThumbSelected
                            : ""
                        }`}
                        onClick={() =>
                          setNewOngoing({ ...newOngoing, image: img.url })
                        }
                      />
                    ))}
                  </div>
                </div>

                <div className={styles.formField}>
                  <label>Or Custom Image URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={newOngoing.image}
                    onChange={(e) =>
                      setNewOngoing({ ...newOngoing, image: e.target.value })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>Key Features (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Italian Marble, Clubhouse Access, Olympic Gym, Solar Common Areas"
                    value={newOngoing.features}
                    onChange={(e) =>
                      setNewOngoing({ ...newOngoing, features: e.target.value })
                    }
                  />
                </div>

                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.btnCancel}
                    onClick={() => setShowAddOngoingModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.btnSubmit}>
                    Publish Ongoing Development
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT DELIVERED PROJECT */}
        {showEditDeliveredModal && editingDelivered && (
          <div
            className={styles.modalBackdrop}
            onClick={() => setShowEditDeliveredModal(false)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <div>
                  <h3 className={styles.modalTitle}>Edit Delivered Project</h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.75rem",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background: "rgba(200, 164, 92, 0.15)",
                        border: "1px solid rgba(200, 164, 92, 0.35)",
                        color: "#deb360",
                        fontWeight: 600,
                      }}
                    >
                      Project #{String(editingDelivered.order || 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      ID: {editingDelivered.id}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.modalCloseBtn}
                  onClick={() => setShowEditDeliveredModal(false)}
                >
                  &times;
                </button>
              </div>

              <form
                onSubmit={handleUpdateDelivered}
                className={styles.modalForm}
              >
                <div className={styles.formField}>
                  <label>Project Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Satyam Apartment"
                    value={editingDelivered.name}
                    onChange={(e) =>
                      setEditingDelivered({
                        ...editingDelivered,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>Location in Patna *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Boring Road, Patna"
                    value={editingDelivered.location}
                    onChange={(e) =>
                      setEditingDelivered({
                        ...editingDelivered,
                        location: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>Select Project Image Preset</label>
                  <div className={styles.imagePresetPicker}>
                    {DELIVERED_PRESET_IMAGES.map((img) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={img.url}
                        src={img.url}
                        alt={img.name}
                        title={img.name}
                        className={`${styles.presetThumb} ${
                          editingDelivered.image === img.url
                            ? styles.presetThumbSelected
                            : ""
                        }`}
                        onClick={() =>
                          setEditingDelivered({
                            ...editingDelivered,
                            image: img.url,
                          })
                        }
                      />
                    ))}
                  </div>
                </div>

                <div className={styles.formField}>
                  <label>Or Custom Image URL</label>
                  <input
                    type="text"
                    placeholder="/img/delivered/satyam.webp or https://..."
                    value={editingDelivered.image}
                    onChange={(e) =>
                      setEditingDelivered({
                        ...editingDelivered,
                        image: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>Project Description</label>
                  <textarea
                    rows={3}
                    placeholder="Brief architectural details, amenities and landmark highlights..."
                    value={editingDelivered.description}
                    onChange={(e) =>
                      setEditingDelivered({
                        ...editingDelivered,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.btnCancel}
                    onClick={() => setShowEditDeliveredModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.btnSubmit}>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT ONGOING PROJECT */}
        {showEditOngoingModal && editingOngoing && (
          <div
            className={styles.modalBackdrop}
            onClick={() => setShowEditOngoingModal(false)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <div>
                  <h3 className={styles.modalTitle}>Edit Ongoing Development</h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.75rem",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background: "rgba(200, 164, 92, 0.15)",
                        border: "1px solid rgba(200, 164, 92, 0.35)",
                        color: "#deb360",
                        fontWeight: 600,
                      }}
                    >
                      Project #{String(editingOngoing.order || 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      ID: {editingOngoing.id}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.modalCloseBtn}
                  onClick={() => setShowEditOngoingModal(false)}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleUpdateOngoing} className={styles.modalForm}>
                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label>Project Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Patliputra Royal Crest"
                      value={editingOngoing.title}
                      onChange={(e) =>
                        setEditingOngoing({
                          ...editingOngoing,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className={styles.formField}>
                    <label>Configuration Type *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 3 & 4 BHK Luxury Apartments"
                      value={editingOngoing.type}
                      onChange={(e) =>
                        setEditingOngoing({
                          ...editingOngoing,
                          type: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label>Location *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bailey Road, Patna"
                      value={editingOngoing.location}
                      onChange={(e) =>
                        setEditingOngoing({
                          ...editingOngoing,
                          location: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className={styles.formField}>
                    <label>Status Tag</label>
                    <select
                      value={editingOngoing.tag}
                      onChange={(e) =>
                        setEditingOngoing({
                          ...editingOngoing,
                          tag: e.target.value,
                        })
                      }
                    >
                      <option value="Under Construction">
                        Under Construction
                      </option>
                      <option value="Ready To Move In">Ready To Move In</option>
                      <option value="Ultra Luxury">Ultra Luxury</option>
                      <option value="Upcoming Launch">Upcoming Launch</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label>Carpet Area</label>
                    <input
                      type="text"
                      placeholder="e.g. 1,850 - 2,400 sq.ft."
                      value={editingOngoing.area}
                      onChange={(e) =>
                        setEditingOngoing({
                          ...editingOngoing,
                          area: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className={styles.formField}>
                    <label>Starting Price</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹88 Lakhs*"
                      value={editingOngoing.price}
                      onChange={(e) =>
                        setEditingOngoing({
                          ...editingOngoing,
                          price: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label>Bedrooms (BHK)</label>
                    <input
                      type="number"
                      min={1}
                      max={8}
                      value={editingOngoing.bedrooms}
                      onChange={(e) =>
                        setEditingOngoing({
                          ...editingOngoing,
                          bedrooms: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className={styles.formField}>
                    <label>Bathrooms</label>
                    <input
                      type="number"
                      min={1}
                      max={8}
                      value={editingOngoing.bathrooms}
                      onChange={(e) =>
                        setEditingOngoing({
                          ...editingOngoing,
                          bathrooms: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div className={styles.formField}>
                  <label>RERA Registration Number</label>
                  <input
                    type="text"
                    placeholder="e.g. BRERAP00350-1/2026"
                    value={editingOngoing.rera}
                    onChange={(e) =>
                      setEditingOngoing({
                        ...editingOngoing,
                        rera: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>Select Project Image Preset</label>
                  <div className={styles.imagePresetPicker}>
                    {ONGOING_PRESET_IMAGES.map((img) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={img.url}
                        src={img.url}
                        alt={img.name}
                        title={img.name}
                        className={`${styles.presetThumb} ${
                          editingOngoing.image === img.url
                            ? styles.presetThumbSelected
                            : ""
                        }`}
                        onClick={() =>
                          setEditingOngoing({
                            ...editingOngoing,
                            image: img.url,
                          })
                        }
                      />
                    ))}
                  </div>
                </div>

                <div className={styles.formField}>
                  <label>Or Custom Image URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={editingOngoing.image}
                    onChange={(e) =>
                      setEditingOngoing({
                        ...editingOngoing,
                        image: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>Key Features (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Italian Marble, Clubhouse Access, Olympic Gym, Solar Common Areas"
                    value={editingOngoingFeaturesStr}
                    onChange={(e) =>
                      setEditingOngoingFeaturesStr(e.target.value)
                    }
                  />
                </div>

                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.btnCancel}
                    onClick={() => setShowEditOngoingModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.btnSubmit}>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for Forgot Key */}
        {showForgotModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100,
              padding: "1rem",
            }}
            onClick={() => setShowForgotModal(false)}
          >
            <div
              style={{
                background: "#141525",
                border: "1px solid rgba(200, 164, 92, 0.4)",
                borderRadius: "16px",
                padding: "2rem",
                maxWidth: "420px",
                textAlign: "center",
                boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(200, 164, 92, 0.15)",
                  color: "#deb360",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                }}
              >
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
              <h3
                style={{
                  color: "#fff",
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.25rem",
                  marginBottom: "0.5rem",
                }}
              >
                Key Recovery Protocol
              </h3>
              <p
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "0.85rem",
                  lineHeight: "1.6",
                  marginBottom: "1.5rem",
                }}
              >
                Security keys are cryptographically issued to Patliputra Group
                directors and designated IT managers. For key revocation or
                emergency reset, contact the SuperAdmin Desk at{" "}
                <strong style={{ color: "#deb360" }}>
                  security@patliputragroup.com
                </strong>
                .
              </p>
              <button
                type="button"
                className={styles.submitBtn}
                style={{ padding: "0.65rem 1.5rem", fontSize: "0.8rem" }}
                onClick={() => setShowForgotModal(false)}
              >
                Understood &bull; Close
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Toast Feedback */}
        {toastMessage && (
          <div className={styles.toastNotice} role="status">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#deb360"
              strokeWidth="2.5"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>{toastMessage}</span>
          </div>
        )}
      </main>

      {/* Footer Compliance Notice */}
      <footer className={styles.footerArea}>
        <p>
          <strong>PATLIPUTRA GROUP IT INFRASTRUCTURE</strong> &bull; Version
          2.5.0 (Executive Suite)
        </p>
        <p>
          Authorized administrators may add, update, and remove Delivered &amp;
          Ongoing developments. All session actions and data mutations are
          logged.
        </p>
      </footer>
    </div>
  );
}
