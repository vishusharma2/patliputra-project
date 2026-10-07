"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import styles from "./Properties.module.css";
import initialData from "@/data/projectsData.json";

export interface Property {
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

const filters = ["All Projects", "Ready To Move", "Under Construction", "Ultra Luxury"];

const ONGOING_PRESET_IMAGES = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
  "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
];

export default function Properties() {
  const [propertiesList, setPropertiesList] = useState<Property[]>(
    initialData.ongoing || []
  );
  const [activeFilter, setActiveFilter] = useState("All Projects");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // New ongoing form state
  const [newOngoing, setNewOngoing] = useState({
    title: "",
    type: "3 & 4 BHK",
    location: "Bailey Road, Patna",
    area: "1,800 - 2,400 sq.ft.",
    price: "₹85 Lakhs*",
    bedrooms: 3,
    bathrooms: 3,
    image: ONGOING_PRESET_IMAGES[0],
    tag: "Under Construction",
    rera: "BRERAP00350-1/2026",
    features: "Clubhouse Access, 24/7 Security, Power Backup, High Speed Lifts",
  });

  // Edit ongoing property state
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFeaturesStr, setEditingFeaturesStr] = useState("");

  useEffect(() => {
    // Check if admin is currently authenticated
    try {
      const session = localStorage.getItem("patliputra_admin_session");
      if (session === "active") {
        setIsAdmin(true);
      }
    } catch {
      // ignore
    }

    fetch("/api/admin/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.ongoing)) {
          setPropertiesList(data.ongoing);
        }
      })
      .catch((err) => {
        console.error("Could not fetch ongoing properties:", err);
      });
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    try {
      const res = await fetch(`/api/admin/projects?category=ongoing&id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPropertiesList(data.data.ongoing);
        setToast(`✓ Removed "${title}"`);
      } else {
        alert(data.error || "Failed to remove project");
      }
    } catch (err) {
      console.error("Error removing ongoing project:", err);
      alert("Error removing project");
    }
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!newOngoing.title.trim()) return;

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
            order: propertiesList.length + 1,
            title: newOngoing.title.trim(),
            type: newOngoing.type.trim() || "3 & 4 BHK",
            location: newOngoing.location.trim() || "Bailey Road, Patna",
            area: newOngoing.area.trim() || "1,800 - 2,500 sq.ft.",
            price: newOngoing.price.trim() || "Price on Request",
            bedrooms: Number(newOngoing.bedrooms) || 3,
            bathrooms: Number(newOngoing.bathrooms) || 3,
            image: newOngoing.image || ONGOING_PRESET_IMAGES[0],
            tag: newOngoing.tag || "Under Construction",
            rera: newOngoing.rera.trim() || "BRERAP00-PENDING",
            features: featureList.length > 0 ? featureList : ["Clubhouse Access", "24/7 Security", "Power Backup"],
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPropertiesList(data.data.ongoing);
        setShowAddModal(false);
        setNewOngoing({
          title: "",
          type: "3 & 4 BHK",
          location: "Bailey Road, Patna",
          area: "1,800 - 2,400 sq.ft.",
          price: "₹85 Lakhs*",
          bedrooms: 3,
          bathrooms: 3,
          image: ONGOING_PRESET_IMAGES[0],
          tag: "Under Construction",
          rera: "BRERAP00350-1/2026",
          features: "Clubhouse Access, 24/7 Security, Power Backup, High Speed Lifts",
        });
        setToast(`✓ Added "${newOngoing.title}" to Ongoing Developments`);
      } else {
        alert(data.error || "Failed to add project");
      }
    } catch (err) {
      console.error("Error creating ongoing project:", err);
      alert("Error adding project");
    }
  };

  const handleOpenEdit = (property: Property) => {
    setEditingProperty({ ...property });
    setEditingFeaturesStr(
      Array.isArray(property.features) ? property.features.join(", ") : ""
    );
    setShowEditModal(true);
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingProperty || !editingProperty.id || !editingProperty.title.trim()) return;

    const featureList = editingFeaturesStr
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
            ...editingProperty,
            title: editingProperty.title.trim(),
            type: editingProperty.type.trim() || "3 & 4 BHK",
            location: editingProperty.location.trim() || "Bailey Road, Patna",
            area: editingProperty.area.trim() || "1,800 - 2,500 sq.ft.",
            price: editingProperty.price.trim() || "Price on Request",
            bedrooms: Number(editingProperty.bedrooms) || 3,
            bathrooms: Number(editingProperty.bathrooms) || 3,
            image: editingProperty.image || ONGOING_PRESET_IMAGES[0],
            tag: editingProperty.tag || "Under Construction",
            rera: editingProperty.rera.trim() || "BRERAP00-PENDING",
            features: featureList.length > 0 ? featureList : editingProperty.features,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPropertiesList(data.data.ongoing);
        setShowEditModal(false);
        setEditingProperty(null);
        setToast(`✓ Updated "${editingProperty.title}" successfully`);
      } else {
        alert(data.error || "Failed to update ongoing project");
      }
    } catch (err) {
      console.error("Error updating ongoing project:", err);
      alert("Error updating project");
    }
  };

  const filtered = propertiesList.filter((p) => {
    if (activeFilter === "All Projects") return true;
    if (activeFilter === "Ready To Move") return p.tag === "Ready To Move In";
    if (activeFilter === "Under Construction") return p.tag === "Under Construction";
    if (activeFilter === "Ultra Luxury") return p.tag === "Ultra Luxury";
    return true;
  });

  return (
    <section id="properties" className={styles.properties} aria-label="Our Ongoing and Upcoming Projects">
      <div className="container">
        {/* Admin Bar if authenticated */}
        {isAdmin && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
              background: "#121320",
              border: "1px solid rgba(200, 164, 92, 0.45)",
              borderRadius: "12px",
              padding: "0.85rem 1.5rem",
              marginBottom: "2.5rem",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#2ecc71",
                  boxShadow: "0 0 8px #2ecc71",
                }}
              />
              <span style={{ fontSize: "0.88rem", color: "#ffffff" }}>
                <strong style={{ color: "#deb360" }}>Admin Session Active:</strong> You can add or remove ongoing developments.
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                style={{
                  background: "linear-gradient(135deg, #deb360, #c8a45c)",
                  color: "#0f0f1a",
                  border: "none",
                  padding: "0.45rem 1rem",
                  borderRadius: "6px",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                + Add Ongoing Project
              </button>
              <Link
                href="/patliputra-login"
                style={{
                  color: "#deb360",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  textDecoration: "underline",
                }}
              >
                Management Console →
              </Link>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div
            style={{
              position: "fixed",
              bottom: "2rem",
              right: "2rem",
              background: "#141525",
              color: "#deb360",
              border: "1px solid #deb360",
              padding: "0.85rem 1.35rem",
              borderRadius: "8px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              zIndex: 9999,
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            {toast}
          </div>
        )}

        <div className={styles.header}>
          <div>
            <span className="section-label">Prime Developments</span>
            <h2 className={styles.sectionTitle}>
              OUR ONGOING &amp; <span className={styles.goldText}>UPCOMING PROJECTS</span>
            </h2>
            <p className="section-subtitle">
              Carefully engineered landmarks situated across Patna&apos;s most lucrative arterial corridors, built to international standards.
            </p>
          </div>

          <div className={styles.filters} role="tablist" aria-label="Filter properties">
            {filters.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={activeFilter === f}
                className={`${styles.filterBtn} ${
                  activeFilter === f ? styles.filterActive : ""
                }`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          {filtered.map((property) => (
            <article key={property.id} className={styles.card} id={`property-${property.id}`}>
              <div className={styles.cardImage}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={property.image}
                  alt={`${property.title} - ${property.type} luxury project in ${property.location}`}
                  loading="lazy"
                  width={600}
                  height={400}
                />
                <span className={styles.cardTag}>
                  {property.order ? `#${String(property.order).padStart(2, "0")} • ` : ""}{property.tag || "Ongoing"}
                </span>
                <div className={styles.cardOverlay}>
                  <a href="#contact" className="btn btn--primary btn--sm">
                    Book Site Inspection
                  </a>
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.typeRow}>
                  <span className={styles.cardType}>{property.type}</span>
                  <span className={styles.reraNumber}>{property.rera}</span>
                </div>

                <h3 className={styles.cardTitle}>{property.title}</h3>

                <p className={styles.cardLocation}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {property.location}
                </p>

                <div className={styles.cardMeta}>
                  <div className={styles.metaItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
                    {property.area}
                  </div>
                  <div className={styles.metaItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" /><path d="M21 7H3l2-4h14l2 4z" /></svg>
                    {property.bedrooms} BHK
                  </div>
                  <div className={styles.metaItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12h16a1 1 0 0 1 1 1v3H3v-3a1 1 0 0 1 1-1zM6 12V5a2 2 0 0 1 2-2h3v2.25" /><path d="M3 16v4M21 16v4" /></svg>
                    {property.bathrooms} Baths
                  </div>
                </div>

                <ul className={styles.cardFeatures}>
                  {property.features.map((feat) => (
                    <li key={feat}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      {feat}
                    </li>
                  ))}
                </ul>

                <div className={styles.cardFooter}>
                  <div className={styles.price}>
                    <span className={styles.priceLabel}>Starting from</span>
                    <span className={styles.priceValue}>{property.price}</span>
                  </div>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <Link
                        href="/contact"
                        className="btn btn--dark btn--sm"
                        aria-label={`Enquire about ${property.title}`}
                      >
                        Get Quote
                      </Link>
                      {isAdmin && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(property)}
                            style={{
                              background: "rgba(200, 164, 92, 0.12)",
                              border: "1px solid rgba(200, 164, 92, 0.45)",
                              color: "#deb360",
                              padding: "0.45rem 0.65rem",
                              borderRadius: "4px",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3px",
                            }}
                            title="Edit Project Details"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Edit
                          </button>

                          {confirmDeleteId === property.id ? (
                            <div style={{ display: "flex", gap: "4px" }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setConfirmDeleteId(null);
                                  handleDelete(property.id, property.title);
                                }}
                                style={{
                                  background: "#e74c3c",
                                  border: "none",
                                  color: "#ffffff",
                                  padding: "0.35rem 0.55rem",
                                  borderRadius: "4px",
                                  fontSize: "0.72rem",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                }}
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                style={{
                                  background: "rgba(255,255,255,0.2)",
                                  border: "none",
                                  color: "#ffffff",
                                  padding: "0.35rem 0.45rem",
                                  borderRadius: "4px",
                                  fontSize: "0.72rem",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(property.id)}
                              style={{
                                background: "rgba(231, 76, 60, 0.12)",
                                border: "1px solid rgba(231, 76, 60, 0.4)",
                                color: "#ff8e8e",
                                padding: "0.45rem 0.65rem",
                                borderRadius: "4px",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "3px",
                              }}
                              title="Remove as Administrator"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                              Remove
                            </button>
                          )}
                        </>
                      )}
                    </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Modal for adding ongoing project directly */}
        {showAddModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              backdropFilter: "blur(8px)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
            onClick={() => setShowAddModal(false)}
          >
            <div
              style={{
                background: "#141525",
                border: "1px solid rgba(200, 164, 92, 0.4)",
                borderRadius: "16px",
                width: "100%",
                maxWidth: "560px",
                maxHeight: "90vh",
                overflowY: "auto",
                padding: "2rem",
                color: "#ffffff",
                boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.25rem",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  paddingBottom: "0.75rem",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.25rem",
                      color: "#deb360",
                      margin: 0,
                    }}
                  >
                    Add Ongoing Development
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background: "rgba(200, 164, 92, 0.15)",
                        border: "1px solid rgba(200, 164, 92, 0.35)",
                        color: "#deb360",
                        fontWeight: 600,
                      }}
                    >
                      Order Position: #{String(propertiesList.length + 1).padStart(2, "0")}
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)" }}>
                      (First added remains #01)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                  }}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "4px" }}>
                      PROJECT TITLE *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Patliputra Royal Crest"
                      value={newOngoing.title}
                      onChange={(e) => setNewOngoing({ ...newOngoing, title: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        background: "#0c0d16",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "6px",
                        color: "#fff",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "4px" }}>
                      CONFIGURATION *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 3 & 4 BHK"
                      value={newOngoing.type}
                      onChange={(e) => setNewOngoing({ ...newOngoing, type: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        background: "#0c0d16",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "6px",
                        color: "#fff",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "4px" }}>
                      LOCATION *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bailey Road, Patna"
                      value={newOngoing.location}
                      onChange={(e) => setNewOngoing({ ...newOngoing, location: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        background: "#0c0d16",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "6px",
                        color: "#fff",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "4px" }}>
                      STATUS TAG
                    </label>
                    <select
                      value={newOngoing.tag}
                      onChange={(e) => setNewOngoing({ ...newOngoing, tag: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        background: "#0c0d16",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "6px",
                        color: "#fff",
                      }}
                    >
                      <option value="Under Construction">Under Construction</option>
                      <option value="Ready To Move In">Ready To Move In</option>
                      <option value="Ultra Luxury">Ultra Luxury</option>
                      <option value="Upcoming Launch">Upcoming Launch</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "4px" }}>
                      AREA
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1,800 - 2,500 sq.ft."
                      value={newOngoing.area}
                      onChange={(e) => setNewOngoing({ ...newOngoing, area: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        background: "#0c0d16",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "6px",
                        color: "#fff",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "4px" }}>
                      PRICE
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹85 Lakhs*"
                      value={newOngoing.price}
                      onChange={(e) => setNewOngoing({ ...newOngoing, price: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        background: "#0c0d16",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "6px",
                        color: "#fff",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "4px" }}>
                    RERA NUMBER
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BRERAP00350-1/2026"
                    value={newOngoing.rera}
                    onChange={(e) => setNewOngoing({ ...newOngoing, rera: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      background: "#0c0d16",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "6px",
                      color: "#fff",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "4px" }}>
                    FEATURES (COMMA-SEPARATED)
                  </label>
                  <input
                    type="text"
                    placeholder="Clubhouse, Security, Gym, Power Backup"
                    value={newOngoing.features}
                    onChange={(e) => setNewOngoing({ ...newOngoing, features: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      background: "#0c0d16",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "6px",
                      color: "#fff",
                    }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "none",
                      color: "#fff",
                      padding: "0.6rem 1.2rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      background: "linear-gradient(135deg, #deb360, #c8a45c)",
                      color: "#0f0f1a",
                      border: "none",
                      padding: "0.6rem 1.4rem",
                      borderRadius: "6px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Publish Development
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for Editing Ongoing Development */}
        {showEditModal && editingProperty && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              backdropFilter: "blur(8px)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
            onClick={() => setShowEditModal(false)}
          >
            <div
              style={{
                background: "#141525",
                border: "1px solid rgba(200, 164, 92, 0.4)",
                borderRadius: "16px",
                width: "100%",
                maxWidth: "560px",
                maxHeight: "90vh",
                overflowY: "auto",
                padding: "2rem",
                color: "#ffffff",
                boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.25rem",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  paddingBottom: "0.75rem",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.25rem",
                      color: "#deb360",
                      margin: 0,
                    }}
                  >
                    Edit Ongoing Development
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background: "rgba(200, 164, 92, 0.15)",
                        border: "1px solid rgba(200, 164, 92, 0.35)",
                        color: "#deb360",
                        fontWeight: 600,
                      }}
                    >
                      Project #{String(editingProperty.order || 1).padStart(2, "0")}
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)" }}>
                      ID: {editingProperty.id}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                  }}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "4px" }}>
                      PROJECT TITLE *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Patliputra Royal Crest"
                      value={editingProperty.title}
                      onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        background: "#0c0d16",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "6px",
                        color: "#fff",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "4px" }}>
                      TYPE / CONFIGURATION *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 3 & 4 BHK"
                      value={editingProperty.type}
                      onChange={(e) => setEditingProperty({ ...editingProperty, type: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        background: "#0c0d16",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "6px",
                        color: "#fff",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "4px" }}>
                      LOCATION *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bailey Road, Patna"
                      value={editingProperty.location}
                      onChange={(e) => setEditingProperty({ ...editingProperty, location: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        background: "#0c0d16",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "6px",
                        color: "#fff",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "4px" }}>
                      STATUS TAG
                    </label>
                    <select
                      value={editingProperty.tag || "Under Construction"}
                      onChange={(e) => setEditingProperty({ ...editingProperty, tag: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        background: "#0c0d16",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "6px",
                        color: "#fff",
                      }}
                    >
                      <option value="Under Construction">Under Construction</option>
                      <option value="Ready To Move In">Ready To Move In</option>
                      <option value="Ultra Luxury">Ultra Luxury</option>
                      <option value="Upcoming Launch">Upcoming Launch</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "4px" }}>
                      CARPET AREA
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1,800 - 2,400 sq.ft."
                      value={editingProperty.area}
                      onChange={(e) => setEditingProperty({ ...editingProperty, area: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        background: "#0c0d16",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "6px",
                        color: "#fff",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "4px" }}>
                      PRICE / STARTING
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹85 Lakhs*"
                      value={editingProperty.price}
                      onChange={(e) => setEditingProperty({ ...editingProperty, price: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        background: "#0c0d16",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "6px",
                        color: "#fff",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "4px" }}>
                      BEDROOMS (BHK)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={8}
                      value={editingProperty.bedrooms}
                      onChange={(e) => setEditingProperty({ ...editingProperty, bedrooms: Number(e.target.value) })}
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        background: "#0c0d16",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "6px",
                        color: "#fff",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "4px" }}>
                      BATHROOMS
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={8}
                      value={editingProperty.bathrooms}
                      onChange={(e) => setEditingProperty({ ...editingProperty, bathrooms: Number(e.target.value) })}
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        background: "#0c0d16",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "6px",
                        color: "#fff",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "4px" }}>
                    RERA NUMBER
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BRERAP00350-1/2026"
                    value={editingProperty.rera}
                    onChange={(e) => setEditingProperty({ ...editingProperty, rera: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      background: "#0c0d16",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "6px",
                      color: "#fff",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "4px" }}>
                    CUSTOM IMAGE URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={editingProperty.image}
                    onChange={(e) => setEditingProperty({ ...editingProperty, image: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      background: "#0c0d16",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "6px",
                      color: "#fff",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "4px" }}>
                    FEATURES (COMMA-SEPARATED)
                  </label>
                  <input
                    type="text"
                    placeholder="Clubhouse, Security, Gym, Power Backup"
                    value={editingFeaturesStr}
                    onChange={(e) => setEditingFeaturesStr(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      background: "#0c0d16",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "6px",
                      color: "#fff",
                    }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "none",
                      color: "#fff",
                      padding: "0.6rem 1.2rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      background: "linear-gradient(135deg, #deb360, #c8a45c)",
                      color: "#0f0f1a",
                      border: "none",
                      padding: "0.6rem 1.4rem",
                      borderRadius: "6px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
