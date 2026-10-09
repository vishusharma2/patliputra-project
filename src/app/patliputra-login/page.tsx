"use client";

import { useState, useEffect, FormEvent, KeyboardEvent } from "react";
import Link from "next/link";
import styles from "./AdminLogin.module.css";
import initialData from "@/data/projectsData.json";
import initialNewsData from "@/data/newsData.json";

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

interface NewsArticle {
  id: string;
  category: "clipping" | "release";
  source: string;
  date: string;
  headline: string;
  englishTitle?: string;
  excerpt: string;
  image: string;
  tag: string;
  highlights?: string[];
  isClipping?: boolean;
}

const NEWS_PRESET_IMAGES = [
  {
    name: "Clipping 1: Manoj Tiwari Inauguration",
    url: "/img/news/delivered_news1.webp",
  },
  {
    name: "Clipping 2: 50L Sq. Ft. Delivery",
    url: "/img/news/delivered_news2.webp",
  },
  {
    name: "Clipping 3: Strategic Chi V Location",
    url: "/img/news/delivered_news4.webp",
  },
  {
    name: "Signature Park Project Overview",
    url: "/img/signature_park.jpg",
  },
];

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
    name: "Patliputra Signature Park",
    url: "/img/signature_park.jpg",
  },
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
    "delivered" | "ongoing" | "overview" | "news"
  >("delivered");
  const [deliveredProjects, setDeliveredProjects] = useState<
    DeliveredProject[]
  >(initialData.delivered || []);
  const [ongoingProjects, setOngoingProjects] = useState<OngoingProject[]>(
    initialData.ongoing || [],
  );
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>(
    (initialNewsData as NewsArticle[]) || [],
  );

  // Modals for Adding Projects & News
  const [showAddDeliveredModal, setShowAddDeliveredModal] = useState(false);
  const [showAddOngoingModal, setShowAddOngoingModal] = useState(false);
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [showEditNewsModal, setShowEditNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [editingNewsHighlightsStr, setEditingNewsHighlightsStr] = useState("");
  const [confirmDeleteNewsId, setConfirmDeleteNewsId] = useState<string | null>(
    null,
  );

  // Add News Form State
  const [newNews, setNewNews] = useState({
    category: "clipping" as "clipping" | "release",
    source: "NATIONAL PRESS & DAINIK JAGRAN",
    date: "RECENT COVERAGE",
    headline: "",
    englishTitle: "",
    excerpt: "",
    image: "/img/news/delivered_news1.webp",
    tag: "NEWSPAPER CLIPPING",
    highlights: "उद्घाटन: सांसद मनोज तिवारी, Chi V ग्रेटर नोएडा, 12% अश्योर्ड रिटर्न",
    isClipping: true,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add Delivered Form State
  const [newDelivered, setNewDelivered] = useState({
    name: "",
    location: "Patna",
    image: "/img/delivered/satyam.webp",
    description: "",
  });

  // Add Ongoing Form State
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
    image: ONGOING_PRESET_IMAGES[0].url,
    tag: "Under Construction",
    sqft: "An integrated luxury hub spread over 10 acres sqft",
    about: "",
    address: "",
    amenities: "",
    features:
      "Have 1BHK, 2BHK, Retails, Office Spaces and Luxury Studio Apartments., * East-Facing Flats, An integrated luxury hub spread over 10 acres",
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
  const [editingOngoingAmenitiesStr, setEditingOngoingAmenitiesStr] =
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

  // Fetch latest projects and news data whenever authenticated
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

      fetch("/api/admin/news")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setNewsArticles(data);
          }
        })
        .catch((err) =>
          console.error("Error fetching news in admin console:", err),
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
            order: ongoingProjects.length + 1,
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
            image: newOngoing.image || ONGOING_PRESET_IMAGES[0].url,
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
        setOngoingProjects(data.data.ongoing);
        setShowAddOngoingModal(false);
        setNewOngoing({
          title: "",
          type: "1BHK, 2BHK, Retails, Office Spaces & Luxury Studio Apartments",
          location: "Greater Noida",
          area: "10 Acres",
          price: "Starts @ 40 Lakh*",
          bedrooms: "",
          bathrooms: "",
          image: ONGOING_PRESET_IMAGES[0].url,
          tag: "Under Construction",
          sqft: "An integrated luxury hub spread over 10 acres sqft",
          about: "",
          address: "",
          amenities: "",
          features:
            "Have 1BHK, 2BHK, Retails, Office Spaces and Luxury Studio Apartments., * East-Facing Flats, An integrated luxury hub spread over 10 acres",
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
    setEditingOngoingAmenitiesStr(
      Array.isArray(project.amenities)
        ? project.amenities.join(", ")
        : project.amenities || ""
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

    const amenityList = editingOngoingAmenitiesStr
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
            ...editingOngoing,
            title: editingOngoing.title.trim(),
            type: editingOngoing.type.trim() || "3 & 4 BHK",
            location: editingOngoing.location.trim() || "Bailey Road, Patna",
            area: editingOngoing.area.trim() || "1,800 - 2,500 sq.ft.",
            price: editingOngoing.price.trim() || "Price on Request",
            bedrooms:
              editingOngoing.bedrooms && Number(editingOngoing.bedrooms) > 0
                ? Number(editingOngoing.bedrooms)
                : undefined,
            bathrooms:
              editingOngoing.bathrooms && Number(editingOngoing.bathrooms) > 0
                ? Number(editingOngoing.bathrooms)
                : undefined,
            image: editingOngoing.image || ONGOING_PRESET_IMAGES[0].url,
            tag: editingOngoing.tag || "Under Construction",
            sqft: editingOngoing.sqft?.trim() || undefined,
            about: editingOngoing.about?.trim() || undefined,
            address: editingOngoing.address?.trim() || undefined,
            amenities: amenityList.length > 0 ? amenityList : undefined,
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

  // Add News Article Handler
  const handleCreateNews = async (e: FormEvent) => {
    e.preventDefault();
    if (!newNews.headline.trim()) {
      alert("Please enter a news headline.");
      return;
    }

    const highlightsList = newNews.highlights
      ? newNews.highlights
          .split(",")
          .map((h) => h.trim())
          .filter(Boolean)
      : undefined;

    const articlePayload: NewsArticle = {
      id: `news-${Date.now()}`,
      category: newNews.category,
      source: newNews.source.trim() || "PATLIPUTRA MEDIA DESK",
      date: newNews.date.trim() || "LATEST NEWS",
      headline: newNews.headline.trim(),
      englishTitle: newNews.englishTitle.trim() || undefined,
      excerpt: newNews.excerpt.trim(),
      image: newNews.image || "/img/news/delivered_news1.webp",
      tag:
        newNews.tag.trim() ||
        (newNews.category === "clipping"
          ? "NEWSPAPER CLIPPING"
          : "PRESS RELEASE"),
      highlights:
        highlightsList && highlightsList.length > 0
          ? highlightsList
          : undefined,
      isClipping: newNews.isClipping,
    };

    try {
      const res = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articlePayload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNewsArticles(data.data);
        setShowAddNewsModal(false);
        setNewNews({
          category: "clipping",
          source: "NATIONAL PRESS & DAINIK JAGRAN",
          date: "RECENT COVERAGE",
          headline: "",
          englishTitle: "",
          excerpt: "",
          image: "/img/news/delivered_news1.webp",
          tag: "NEWSPAPER CLIPPING",
          highlights:
            "उद्घाटन: सांसद मनोज तिवारी, Chi V ग्रेटर नोएडा, 12% अश्योर्ड रिटर्न",
          isClipping: true,
        });
        setToastMessage(
          `✓ News article "${articlePayload.headline.slice(0, 35)}..." published & updated as latest story!`,
        );
      } else {
        alert(data.error || "Failed to publish news article");
      }
    } catch (err) {
      console.error("Error creating news article:", err);
      alert("Network error publishing news article");
    }
  };

  // Open Edit News Modal
  const handleOpenEditNews = (item: NewsArticle) => {
    setEditingNews({ ...item });
    setEditingNewsHighlightsStr(
      item.highlights && Array.isArray(item.highlights)
        ? item.highlights.join(", ")
        : "",
    );
    setShowEditNewsModal(true);
  };

  // Submit Edit News Article
  const handleUpdateNews = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingNews || !editingNews.headline.trim()) {
      alert("Please enter a valid headline.");
      return;
    }

    const highlightsList = editingNewsHighlightsStr
      ? editingNewsHighlightsStr
          .split(",")
          .map((h) => h.trim())
          .filter(Boolean)
      : undefined;

    const updatedItem: NewsArticle = {
      ...editingNews,
      headline: editingNews.headline.trim(),
      source: editingNews.source.trim(),
      date: editingNews.date.trim(),
      englishTitle: editingNews.englishTitle?.trim() || undefined,
      excerpt: editingNews.excerpt.trim(),
      tag: editingNews.tag.trim(),
      highlights:
        highlightsList && highlightsList.length > 0
          ? highlightsList
          : undefined,
    };

    try {
      const res = await fetch("/api/admin/news", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNewsArticles(data.data);
        setShowEditNewsModal(false);
        setEditingNews(null);
        setToastMessage(`✓ News article updated successfully!`);
      } else {
        alert(data.error || "Failed to update news article");
      }
    } catch (err) {
      console.error("Error updating news article:", err);
      alert("Network error updating news article");
    }
  };

  // Delete News Article Handler
  const handleDeleteNews = async (id: string, headline?: string) => {
    try {
      const res = await fetch(
        `/api/admin/news?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        },
      );

      const data = await res.json();
      if (res.ok && data.success) {
        setNewsArticles(data.data);
        setToastMessage(
          `✓ News article "${(headline || id).slice(0, 35)}..." removed successfully.`,
        );
      } else {
        alert(data.error || "Failed to remove news article");
      }
    } catch (err) {
      console.error("Error deleting news article:", err);
      alert("Network error deleting news article");
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
      <main
        className={
          isAuthenticated
            ? styles.mainContainerAuth
            : styles.mainContainer
        }
      >
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
                    <span className={styles.dashHeaderStatsBadge}>
                      {deliveredProjects.length} Delivered &bull;{" "}
                      {ongoingProjects.length} Ongoing &bull;{" "}
                      {newsArticles.length} News
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
                aria-selected={activeTab === "news"}
                className={`${styles.tabBtn} ${activeTab === "news" ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveTab("news")}
              >
                <span>News &amp; Media</span>
                <span className={styles.tabCountBadge}>
                  {newsArticles.length}
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
                          {p.bedrooms !== undefined && p.bedrooms !== null && Number(p.bedrooms) > 0 && (
                            <span>
                              BHK: <strong>{p.bedrooms}</strong>
                            </span>
                          )}
                          {p.bathrooms !== undefined && p.bathrooms !== null && Number(p.bathrooms) > 0 && (
                            <span>
                              Baths: <strong>{p.bathrooms}</strong>
                            </span>
                          )}
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

            {/* TAB 4: NEWS & MEDIA COVERAGE */}
            {activeTab === "news" && (
              <div>
                <div className={styles.toolbarRow}>
                  <div className={styles.toolbarTitle}>
                    <span>News &amp; Media Coverage Directory</span>
                    <span className={styles.tabCountBadge}>
                      {newsArticles.length} Published
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.addProjectBtn}
                    onClick={() => setShowAddNewsModal(true)}
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
                    <span>Publish News Article</span>
                  </button>
                </div>

                {/* Automated Multi-Channel Live Sync Banner */}
                <div className={styles.liveSyncBanner}>
                  <div className={styles.liveSyncInfo}>
                    <div className={styles.liveSyncIconWrap}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div className={styles.liveSyncText}>
                      <strong>Automated Multi-Channel Sync:</strong> The top 2
                      news articles in this directory are live-extracted into the
                      global website <strong>Footer</strong>, while all published
                      items appear with high-res clipping zoom on the public{" "}
                      <strong>/media</strong> portal.
                    </div>
                  </div>
                  <div className={styles.liveSyncLinks}>
                    <Link
                      href="/media"
                      target="_blank"
                      className={styles.liveSyncLink}
                    >
                      View Live /media Page ↗
                    </Link>
                    <Link
                      href="/#contact"
                      target="_blank"
                      className={styles.liveSyncLink}
                    >
                      Inspect Footer ↗
                    </Link>
                  </div>
                </div>

                <div className={styles.projectsGrid}>
                  {newsArticles.map((item, index) => (
                    <div key={item.id || index} className={styles.projectCard}>
                      <div className={styles.cardMedia}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.headline}
                          loading="lazy"
                        />
                        <span
                          className={`${styles.cardStatusPill} ${
                            index === 0
                              ? styles.cardStatusTopStory
                              : index === 1
                                ? styles.cardStatusSecondStory
                                : ""
                          }`}
                        >
                          {index === 0
                            ? "★ TOP STORY (FOOTER #1)"
                            : index === 1
                              ? "★ LATEST (FOOTER #2)"
                              : item.category === "clipping"
                                ? "Print Clipping"
                                : "Press Release"}
                        </span>
                      </div>
                      <div className={styles.cardBody}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "0.72rem",
                            color: "#deb360",
                            fontWeight: 600,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            marginBottom: "0.35rem",
                          }}
                        >
                          <span>{item.source}</span>
                          <span style={{ color: "rgba(255,255,255,0.45)" }}>
                            {item.date}
                          </span>
                        </div>
                        <h3
                          className={styles.cardTitle}
                          style={{ fontSize: "0.98rem", lineHeight: "1.4" }}
                        >
                          {item.headline}
                        </h3>
                        {item.englishTitle && (
                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: "rgba(255, 255, 255, 0.7)",
                              fontStyle: "italic",
                              marginBottom: "0.5rem",
                            }}
                          >
                            {item.englishTitle}
                          </div>
                        )}
                        <p
                          className={styles.cardDescText}
                          style={{ lineClamp: 3 }}
                        >
                          {item.excerpt}
                        </p>
                        {item.highlights && item.highlights.length > 0 && (
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "4px",
                              marginTop: "0.5rem",
                              marginBottom: "0.5rem",
                            }}
                          >
                            {item.highlights.slice(0, 3).map((h, i) => (
                              <span
                                key={i}
                                style={{
                                  fontSize: "0.7rem",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  background: "rgba(255,255,255,0.06)",
                                  color: "rgba(255,255,255,0.7)",
                                }}
                              >
                                {h}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className={styles.cardFooterAction}>
                          <span
                            style={{
                              fontSize: "0.72rem",
                              color: "rgba(255,255,255,0.4)",
                            }}
                          >
                            {item.tag || "NEWS"}
                          </span>
                          <div className={styles.cardActionBtns}>
                            <button
                              type="button"
                              className={styles.editCardBtn}
                              onClick={() => handleOpenEditNews(item)}
                              title="Edit news article"
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

                            {confirmDeleteNewsId === item.id ? (
                              <div className={styles.deleteConfirmGroup}>
                                <button
                                  type="button"
                                  className={styles.deleteConfirmBtn}
                                  onClick={() => {
                                    setConfirmDeleteNewsId(null);
                                    handleDeleteNews(item.id, item.headline);
                                  }}
                                >
                                  Confirm
                                </button>
                                <button
                                  type="button"
                                  className={styles.deleteCancelBtn}
                                  onClick={() => setConfirmDeleteNewsId(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                className={styles.deleteCardBtn}
                                onClick={() => setConfirmDeleteNewsId(item.id)}
                                title="Remove news article"
                              >
                                <svg
                                  width="13"
                                  height="13"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.2"
                                >
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                                <span>Delete</span>
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
                    <label>Bedrooms (BHK) (Optional)</label>
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
                    />
                  </div>

                  <div className={styles.formField}>
                    <label>Bathrooms (Optional)</label>
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
                    />
                  </div>
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

                <div className={styles.formField}>
                  <label>SQFT / Scale Specification (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. An integrated luxury hub spread over 10 acres sqft"
                    value={newOngoing.sqft || ""}
                    onChange={(e) =>
                      setNewOngoing({ ...newOngoing, sqft: e.target.value })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>Property Full Address (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Signature Park, Plot No. INS - 02, Sector - CHI V, Greater Noida"
                    value={newOngoing.address || ""}
                    onChange={(e) =>
                      setNewOngoing({ ...newOngoing, address: e.target.value })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>About Property (Optional)</label>
                  <textarea
                    rows={4}
                    placeholder="Comprehensive overview of architecture, commercial highlights, connectivity..."
                    value={newOngoing.about || ""}
                    onChange={(e) =>
                      setNewOngoing({ ...newOngoing, about: e.target.value })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>Amenities (comma-separated) (Optional)</label>
                  <input
                    type="text"
                    placeholder="MEDITATION GARDEN, 24/7 SECURITY, CCTV SURVEILLANCE, SWIMMING POOL..."
                    value={newOngoing.amenities || ""}
                    onChange={(e) =>
                      setNewOngoing({ ...newOngoing, amenities: e.target.value })
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
                    <label>Bedrooms (BHK) (Optional)</label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      placeholder="Leave blank if N/A"
                      value={editingOngoing.bedrooms ?? ""}
                      onChange={(e) =>
                        setEditingOngoing({
                          ...editingOngoing,
                          bedrooms: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                    />
                  </div>

                  <div className={styles.formField}>
                    <label>Bathrooms (Optional)</label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      placeholder="Leave blank if N/A"
                      value={editingOngoing.bathrooms ?? ""}
                      onChange={(e) =>
                        setEditingOngoing({
                          ...editingOngoing,
                          bathrooms: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                    />
                  </div>
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

                <div className={styles.formField}>
                  <label>SQFT / Scale Specification (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. An integrated luxury hub spread over 10 acres sqft"
                    value={editingOngoing.sqft || ""}
                    onChange={(e) =>
                      setEditingOngoing({
                        ...editingOngoing,
                        sqft: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>Property Full Address (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Signature Park, Plot No. INS - 02, Sector - CHI V, Greater Noida"
                    value={editingOngoing.address || ""}
                    onChange={(e) =>
                      setEditingOngoing({
                        ...editingOngoing,
                        address: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>About Property (Optional)</label>
                  <textarea
                    rows={4}
                    placeholder="Comprehensive overview of architecture, commercial highlights, connectivity..."
                    value={editingOngoing.about || editingOngoing.description || ""}
                    onChange={(e) =>
                      setEditingOngoing({
                        ...editingOngoing,
                        about: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>Amenities (comma-separated) (Optional)</label>
                  <input
                    type="text"
                    placeholder="MEDITATION GARDEN, 24/7 SECURITY, CCTV SURVEILLANCE, SWIMMING POOL..."
                    value={editingOngoingAmenitiesStr}
                    onChange={(e) =>
                      setEditingOngoingAmenitiesStr(e.target.value)
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

        {/* MODAL: ADD NEWS ARTICLE */}
        {showAddNewsModal && (
          <div
            className={styles.modalBackdrop}
            onClick={() => setShowAddNewsModal(false)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <div>
                  <h3 className={styles.modalTitle}>
                    Publish News / Media Coverage
                  </h3>
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
                      ★ Will Be Placed as Top / Latest Story
                    </span>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      (Instantly appears in the site Footer and on /media)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.modalCloseBtn}
                  onClick={() => setShowAddNewsModal(false)}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleCreateNews} className={styles.modalForm}>
                <div className={styles.formField}>
                  <label>Coverage Category *</label>
                  <select
                    value={newNews.category}
                    onChange={(e) => {
                      const cat = e.target.value as "clipping" | "release";
                      setNewNews({
                        ...newNews,
                        category: cat,
                        tag:
                          cat === "clipping"
                            ? "NEWSPAPER CLIPPING"
                            : "PRESS RELEASE",
                        isClipping: cat === "clipping",
                      });
                    }}
                    style={{
                      background: "rgba(20, 20, 36, 0.9)",
                      border: "1px solid rgba(200, 164, 92, 0.3)",
                      color: "#fff",
                      borderRadius: "8px",
                      padding: "0.6rem 0.8rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    <option value="clipping">
                      Newspaper Clipping (Print Coverage)
                    </option>
                    <option value="release">
                      Press Release / Corporate Announcement
                    </option>
                  </select>
                </div>

                <div className={styles.formField}>
                  <label>Media Source / Publication Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NATIONAL PRESS & DAINIK JAGRAN"
                    value={newNews.source}
                    onChange={(e) =>
                      setNewNews({ ...newNews, source: e.target.value })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>Date / Edition Tag *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RECENT COVERAGE or OCTOBER 2026"
                    value={newNews.date}
                    onChange={(e) =>
                      setNewNews({ ...newNews, date: e.target.value })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>Main Headline (Hindi or English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. पाटलिपुत्र सिग्नेचर पार्क का भव्य शुभारंभ..."
                    value={newNews.headline}
                    onChange={(e) =>
                      setNewNews({ ...newNews, headline: e.target.value })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>English Subtitle / Translation (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Grand Launch of Patliputra Signature Park in Chi V"
                    value={newNews.englishTitle}
                    onChange={(e) =>
                      setNewNews({ ...newNews, englishTitle: e.target.value })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>Select Preset Media Image</label>
                  <div className={styles.imagePresetPicker}>
                    {NEWS_PRESET_IMAGES.map((img) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={img.url}
                        src={img.url}
                        alt={img.name}
                        title={img.name}
                        className={`${styles.presetThumb} ${
                          newNews.image === img.url
                            ? styles.presetThumbSelected
                            : ""
                        }`}
                        onClick={() =>
                          setNewNews({ ...newNews, image: img.url })
                        }
                      />
                    ))}
                  </div>
                </div>

                <div className={styles.formField}>
                  <label>Or Custom Image URL</label>
                  <input
                    type="text"
                    placeholder="/img/news/delivered_news1.webp or https://..."
                    value={newNews.image}
                    onChange={(e) =>
                      setNewNews({ ...newNews, image: e.target.value })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>Article Excerpt / Summary *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Key highlights and article summary..."
                    value={newNews.excerpt}
                    onChange={(e) =>
                      setNewNews({ ...newNews, excerpt: e.target.value })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>Key Highlights (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="उद्घाटन: सांसद मनोज तिवारी, Chi V ग्रेटर नोएडा, 12% अश्योर्ड रिटर्न"
                    value={newNews.highlights}
                    onChange={(e) =>
                      setNewNews({ ...newNews, highlights: e.target.value })
                    }
                  />
                </div>

                <div
                  className={styles.formField}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    id="isClippingCheckAdd"
                    checked={newNews.isClipping}
                    onChange={(e) =>
                      setNewNews({ ...newNews, isClipping: e.target.checked })
                    }
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <label
                    htmlFor="isClippingCheckAdd"
                    style={{
                      cursor: "pointer",
                      margin: 0,
                      fontSize: "0.85rem",
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    Enable Full-Resolution Lightbox Zoom on Click (for Newspaper
                    Clippings)
                  </label>
                </div>

                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.btnCancel}
                    onClick={() => setShowAddNewsModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.btnSubmit}>
                    Publish News Article
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT NEWS ARTICLE */}
        {showEditNewsModal && editingNews && (
          <div
            className={styles.modalBackdrop}
            onClick={() => setShowEditNewsModal(false)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <div>
                  <h3 className={styles.modalTitle}>Edit News Article</h3>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(255,255,255,0.5)",
                      marginTop: "4px",
                    }}
                  >
                    ID: {editingNews.id}
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.modalCloseBtn}
                  onClick={() => setShowEditNewsModal(false)}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleUpdateNews} className={styles.modalForm}>
                <div className={styles.formField}>
                  <label>Coverage Category</label>
                  <select
                    value={editingNews.category}
                    onChange={(e) => {
                      const cat = e.target.value as "clipping" | "release";
                      setEditingNews({
                        ...editingNews,
                        category: cat,
                        isClipping: cat === "clipping",
                      });
                    }}
                    style={{
                      background: "rgba(20, 20, 36, 0.9)",
                      border: "1px solid rgba(200, 164, 92, 0.3)",
                      color: "#fff",
                      borderRadius: "8px",
                      padding: "0.6rem 0.8rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    <option value="clipping">
                      Newspaper Clipping (Print Coverage)
                    </option>
                    <option value="release">
                      Press Release / Corporate Announcement
                    </option>
                  </select>
                </div>

                <div className={styles.formField}>
                  <label>Media Source / Publication Name *</label>
                  <input
                    type="text"
                    required
                    value={editingNews.source}
                    onChange={(e) =>
                      setEditingNews({ ...editingNews, source: e.target.value })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>Date / Edition Tag *</label>
                  <input
                    type="text"
                    required
                    value={editingNews.date}
                    onChange={(e) =>
                      setEditingNews({ ...editingNews, date: e.target.value })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>Main Headline *</label>
                  <input
                    type="text"
                    required
                    value={editingNews.headline}
                    onChange={(e) =>
                      setEditingNews({
                        ...editingNews,
                        headline: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>English Subtitle / Translation (Optional)</label>
                  <input
                    type="text"
                    value={editingNews.englishTitle || ""}
                    onChange={(e) =>
                      setEditingNews({
                        ...editingNews,
                        englishTitle: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>Select Preset Media Image</label>
                  <div className={styles.imagePresetPicker}>
                    {NEWS_PRESET_IMAGES.map((img) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={img.url}
                        src={img.url}
                        alt={img.name}
                        title={img.name}
                        className={`${styles.presetThumb} ${
                          editingNews.image === img.url
                            ? styles.presetThumbSelected
                            : ""
                        }`}
                        onClick={() =>
                          setEditingNews({ ...editingNews, image: img.url })
                        }
                      />
                    ))}
                  </div>
                </div>

                <div className={styles.formField}>
                  <label>Image URL</label>
                  <input
                    type="text"
                    value={editingNews.image}
                    onChange={(e) =>
                      setEditingNews({ ...editingNews, image: e.target.value })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>Article Excerpt / Summary *</label>
                  <textarea
                    rows={4}
                    required
                    value={editingNews.excerpt}
                    onChange={(e) =>
                      setEditingNews({
                        ...editingNews,
                        excerpt: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>Key Highlights (comma-separated)</label>
                  <input
                    type="text"
                    value={editingNewsHighlightsStr}
                    onChange={(e) =>
                      setEditingNewsHighlightsStr(e.target.value)
                    }
                  />
                </div>

                <div
                  className={styles.formField}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    id="isClippingCheckEdit"
                    checked={editingNews.isClipping || false}
                    onChange={(e) =>
                      setEditingNews({
                        ...editingNews,
                        isClipping: e.target.checked,
                      })
                    }
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <label
                    htmlFor="isClippingCheckEdit"
                    style={{
                      cursor: "pointer",
                      margin: 0,
                      fontSize: "0.85rem",
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    Enable Full-Resolution Lightbox Zoom on Click (for Newspaper
                    Clippings)
                  </label>
                </div>

                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.btnCancel}
                    onClick={() => setShowEditNewsModal(false)}
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
