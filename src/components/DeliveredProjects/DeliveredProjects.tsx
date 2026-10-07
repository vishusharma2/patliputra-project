"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import styles from "./DeliveredProjects.module.css";
import initialData from "@/data/projectsData.json";

export interface DeliveredProject {
  id?: string;
  name: string;
  location: string;
  image: string;
  description: string;
}

const PRESET_DELIVERED_IMAGES = [
  "/img/delivered/satyam.webp",
  "/img/delivered/viswamohini.webp",
  "/img/delivered/lalita.webp",
  "/img/delivered/maharaja.webp",
  "/img/delivered/nirvana.webp",
  "/img/delivered/exotica.webp",
  "/img/delivered/patligram.webp",
  "/img/delivered/alina.webp",
];

export default function DeliveredProjects() {
  const [projects, setProjects] = useState<DeliveredProject[]>(
    initialData.delivered || []
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Form state
  const [newProject, setNewProject] = useState({
    name: "",
    location: "Patna",
    image: "/img/delivered/satyam.webp",
    description: "",
  });

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

    // Fetch dynamic project data
    fetch("/api/admin/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.delivered)) {
          setProjects(data.delivered);
        }
      })
      .catch((err) => {
        console.error("Could not fetch delivered projects:", err);
      });
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = async (id?: string, name?: string) => {
    if (!id) return;

    try {
      const res = await fetch(`/api/admin/projects?category=delivered&id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProjects(data.data.delivered);
        setToast(`✓ Removed "${name || id}"`);
      } else {
        alert(data.error || "Failed to remove project");
      }
    } catch (err) {
      console.error("Error removing project:", err);
      alert("Error removing project");
    }
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "delivered",
          project: {
            id: `delivered-${Date.now()}`,
            name: newProject.name.trim(),
            location: newProject.location.trim() || "Patna",
            image: newProject.image || "/img/delivered/satyam.webp",
            description:
              newProject.description.trim() ||
              "Prestigious landmark delivered with highest structural integrity and premium finishes by Patliputra Group.",
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setProjects(data.data.delivered);
        setShowAddModal(false);
        setNewProject({
          name: "",
          location: "Patna",
          image: "/img/delivered/satyam.webp",
          description: "",
        });
        setToast(`✓ Added "${newProject.name}" to Delivered Projects`);
      } else {
        alert(data.error || "Failed to add project");
      }
    } catch (err) {
      console.error("Error creating delivered project:", err);
      alert("Error adding project");
    }
  };

  return (
    <section
      id="delivered-projects"
      className={styles.section}
      aria-labelledby="delivered-title"
    >
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
                <strong style={{ color: "#deb360" }}>Admin Session Active:</strong> You can add or remove delivered projects.
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
                + Add Delivered Project
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

        <header className={styles.header}>
          <span className="section-label">Since 1989</span>
          <h2 id="delivered-title" className={styles.title}>
            Our Legacy of <span className={styles.gold}>Delivered</span> Projects
          </h2>
          <div className={styles.ornament} aria-hidden="true">
            <span />
            <i />
            <span />
          </div>
        </header>

        <div className={styles.grid}>
          {projects.map((p, i) => (
            <article
              key={p.id || `${p.name}-${i}`}
              className={styles.card}
              style={{ animationDelay: `${i * 0.08}s` }}
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

                {/* Admin Delete Action */}
                {isAdmin && (
                  <div
                    style={{
                      marginTop: "1rem",
                      paddingTop: "0.75rem",
                      borderTop: "1px dashed rgba(26,26,46,0.15)",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    {confirmDeleteId === p.id ? (
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmDeleteId(null);
                            handleDelete(p.id, p.name);
                          }}
                          style={{
                            background: "#e74c3c",
                            border: "none",
                            color: "#ffffff",
                            padding: "0.35rem 0.65rem",
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
                            background: "#e0e0e0",
                            border: "none",
                            color: "#333",
                            padding: "0.35rem 0.55rem",
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
                        onClick={() => setConfirmDeleteId(p.id || null)}
                        style={{
                          background: "rgba(231, 76, 60, 0.1)",
                          border: "1px solid rgba(231, 76, 60, 0.4)",
                          color: "#c0392b",
                          padding: "0.35rem 0.75rem",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        Remove (Admin)
                      </button>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Modal for adding delivered project directly */}
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
                maxWidth: "520px",
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
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.25rem",
                    color: "#deb360",
                    margin: 0,
                  }}
                >
                  Add Delivered Project
                </h3>
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
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "4px" }}>
                    PROJECT NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Satyam Apartment"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
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
                    LOCATION *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Boring Road, Patna"
                    value={newProject.location}
                    onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
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
                    IMAGE PRESET
                  </label>
                  <div style={{ display: "flex", gap: "6px", overflowX: "auto", padding: "4px 0" }}>
                    {PRESET_DELIVERED_IMAGES.map((img) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={img}
                        src={img}
                        alt="preset"
                        onClick={() => setNewProject({ ...newProject, image: img })}
                        style={{
                          width: "56px",
                          height: "38px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          cursor: "pointer",
                          border: newProject.image === img ? "2px solid #deb360" : "2px solid transparent",
                          opacity: newProject.image === img ? 1 : 0.65,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "4px" }}>
                    DESCRIPTION
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Key architectural highlights and amenities..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      background: "#0c0d16",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "6px",
                      color: "#fff",
                      fontFamily: "inherit",
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
                    Publish Project
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
