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
  bedrooms?: number;
  bathrooms?: number;
  image: string;
  tag?: string;
  rera?: string;
  description?: string;
  sqft?: string;
  about?: string;
  address?: string;
  amenities?: string[];
  features: string[];
}

const DEFAULT_AMENITIES = [
  "MEDITATION GARDEN",
  "24/7 SECURITY",
  "CCTV SURVEILLANCE",
  "AMPLE PARKING SPACE",
  "FULLY AUTOMATIC LIFTS",
  "OPEN GYM",
  "LANDSCAPE GARDEN",
  "24X7 POWER BACKUP",
  "YOGA DESK",
  "SWIMMING POOL",
];

const DEFAULT_ADDRESS =
  "Signature Park, Plot No. INS - 02, Sector - CHI V, Greater Noida, Gautam Buddha Nagar (Uttar Pradesh) 201310";

const DEFAULT_ABOUT =
  "An integrated luxury hub spread over 10 acres, Patliputra Signature Park is located in the heart of Greater Noida just two minutes away from the Pari Chowk and Knowledge Park Metro Station. It is known as THE COMMERCIAL DESTINATION OF GREATER NOIDA. Designed by India's leading Architect, Signature Park offers one of its kind classic architecture of Premium Retail Area, Hyper-Market, Anchor Stores, Branded Stores, Entertainment Zone, Gaming Zone, Food Court, Restaurants, Ultra-Luxurious Serviced Residences, Fully Furnished Studio Apartments, & Office Spaces.";

const filters = [
  "All Projects",
  "Ready To Move",
  "Under Construction",
  "Ultra Luxury",
];

const ONGOING_PRESET_IMAGES = [
  "/img/signature_park.jpg",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
  "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
];

export default function Properties() {
  const [propertiesList, setPropertiesList] = useState<Property[]>(
    initialData.ongoing || [],
  );
  const [activeFilter, setActiveFilter] = useState("All Projects");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // View Details Modal state
  const [detailProperty, setDetailProperty] = useState<Property | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // New ongoing form state
  const [newOngoing, setNewOngoing] = useState<{
    title: string;
    type: string;
    location: string;
    area: string;
    price: string;
    bedrooms?: number | string;
    bathrooms?: number | string;
    image: string;
    tag: string;
    rera?: string;
    sqft?: string;
    about?: string;
    address?: string;
    amenities?: string;
    features: string;
  }>({
    title: "",
    type: "1BHK, 2BHK, Retails, Office Spaces & Luxury Studio Apartments",
    location: "Greater Noida",
    area: "10 Acres",
    price: "Starts @ 40 Lakh*",
    bedrooms: "",
    bathrooms: "",
    image: ONGOING_PRESET_IMAGES[0],
    tag: "Under Construction",
    sqft: "An integrated luxury hub spread over 10 acres sqft",
    about: DEFAULT_ABOUT,
    address: DEFAULT_ADDRESS,
    amenities: DEFAULT_AMENITIES.join(", "),
    features:
      "Have 1BHK, 2BHK, Retails, Office Spaces and Luxury Studio Apartments., * East-Facing Flats, An integrated luxury hub spread over 10 acres",
  });

  // Edit ongoing property state
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFeaturesStr, setEditingFeaturesStr] = useState("");
  const [editingAmenitiesStr, setEditingAmenitiesStr] = useState("");

  const handleOpenDetail = (prop: Property) => {
    setDetailProperty(prop);
    setShowDetailModal(true);
  };

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
      const res = await fetch(
        `/api/admin/projects?category=ongoing&id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        },
      );
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

    const amenityList = newOngoing.amenities
      ? newOngoing.amenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean)
      : undefined;

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
            bedrooms:
              newOngoing.bedrooms && Number(newOngoing.bedrooms) > 0
                ? Number(newOngoing.bedrooms)
                : undefined,
            bathrooms:
              newOngoing.bathrooms && Number(newOngoing.bathrooms) > 0
                ? Number(newOngoing.bathrooms)
                : undefined,
            image: newOngoing.image || ONGOING_PRESET_IMAGES[0],
            tag: newOngoing.tag || "Under Construction",
            sqft: newOngoing.sqft?.trim() || undefined,
            about: newOngoing.about?.trim() || undefined,
            address: newOngoing.address?.trim() || undefined,
            amenities: amenityList && amenityList.length > 0 ? amenityList : undefined,
            features:
              featureList.length > 0
                ? featureList
                : ["Clubhouse Access", "24/7 Security", "Power Backup"],
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPropertiesList(data.data.ongoing);
        setShowAddModal(false);
        setNewOngoing({
          title: "",
          type: "1BHK, 2BHK, Retails, Office Spaces & Luxury Studio Apartments",
          location: "Greater Noida",
          area: "10 Acres",
          price: "Starts @ 40 Lakh*",
          bedrooms: "",
          bathrooms: "",
          image: ONGOING_PRESET_IMAGES[0],
          tag: "Under Construction",
          sqft: "An integrated luxury hub spread over 10 acres sqft",
          about: DEFAULT_ABOUT,
          address: DEFAULT_ADDRESS,
          amenities: DEFAULT_AMENITIES.join(", "),
          features:
            "Have 1BHK, 2BHK, Retails, Office Spaces and Luxury Studio Apartments., * East-Facing Flats, An integrated luxury hub spread over 10 acres",
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
      Array.isArray(property.features) ? property.features.join(", ") : "",
    );
    setEditingAmenitiesStr(
      Array.isArray(property.amenities)
        ? property.amenities.join(", ")
        : property.amenities || "",
    );
    setShowEditModal(true);
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (
      !editingProperty ||
      !editingProperty.id ||
      !editingProperty.title.trim()
    )
      return;

    const featureList = editingFeaturesStr
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    const amenityList = editingAmenitiesStr
      .split(",")
      .map((a) => a.trim())
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
            bedrooms:
              editingProperty.bedrooms && Number(editingProperty.bedrooms) > 0
                ? Number(editingProperty.bedrooms)
                : undefined,
            bathrooms:
              editingProperty.bathrooms && Number(editingProperty.bathrooms) > 0
                ? Number(editingProperty.bathrooms)
                : undefined,
            image: editingProperty.image || ONGOING_PRESET_IMAGES[0],
            tag: editingProperty.tag || "Under Construction",
            sqft: editingProperty.sqft?.trim() || undefined,
            about: editingProperty.about?.trim() || undefined,
            address: editingProperty.address?.trim() || undefined,
            amenities: amenityList.length > 0 ? amenityList : undefined,
            features:
              featureList.length > 0 ? featureList : editingProperty.features,
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
    if (activeFilter === "Under Construction")
      return p.tag === "Under Construction";
    if (activeFilter === "Ultra Luxury") return p.tag === "Ultra Luxury";
    return true;
  });

  return (
    <section
      id="properties"
      className={styles.properties}
      aria-label="Our Ongoing and Upcoming Projects"
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
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
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
                <strong style={{ color: "#deb360" }}>
                  Admin Session Active:
                </strong>{" "}
                You can add or remove ongoing developments.
              </span>
            </div>

            <div
              style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}
            >
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

        <header className={styles.sectionHeader}>
          <h2 className={styles.titleMain}>ONGOING PROJECT</h2>
          <span className={styles.accentBar} aria-hidden="true" />
          <p className={styles.subtitleMain}>
            Your Next Big Opportunity for Enduring Growth, Lasting Prestige, and Assured Returns
          </p>

          {propertiesList.length > 1 && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
              <div
                className={styles.filters}
                role="tablist"
                aria-label="Filter properties"
              >
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
          )}
        </header>

        {filtered.length === 1 ? (
          <div className={styles.singleProjectWrapper}>
            {filtered.map((property) => {
              const hubText =
                property.features?.find(
                  (f) =>
                    f.toLowerCase().includes("integrated") ||
                    f.toLowerCase().includes("spread") ||
                    f.toLowerCase().includes("acre")
                ) ||
                (property.area
                  ? `An integrated luxury hub spread over ${property.area}`
                  : "An integrated luxury hub spread over 10 acres");

              const priceText = property.price?.toLowerCase().startsWith("starts")
                ? property.price
                : `Starts @ ${property.price || "40 Lakh*"}`;

              const configText = (() => {
                const directMatch = property.features?.find(
                  (f) =>
                    (f.toLowerCase().includes("1bhk") || f.toLowerCase().includes("have")) &&
                    f.toLowerCase().includes("retails") &&
                    f.toLowerCase().includes("studio")
                );
                if (directMatch) {
                  return directMatch.startsWith("Have") ? directMatch : `Have ${directMatch}`;
                }

                const configParts = property.features?.filter(
                  (f) =>
                    !f.toLowerCase().includes("integrated") &&
                    !f.toLowerCase().includes("spread") &&
                    !f.toLowerCase().includes("acre") &&
                    !f.toLowerCase().includes("starts") &&
                    !f.toLowerCase().includes("lakh") &&
                    !f.toLowerCase().includes("facing")
                ) || [];

                if (configParts.length > 0) {
                  let joined = configParts.join(", ");
                  if (!joined.toLowerCase().startsWith("have")) {
                    joined = `Have ${joined}`;
                  }
                  if (!joined.endsWith(".")) {
                    joined = `${joined}.`;
                  }
                  return joined.replace(/,\s*,/g, ", ").replace(/\.\./g, ".");
                }

                if (property.type) {
                  return property.type.toLowerCase().startsWith("have")
                    ? property.type
                    : `Have ${property.type}.`;
                }

                return "Have 1BHK, 2BHK, Retails, Office Spaces and Luxury Studio Apartments.";
              })();

              const orientText =
                property.features?.find(
                  (f) =>
                    f.toLowerCase().includes("east-facing") ||
                    f.toLowerCase().includes("facing")
                ) || "* East-Facing Flats";

              const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
                `Hello Patliputra Group, I am interested in ${property.title} located at ${property.location}. Please share the brochure and current availability.`
              )}`;

              const amenityList =
                property.amenities && property.amenities.length > 0
                  ? property.amenities
                  : DEFAULT_AMENITIES;

              const aboutText = property.about || property.description || DEFAULT_ABOUT;
              const addressText = property.address || DEFAULT_ADDRESS;
              const sqftText = property.sqft || "An integrated luxury hub spread over 10 acres sqft";

              return (
                <article
                  key={property.id}
                  className={styles.horizontalCard}
                  id={`property-${property.id}`}
                >
                  <div className={styles.horizontalImageCol}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={property.image}
                      alt={`${property.title} - ${property.location}`}
                      className={styles.horizontalImg}
                      loading="lazy"
                    />
                    {property.tag && (
                      <span className={styles.horizontalTagBadge}>
                        {property.order
                          ? `#${String(property.order).padStart(2, "0")} • `
                          : ""}
                        {property.tag}
                      </span>
                    )}
                  </div>

                  <div className={styles.horizontalContentCol}>
                    <div className={styles.cardWatermark} aria-hidden="true">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/img/logo_final.png" alt="Patliputra Group Emblem" />
                    </div>

                    <div className={styles.horizontalHeaderGroup}>
                      <h3 className={styles.horizontalTitle}>{property.title}</h3>
                      <div className={styles.horizontalLocation}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          aria-hidden="true"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>{property.location}</span>
                      </div>
                    </div>

                    <div className={styles.horizontalHighlights}>
                      <div className={styles.highlightLine1}>
                        <span className={styles.highlightHubText}>{hubText}</span>
                        <span className={styles.highlightPriceText}>{priceText}</span>
                      </div>
                      <div className={styles.highlightLine2}>
                        <span className={styles.highlightConfigText}>{configText}</span>
                        <span className={styles.highlightOrientText}>{orientText}</span>
                      </div>
                      {(Boolean(property.bedrooms && Number(property.bedrooms) > 0) ||
                        Boolean(property.bathrooms && Number(property.bathrooms) > 0)) && (
                        <div
                          style={{
                            display: "inline-flex",
                            gap: "0.6rem",
                            marginTop: "0.25rem",
                            fontSize: "0.82rem",
                            color: "#1a1a2e",
                            fontWeight: 600,
                          }}
                        >
                          {property.bedrooms !== undefined &&
                            property.bedrooms !== null &&
                            Number(property.bedrooms) > 0 && (
                              <span
                                style={{
                                  background: "rgba(222, 179, 96, 0.15)",
                                  border: "1px solid rgba(222, 179, 96, 0.5)",
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                }}
                              >
                                {property.bedrooms} BHK
                              </span>
                            )}
                          {property.bathrooms !== undefined &&
                            property.bathrooms !== null &&
                            Number(property.bathrooms) > 0 && (
                              <span
                                style={{
                                  background: "rgba(26, 26, 46, 0.06)",
                                  border: "1px solid rgba(26, 26, 46, 0.15)",
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                }}
                              >
                                {property.bathrooms} Baths
                              </span>
                            )}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons Row */}
                    <div className={styles.horizontalActionsRow}>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.btnWhatsapp}
                        aria-label={`Chat on WhatsApp about ${property.title}`}
                      >
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
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                        </svg>
                        <span>Whatsapp</span>
                      </a>

                      <button
                        type="button"
                        className={styles.btnViewDetails}
                        onClick={() => handleOpenDetail(property)}
                        aria-label={`View details for ${property.title}`}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="16" x2="12" y2="12" />
                          <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        <span>View details</span>
                      </button>

                      {isAdmin && (
                        <div className={styles.horizontalAdminActions}>
                          <button
                            type="button"
                            className={styles.btnAdminEdit}
                            onClick={() => handleOpenEdit(property)}
                            title="Edit Project Details"
                          >
                            Edit
                          </button>
                          {confirmDeleteId === property.id ? (
                            <div style={{ display: "inline-flex", gap: "4px" }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setConfirmDeleteId(null);
                                  handleDelete(property.id, property.title);
                                }}
                                style={{
                                  background: "#e74c3c",
                                  border: "none",
                                  color: "#fff",
                                  padding: "0.5rem 0.75rem",
                                  borderRadius: "4px",
                                  fontSize: "0.75rem",
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
                                  background: "rgba(0,0,0,0.1)",
                                  border: "none",
                                  color: "#333",
                                  padding: "0.5rem 0.6rem",
                                  borderRadius: "4px",
                                  fontSize: "0.75rem",
                                  cursor: "pointer",
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              className={styles.btnAdminRemove}
                              onClick={() => setConfirmDeleteId(property.id)}
                              title="Remove Ongoing Project"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : filtered.length > 1 ? (
          <div className={styles.deliveredGrid}>
            {filtered.map((property, idx) => {
              const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
                `Hello Patliputra Group, I am interested in ${property.title} located at ${property.location}. Please share the brochure and current availability.`
              )}`;

              return (
                <article
                  key={property.id}
                  className={styles.deliveredStyleCard}
                  id={`property-${property.id}`}
                >
                  <div className={styles.deliveredMedia}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={property.image}
                      alt={`${property.title}, ${property.location}`}
                      className={styles.deliveredImage}
                      loading="lazy"
                    />
                    <span className={styles.deliveredBadge}>
                      <span>{property.tag || "Ongoing"}</span>
                    </span>
                    <span className={styles.deliveredIndex} aria-hidden="true">
                      {String(property.order || idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className={styles.deliveredBody}>
                    <h3 className={styles.deliveredName}>{property.title}</h3>
                    <p className={styles.deliveredLocation}>
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
                      {property.location}
                    </p>

                    <p className={styles.deliveredDesc}>
                      {property.description || property.features?.[0] || property.type}
                    </p>

                    <div className={styles.deliveredSpecsRow}>
                      <span>{property.area}</span>
                      {property.bedrooms !== undefined && property.bedrooms !== null && Number(property.bedrooms) > 0 && (
                        <span>{property.bedrooms} BHK</span>
                      )}
                      {property.bathrooms !== undefined && property.bathrooms !== null && Number(property.bathrooms) > 0 && (
                        <span>{property.bathrooms} Baths</span>
                      )}
                      <span style={{ color: "#1a1a2e", fontWeight: 700 }}>
                        {property.price}
                      </span>
                    </div>

                    <div className={styles.deliveredCardActions}>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.btnWhatsapp}
                        style={{ padding: "0.42rem 0.85rem", fontSize: "0.78rem" }}
                        aria-label={`WhatsApp about ${property.title}`}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                        </svg>
                        Whatsapp
                      </a>
                      <button
                        type="button"
                        className={styles.btnViewDetails}
                        style={{ padding: "0.42rem 0.85rem", fontSize: "0.78rem" }}
                        onClick={() => handleOpenDetail(property)}
                      >
                        Details
                      </button>
                    </div>

                    {isAdmin && (
                      <div
                        style={{
                          marginTop: "0.85rem",
                          paddingTop: "0.65rem",
                          borderTop: "1px dashed rgba(26,26,46,0.15)",
                          display: "flex",
                          gap: "6px",
                          justifyContent: "flex-end",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(property)}
                          className={styles.btnAdminEdit}
                          style={{ padding: "0.35rem 0.65rem", fontSize: "0.72rem" }}
                        >
                          Edit
                        </button>
                        {confirmDeleteId === property.id ? (
                          <div style={{ display: "inline-flex", gap: "4px" }}>
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmDeleteId(null);
                                handleDelete(property.id, property.title);
                              }}
                              style={{
                                background: "#e74c3c",
                                border: "none",
                                color: "#fff",
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
                                background: "rgba(0,0,0,0.1)",
                                border: "none",
                                color: "#333",
                                padding: "0.35rem 0.45rem",
                                borderRadius: "4px",
                                fontSize: "0.72rem",
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
                            className={styles.btnAdminRemove}
                            style={{ padding: "0.35rem 0.65rem", fontSize: "0.72rem" }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 1rem",
              background: "#ffffff",
              borderRadius: "16px",
              border: "1px dashed rgba(26,26,46,0.2)",
            }}
          >
            <p
              style={{
                fontSize: "1.05rem",
                color: "#4a5568",
                marginBottom: "1rem",
              }}
            >
              No ongoing projects found matching the filter &ldquo;{activeFilter}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => setActiveFilter("All Projects")}
              className={styles.btnViewDetails}
            >
              View All Projects
            </button>
          </div>
        )}

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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginTop: "4px",
                    }}
                  >
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
                      Order Position: #
                      {String(propertiesList.length + 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
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

              <form
                onSubmit={handleCreate}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      PROJECT TITLE *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Patliputra Royal Crest"
                      value={newOngoing.title}
                      onChange={(e) =>
                        setNewOngoing({ ...newOngoing, title: e.target.value })
                      }
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
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      CONFIGURATION *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 3 & 4 BHK"
                      value={newOngoing.type}
                      onChange={(e) =>
                        setNewOngoing({ ...newOngoing, type: e.target.value })
                      }
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

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      LOCATION *
                    </label>
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
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      STATUS TAG
                    </label>
                    <select
                      value={newOngoing.tag}
                      onChange={(e) =>
                        setNewOngoing({ ...newOngoing, tag: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        background: "#0c0d16",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "6px",
                        color: "#fff",
                      }}
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

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      AREA
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1,800 - 2,500 sq.ft."
                      value={newOngoing.area}
                      onChange={(e) =>
                        setNewOngoing({ ...newOngoing, area: e.target.value })
                      }
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
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      PRICE
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹85 Lakhs*"
                      value={newOngoing.price}
                      onChange={(e) =>
                        setNewOngoing({ ...newOngoing, price: e.target.value })
                      }
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

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      BEDROOMS (BHK) (OPTIONAL)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      placeholder="e.g. 3 (leave blank if N/A)"
                      value={newOngoing.bedrooms ?? ""}
                      onChange={(e) =>
                        setNewOngoing({
                          ...newOngoing,
                          bedrooms: e.target.value ? Number(e.target.value) : "",
                        })
                      }
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
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      BATHROOMS (OPTIONAL)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      placeholder="e.g. 2 (leave blank if N/A)"
                      value={newOngoing.bathrooms ?? ""}
                      onChange={(e) =>
                        setNewOngoing({
                          ...newOngoing,
                          bathrooms: e.target.value ? Number(e.target.value) : "",
                        })
                      }
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
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    FEATURES (COMMA-SEPARATED)
                  </label>
                  <input
                    type="text"
                    placeholder="Clubhouse, Security, Gym, Power Backup"
                    value={newOngoing.features}
                    onChange={(e) =>
                      setNewOngoing({ ...newOngoing, features: e.target.value })
                    }
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
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    SQFT / SCALE SPECIFICATION (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. An integrated luxury hub spread over 10 acres sqft"
                    value={newOngoing.sqft || ""}
                    onChange={(e) =>
                      setNewOngoing({ ...newOngoing, sqft: e.target.value })
                    }
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
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    PROPERTY ADDRESS (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Signature Park, Plot No. INS - 02, Sector - CHI V, Greater Noida"
                    value={newOngoing.address || ""}
                    onChange={(e) =>
                      setNewOngoing({ ...newOngoing, address: e.target.value })
                    }
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
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    ABOUT PROPERTY (OPTIONAL)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Comprehensive overview of architecture, commercial highlights, connectivity..."
                    value={newOngoing.about || ""}
                    onChange={(e) =>
                      setNewOngoing({ ...newOngoing, about: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      background: "#0c0d16",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "6px",
                      color: "#fff",
                      resize: "vertical",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    AMENITIES (COMMA-SEPARATED) (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    placeholder="MEDITATION GARDEN, 24/7 SECURITY, CCTV SURVEILLANCE, SWIMMING POOL..."
                    value={newOngoing.amenities || ""}
                    onChange={(e) =>
                      setNewOngoing({ ...newOngoing, amenities: e.target.value })
                    }
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

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "0.75rem",
                    marginTop: "0.5rem",
                  }}
                >
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginTop: "4px",
                    }}
                  >
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
                      Project #
                      {String(editingProperty.order || 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
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

              <form
                onSubmit={handleUpdate}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      PROJECT TITLE *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Patliputra Royal Crest"
                      value={editingProperty.title}
                      onChange={(e) =>
                        setEditingProperty({
                          ...editingProperty,
                          title: e.target.value,
                        })
                      }
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
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      TYPE / CONFIGURATION *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 3 & 4 BHK"
                      value={editingProperty.type}
                      onChange={(e) =>
                        setEditingProperty({
                          ...editingProperty,
                          type: e.target.value,
                        })
                      }
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

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      LOCATION *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bailey Road, Patna"
                      value={editingProperty.location}
                      onChange={(e) =>
                        setEditingProperty({
                          ...editingProperty,
                          location: e.target.value,
                        })
                      }
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
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      STATUS TAG
                    </label>
                    <select
                      value={editingProperty.tag || "Under Construction"}
                      onChange={(e) =>
                        setEditingProperty({
                          ...editingProperty,
                          tag: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        background: "#0c0d16",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "6px",
                        color: "#fff",
                      }}
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

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      CARPET AREA
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1,800 - 2,400 sq.ft."
                      value={editingProperty.area}
                      onChange={(e) =>
                        setEditingProperty({
                          ...editingProperty,
                          area: e.target.value,
                        })
                      }
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
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      PRICE / STARTING
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹85 Lakhs*"
                      value={editingProperty.price}
                      onChange={(e) =>
                        setEditingProperty({
                          ...editingProperty,
                          price: e.target.value,
                        })
                      }
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

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      BEDROOMS (BHK) (OPTIONAL)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      placeholder="Leave blank if N/A"
                      value={editingProperty.bedrooms ?? ""}
                      onChange={(e) =>
                        setEditingProperty({
                          ...editingProperty,
                          bedrooms: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
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
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      BATHROOMS (OPTIONAL)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      placeholder="Leave blank if N/A"
                      value={editingProperty.bathrooms ?? ""}
                      onChange={(e) =>
                        setEditingProperty({
                          ...editingProperty,
                          bathrooms: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
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
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    CUSTOM IMAGE URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={editingProperty.image}
                    onChange={(e) =>
                      setEditingProperty({
                        ...editingProperty,
                        image: e.target.value,
                      })
                    }
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
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
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

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    SQFT / SCALE SPECIFICATION (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. An integrated luxury hub spread over 10 acres sqft"
                    value={editingProperty.sqft || ""}
                    onChange={(e) =>
                      setEditingProperty({
                        ...editingProperty,
                        sqft: e.target.value,
                      })
                    }
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
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    PROPERTY ADDRESS (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Signature Park, Plot No. INS - 02, Sector - CHI V, Greater Noida"
                    value={editingProperty.address || ""}
                    onChange={(e) =>
                      setEditingProperty({
                        ...editingProperty,
                        address: e.target.value,
                      })
                    }
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
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    ABOUT PROPERTY (OPTIONAL)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Comprehensive overview of architecture, commercial highlights, connectivity..."
                    value={editingProperty.about || editingProperty.description || ""}
                    onChange={(e) =>
                      setEditingProperty({
                        ...editingProperty,
                        about: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      background: "#0c0d16",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "6px",
                      color: "#fff",
                      resize: "vertical",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    AMENITIES (COMMA-SEPARATED) (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    placeholder="MEDITATION GARDEN, 24/7 SECURITY, CCTV SURVEILLANCE, SWIMMING POOL..."
                    value={editingAmenitiesStr}
                    onChange={(e) => setEditingAmenitiesStr(e.target.value)}
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

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "0.75rem",
                    marginTop: "0.5rem",
                  }}
                >
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

        {/* Modal for View Details */}
        {showDetailModal && detailProperty && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.82)",
              backdropFilter: "blur(8px)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
            onClick={() => setShowDetailModal(false)}
          >
            <div
              style={{
                background: "#141525",
                border: "1px solid rgba(200, 164, 92, 0.4)",
                borderRadius: "16px",
                width: "100%",
                maxWidth: "680px",
                maxHeight: "90vh",
                overflowY: "auto",
                padding: "2rem",
                color: "#ffffff",
                boxShadow: "0 25px 70px rgba(0,0,0,0.8)",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                style={{
                  position: "absolute",
                  top: "1.25rem",
                  right: "1.25rem",
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: "#ffffff",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  fontSize: "1.4rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                &times;
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.75rem" }}>
                <span
                  style={{
                    background: "rgba(222, 179, 96, 0.15)",
                    border: "1px solid #deb360",
                    color: "#deb360",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {detailProperty.tag || "Ongoing Project"}
                </span>
              </div>

              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.65rem",
                  color: "#deb360",
                  margin: "0 0 0.5rem 0",
                }}
              >
                {detailProperty.title}
              </h2>

              <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "rgba(255,255,255,0.75)",
                  fontSize: "0.95rem",
                  marginBottom: "1.5rem",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#deb360" strokeWidth="2.2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {detailProperty.location}
              </p>

              {/* Banner Image */}
              <div
                style={{
                  width: "100%",
                  height: "240px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  marginBottom: "1.5rem",
                  position: "relative",
                  background: "#0c0d16",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={detailProperty.image}
                  alt={detailProperty.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Specs Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                  gap: "0.85rem",
                  marginBottom: "1.5rem",
                  background: "rgba(255,255,255,0.04)",
                  padding: "1rem",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div>
                  <span style={{ display: "block", fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
                    Starting Price
                  </span>
                  <strong style={{ fontSize: "1.1rem", color: "#deb360" }}>
                    {detailProperty.price}
                  </strong>
                </div>
                <div>
                  <span style={{ display: "block", fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
                    Project Area
                  </span>
                  <strong style={{ fontSize: "1rem", color: "#ffffff" }}>
                    {detailProperty.area}
                  </strong>
                </div>
                {detailProperty.bedrooms !== undefined && detailProperty.bedrooms !== null && Number(detailProperty.bedrooms) > 0 && (
                  <div>
                    <span style={{ display: "block", fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
                      Bedrooms
                    </span>
                    <strong style={{ fontSize: "0.95rem", color: "#ffffff" }}>
                      {detailProperty.bedrooms} BHK
                    </strong>
                  </div>
                )}
                {detailProperty.bathrooms !== undefined && detailProperty.bathrooms !== null && Number(detailProperty.bathrooms) > 0 && (
                  <div>
                    <span style={{ display: "block", fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
                      Bathrooms
                    </span>
                    <strong style={{ fontSize: "0.95rem", color: "#ffffff" }}>
                      {detailProperty.bathrooms} Baths
                    </strong>
                  </div>
                )}
                {detailProperty.type && (
                  <div>
                    <span style={{ display: "block", fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
                      Configuration
                    </span>
                    <strong style={{ fontSize: "0.88rem", color: "#ffffff" }}>
                      {detailProperty.type}
                    </strong>
                  </div>
                )}
              </div>

              {/* SQFT Scale */}
              {(detailProperty.sqft || detailProperty.area) && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "1.25rem",
                    background: "rgba(222, 179, 96, 0.1)",
                    border: "1px solid rgba(222, 179, 96, 0.3)",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                  }}
                >
                  <span
                    style={{
                      background: "#deb360",
                      color: "#0f1020",
                      fontWeight: 800,
                      fontSize: "0.75rem",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      letterSpacing: "1px",
                    }}
                  >
                    SQFT
                  </span>
                  <span style={{ fontSize: "0.9rem", color: "#ffffff", fontWeight: 600 }}>
                    {detailProperty.sqft || `${detailProperty.area} sqft`}
                  </span>
                </div>
              )}

              {/* About Property */}
              <div style={{ marginBottom: "1.25rem" }}>
                <h4 style={{ fontSize: "0.88rem", letterSpacing: "1px", textTransform: "uppercase", color: "#deb360", marginBottom: "0.5rem" }}>
                  About Property
                </h4>
                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.6, margin: 0 }}>
                  {detailProperty.about || detailProperty.description || DEFAULT_ABOUT}
                </p>
              </div>

              {/* Property Address */}
              <div style={{ marginBottom: "1.25rem" }}>
                <h4 style={{ fontSize: "0.88rem", letterSpacing: "1px", textTransform: "uppercase", color: "#deb360", marginBottom: "0.5rem" }}>
                  Property Address
                </h4>
                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.75)", margin: 0 }}>
                  {detailProperty.address || DEFAULT_ADDRESS}
                </p>
              </div>

              {/* Amenities */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h4 style={{ fontSize: "0.88rem", letterSpacing: "1px", textTransform: "uppercase", color: "#deb360", marginBottom: "0.75rem" }}>
                  Amenities
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.55rem" }}>
                  {(detailProperty.amenities || DEFAULT_AMENITIES).map((amenity, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "rgba(255,255,255,0.85)" }}>
                      <span style={{ color: "#deb360" }}>⊙</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "0.85rem",
                  flexWrap: "wrap",
                  paddingTop: "1rem",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <a
                  href={`https://wa.me/919876543210?text=${encodeURIComponent(
                    `Hello Patliputra Group, I am interested in ${detailProperty.title} located at ${detailProperty.location}. Please share the brochure and current availability.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnWhatsapp}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  Chat on WhatsApp
                </a>

                <button
                  type="button"
                  onClick={() => setShowDetailModal(false)}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    color: "#ffffff",
                    border: "1px solid rgba(255,255,255,0.2)",
                    padding: "0.65rem 1.4rem",
                    borderRadius: "6px",
                    fontWeight: 600,
                    fontSize: "0.88rem",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
