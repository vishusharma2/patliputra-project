"use client";

import { useState, useEffect, FormEvent, KeyboardEvent } from "react";
import Link from "next/link";
import styles from "./AdminLogin.module.css";
import ImageUpload from "@/components/ImageUpload/ImageUpload";

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

interface BusinessSector {
  id: string;
  order?: number;
  title: string;
  category: string;
  categoryLabel: string;
  categoryFilter: string;
  location: string;
  tagline: string;
  image: string;
  description: string;
  features: string[];
  stats: { label: string; value: string }[];
  address: string;
  contactInfo: string;
  highlights: string[];
}

interface Landmark {
  id: string;
  order?: number;
  title: string;
  badge: string;
  image: string;
}

const LANDMARK_PRESET_IMAGES = [
  {
    name: "5 Star Hotel in Mussoorie",
    url: "https://mbfrobyozijbwglauqop.supabase.co/storage/v1/object/public/project%20images/Landmarks/Mussoorie_Hotel.png",
  },
  {
    name: "5 Star Hotel in Ranchi",
    url: "https://mbfrobyozijbwglauqop.supabase.co/storage/v1/object/public/project%20images/Landmarks/Ranchi_Hotel.png",
  },
  {
    name: "Patliputra Park in Patna",
    url: "https://mbfrobyozijbwglauqop.supabase.co/storage/v1/object/public/project%20images/Landmarks/Patliputra_Park.png",
  },
  {
    name: "5 Star Hotel in Greater Noida",
    url: "https://mbfrobyozijbwglauqop.supabase.co/storage/v1/object/public/project%20images/Landmarks/GreaterNoida_Hotel.png",
  },
  {
    name: "Patliputra Signature Park",
    url: "https://mbfrobyozijbwglauqop.supabase.co/storage/v1/object/public/project%20images/logo%20and%20other/patliputra_signature_park.png",
  },
];

interface BlogArticle {
  id: string;
  order?: number;
  title: string;
  author: string;
  date: string;
  image: string;
  subtitle?: string;
  description?: string;
  offers?: string[];
  highlights?: string[];
  whyInvest?: string[];
  contactPhone?: string;
  patnaOffice?: string;
  noidaOffice?: string;
}

const BLOG_PRESET_IMAGES = [
  {
    name: "After Success In Bihar (Flyer)",
    url: "https://mbfrobyozijbwglauqop.supabase.co/storage/v1/object/public/project%20images/Blogs/blog_bihar_success.png",
  },
  {
    name: "Now In Greater Noida (Flyer)",
    url: "https://mbfrobyozijbwglauqop.supabase.co/storage/v1/object/public/project%20images/Blogs/blog_greater_noida.png",
  },
  {
    name: "Offer Patliputra Signature Park",
    url: "https://mbfrobyozijbwglauqop.supabase.co/storage/v1/object/public/project%20images/Blogs/blog_signature_park_offer.png",
  },
  {
    name: "Patliputra Signature Park Project",
    url: "https://mbfrobyozijbwglauqop.supabase.co/storage/v1/object/public/project%20images/logo%20and%20other/patliputra_signature_park.png",
  },
];

// Helper to get present date in YYYY-MM-DD format for calendar date input
const getPresentDateISO = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Convert ISO date "YYYY-MM-DD" to readable "DD-MMMM YYYY" (e.g. "10-October 2026")
const formatReadableDate = (dateVal: string): string => {
  if (!dateVal) return "";
  const parts = dateVal.split("-");
  if (parts.length === 3 && parts[0].length === 4) {
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parts[2].padStart(2, "0");
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    if (months[monthIndex]) {
      return `${day}-${months[monthIndex]} ${year}`;
    }
  }
  return dateVal;
};

// Helper to convert any date representation to YYYY-MM-DD for <input type="date">
const toInputDateISO = (dateStr?: string): string => {
  if (!dateStr) return getPresentDateISO();
  const clean = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;
  const replaced = clean.replace(/-/g, " ");
  const parsed = new Date(replaced);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, "0");
    const d = String(parsed.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return getPresentDateISO();
};

// Empty blog state for publishing (all fields empty, date set to present date)
const createEmptyBlogState = () => ({
  title: "",
  author: "",
  date: getPresentDateISO(),
  image: "",
  subtitle: "",
  description: "",
  offers: "",
  highlights: "",
  whyInvest: "",
  contactPhone: "",
  patnaOffice: "",
  noidaOffice: "",
});

const DIVERSIFIED_PRESET_IMAGES = [
  {
    name: "Hotel Patliputra Exotica",
    url: "/img/Business/delivered_exotica.webp",
  },
  {
    name: "Hotel Patliputra Nirvana",
    url: "/img/Business/delivered_nirvana.webp",
  },
  {
    name: "Alina Resort & Lawns",
    url: "/img/Business/delivered_alina.webp",
  },
  {
    name: "MIMS Super-Speciality Hospital",
    url: "/img/Business/delivered_mims.webp",
  },
  {
    name: "Babu G Vidyamandir School",
    url: "/img/Business/delivered_school.webp",
  },
  {
    name: "Patliputra Signature Park",
    url: "https://mbfrobyozijbwglauqop.supabase.co/storage/v1/object/public/project%20images/logo%20and%20other/patliputra_signature_park.png",
  },
];

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
    url: "https://mbfrobyozijbwglauqop.supabase.co/storage/v1/object/public/project%20images/logo%20and%20other/patliputra_signature_park.png",
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
    url: "https://mbfrobyozijbwglauqop.supabase.co/storage/v1/object/public/project%20images/logo%20and%20other/patliputra_signature_park.png",
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
    "delivered" | "ongoing" | "diversified" | "landmarks" | "blogs" | "overview" | "news"
  >("delivered");
  const [deliveredProjects, setDeliveredProjects] = useState<
    DeliveredProject[]
  >([]);
  const [ongoingProjects, setOngoingProjects] = useState<OngoingProject[]>([]);
  const [diversifiedBusinesses, setDiversifiedBusinesses] = useState<
    BusinessSector[]
  >([]);
  const [landmarksList, setLandmarksList] = useState<Landmark[]>([]);
  const [blogsList, setBlogsList] = useState<BlogArticle[]>([]);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);

  // Modals for Adding Projects & News & Diversified & Landmarks & Blogs
  const [showAddDeliveredModal, setShowAddDeliveredModal] = useState(false);
  const [showAddOngoingModal, setShowAddOngoingModal] = useState(false);
  const [showAddDiversifiedModal, setShowAddDiversifiedModal] = useState(false);
  const [showAddLandmarkModal, setShowAddLandmarkModal] = useState(false);
  const [showAddBlogModal, setShowAddBlogModal] = useState(false);
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [showEditNewsModal, setShowEditNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [editingNewsHighlightsStr, setEditingNewsHighlightsStr] = useState("");
  const [confirmDeleteNewsId, setConfirmDeleteNewsId] = useState<string | null>(
    null,
  );

  // Edit Diversified Modal State
  const [showEditDiversifiedModal, setShowEditDiversifiedModal] =
    useState(false);
  const [editingDiversified, setEditingDiversified] =
    useState<BusinessSector | null>(null);
  const [editingDiversifiedFeaturesStr, setEditingDiversifiedFeaturesStr] =
    useState("");
  const [editingDiversifiedHighlightsStr, setEditingDiversifiedHighlightsStr] =
    useState("");
  const [confirmDeleteDiversifiedId, setConfirmDeleteDiversifiedId] = useState<
    string | null
  >(null);

  // Landmarks State & Modals
  const [showEditLandmarkModal, setShowEditLandmarkModal] = useState(false);
  const [editingLandmark, setEditingLandmark] = useState<Landmark | null>(null);
  const [confirmDeleteLandmarkId, setConfirmDeleteLandmarkId] = useState<
    string | null
  >(null);

  // Add Landmark Form State
  const [newLandmark, setNewLandmark] = useState({
    title: "",
    badge: "5 Star Hotel",
    image: "",
  });

  // Blogs State & Modals
  const [showEditBlogModal, setShowEditBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogArticle | null>(null);
  const [editingBlogOffersStr, setEditingBlogOffersStr] = useState("");
  const [editingBlogHighlightsStr, setEditingBlogHighlightsStr] = useState("");
  const [editingBlogWhyInvestStr, setEditingBlogWhyInvestStr] = useState("");
  const [confirmDeleteBlogId, setConfirmDeleteBlogId] = useState<string | null>(null);

  // Add Blog Form State (Every field empty, date set to present date)
  const [newBlog, setNewBlog] = useState(createEmptyBlogState());

  // Add Diversified Form State
  const [newDiversified, setNewDiversified] = useState({
    title: "",
    category: "HOTEL",
    categoryLabel: "4-Star Luxury Business Hotel",
    categoryFilter: "hospitality",
    location: "Exhibition Road, Patna",
    tagline: "Premier 4-Star Hospitality & Grand Banqueting Landmark",
    image: "",
    description: "",
    features:
      "4-Star Executive Rooms, Multi-Cuisine Fine Dine, Grand Banquets, 24/7 Corporate Business Hub",
    stat1Label: "Rating",
    stat1Value: "4-Star",
    stat2Label: "Accommodations",
    stat2Value: "70+ Rooms",
    address: "Exhibition Road, Near Gandhi Maidan, Patna, Bihar 800001",
    contactInfo: "+91 98765 43210",
    highlights:
      "Prime location with seamless transit, Signature Bawarchi restaurant, Dedicated concierge & valet parking",
  });

  // Add News Form State
  const [newNews, setNewNews] = useState({
    category: "clipping" as "clipping" | "release",
    source: "NATIONAL PRESS & DAINIK JAGRAN",
    date: "RECENT COVERAGE",
    headline: "",
    englishTitle: "",
    excerpt: "",
    image: "",
    tag: "NEWSPAPER CLIPPING",
    highlights:
      "उद्घाटन: सांसद मनोज तिवारी, Chi V ग्रेटर नोएडा, 12% अश्योर्ड रिटर्न",
    isClipping: true,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add Delivered Form State
  const [newDelivered, setNewDelivered] = useState({
    name: "",
    location: "Patna",
    image: "",
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
    null,
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

      fetch("/api/admin/diversified")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setDiversifiedBusinesses(data);
          }
        })
        .catch((err) =>
          console.error("Error fetching diversified in admin console:", err),
        );

      fetch("/api/admin/landmarks")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setLandmarksList(data);
          }
        })
        .catch((err) =>
          console.error("Error fetching landmarks in admin console:", err),
        );

      fetch("/api/admin/blogs")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setBlogsList(data);
          }
        })
        .catch((err) =>
          console.error("Error fetching blogs in admin console:", err),
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
        password === DEMO_ADMIN_PASS ||
        password === "Patliputra@signature_Park" ||
        password === "admin123";

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
            amenities:
              amenityList && amenityList.length > 0 ? amenityList : undefined,
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
    if (
      !editingDelivered ||
      !editingDelivered.id ||
      !editingDelivered.name.trim()
    ) {
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
          `✓ Delivered project "${editingDelivered.name}" updated successfully!`,
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
      Array.isArray(project.features) ? project.features.join(", ") : "",
    );
    setEditingOngoingAmenitiesStr(
      Array.isArray(project.amenities)
        ? project.amenities.join(", ")
        : project.amenities || "",
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
          `✓ Ongoing project "${editingOngoing.title}" updated successfully!`,
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
      const res = await fetch(`/api/admin/news?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

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

  // Add Diversified Business
  const handleCreateDiversified = async (e: FormEvent) => {
    e.preventDefault();
    if (!newDiversified.title.trim()) {
      alert("Please enter business vertical title");
      return;
    }

    const featureList = newDiversified.features
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    const highlightList = newDiversified.highlights
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);

    const statsList = [
      {
        label: newDiversified.stat1Label.trim() || "Status",
        value: newDiversified.stat1Value.trim() || "Operational",
      },
      {
        label: newDiversified.stat2Label.trim() || "Location",
        value:
          newDiversified.stat2Value.trim() ||
          newDiversified.location ||
          "Patna",
      },
    ].filter((s) => s.label && s.value);

    try {
      const res = await fetch("/api/admin/diversified", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `diversified-${Date.now()}`,
          order: diversifiedBusinesses.length + 1,
          title: newDiversified.title.trim(),
          category: newDiversified.category,
          categoryLabel:
            newDiversified.categoryLabel.trim() || newDiversified.category,
          categoryFilter: newDiversified.categoryFilter,
          location: newDiversified.location.trim() || "Patna, Bihar",
          tagline: newDiversified.tagline.trim(),
          image: newDiversified.image || DIVERSIFIED_PRESET_IMAGES[0].url,
          description: newDiversified.description.trim(),
          features: featureList,
          stats: statsList,
          address: newDiversified.address.trim(),
          contactInfo: newDiversified.contactInfo.trim(),
          highlights: highlightList,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setDiversifiedBusinesses(data.data);
        setShowAddDiversifiedModal(false);
        setNewDiversified({
          title: "",
          category: "HOTEL",
          categoryLabel: "4-Star Luxury Business Hotel",
          categoryFilter: "hospitality",
          location: "Exhibition Road, Patna",
          tagline: "Premier 4-Star Hospitality & Grand Banqueting Landmark",
          image: DIVERSIFIED_PRESET_IMAGES[0].url,
          description: "",
          features:
            "4-Star Executive Rooms, Multi-Cuisine Fine Dine, Grand Banquets, 24/7 Corporate Business Hub",
          stat1Label: "Rating",
          stat1Value: "4-Star",
          stat2Label: "Accommodations",
          stat2Value: "70+ Rooms",
          address: "Exhibition Road, Near Gandhi Maidan, Patna, Bihar 800001",
          contactInfo: "+91 98765 43210",
          highlights:
            "Prime location with seamless transit, Signature Bawarchi restaurant, Dedicated concierge & valet parking",
        });
        setToastMessage(
          `✓ Business vertical "${newDiversified.title}" published successfully!`,
        );
      } else {
        alert(data.error || "Failed to add diversified business");
      }
    } catch (err) {
      console.error("Error creating diversified business:", err);
      alert("Network error creating business vertical");
    }
  };

  // Open Edit Diversified Modal
  const handleOpenEditDiversified = (b: BusinessSector) => {
    setEditingDiversified({ ...b });
    setEditingDiversifiedFeaturesStr(
      Array.isArray(b.features) ? b.features.join(", ") : "",
    );
    setEditingDiversifiedHighlightsStr(
      Array.isArray(b.highlights) ? b.highlights.join(", ") : "",
    );
    setShowEditDiversifiedModal(true);
  };

  // Submit Edit Diversified Business
  const handleUpdateDiversified = async (e: FormEvent) => {
    e.preventDefault();
    if (
      !editingDiversified ||
      !editingDiversified.id ||
      !editingDiversified.title.trim()
    ) {
      alert("Please enter a valid title.");
      return;
    }

    const featureList = editingDiversifiedFeaturesStr
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    const highlightList = editingDiversifiedHighlightsStr
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/admin/diversified", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingDiversified,
          title: editingDiversified.title.trim(),
          categoryLabel:
            editingDiversified.categoryLabel?.trim() ||
            editingDiversified.category,
          location: editingDiversified.location.trim() || "Patna, Bihar",
          tagline: editingDiversified.tagline?.trim() || "",
          description: editingDiversified.description.trim(),
          features: featureList,
          highlights: highlightList,
          address: editingDiversified.address.trim(),
          contactInfo: editingDiversified.contactInfo.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setDiversifiedBusinesses(data.data);
        setShowEditDiversifiedModal(false);
        setEditingDiversified(null);
        setToastMessage(
          `✓ Business vertical "${editingDiversified.title}" updated successfully!`,
        );
      } else {
        alert(data.error || "Failed to update diversified business");
      }
    } catch (err) {
      console.error("Error updating diversified business:", err);
      alert("Network error updating business vertical");
    }
  };

  // Delete Diversified Business Handler
  const handleDeleteDiversified = async (id: string, title?: string) => {
    try {
      const res = await fetch(
        `/api/admin/diversified?id=${encodeURIComponent(id)}`,
        { method: "DELETE" },
      );

      const data = await res.json();
      if (res.ok && data.success) {
        setDiversifiedBusinesses(data.data);
        setToastMessage(
          `✓ Business vertical "${title || id}" removed successfully.`,
        );
      } else {
        alert(data.error || "Failed to remove business vertical");
      }
    } catch (err) {
      console.error("Error deleting diversified business:", err);
      alert("Network error deleting business vertical");
    }
  };

  // Add Upcoming Landmark Handler
  const handleCreateLandmark = async (e: FormEvent) => {
    e.preventDefault();
    if (!newLandmark.title.trim()) {
      alert("Please enter landmark title");
      return;
    }

    try {
      const res = await fetch("/api/admin/landmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          landmark: {
            id: `landmark-${Date.now()}`,
            order: landmarksList.length + 1,
            title: newLandmark.title.trim(),
            badge: newLandmark.badge.trim() || "5 Star Hotel",
            image: newLandmark.image || LANDMARK_PRESET_IMAGES[0].url,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setLandmarksList(data.data);
        setShowAddLandmarkModal(false);
        setNewLandmark({
          title: "",
          badge: "5 Star Hotel",
          image: LANDMARK_PRESET_IMAGES[0].url,
        });
        setToastMessage(
          `✓ Landmark "${newLandmark.title}" published successfully!`,
        );
      } else {
        alert(data.error || "Failed to add upcoming landmark");
      }
    } catch (err) {
      console.error("Error creating upcoming landmark:", err);
      alert("Network error creating upcoming landmark");
    }
  };

  // Open Edit Landmark Modal
  const handleOpenEditLandmark = (l: Landmark) => {
    setEditingLandmark({ ...l });
    setShowEditLandmarkModal(true);
  };

  // Update Landmark Handler
  const handleUpdateLandmark = async (e: FormEvent) => {
    e.preventDefault();
    if (
      !editingLandmark ||
      !editingLandmark.id ||
      !editingLandmark.title.trim()
    ) {
      alert("Landmark ID and title are required");
      return;
    }

    try {
      const res = await fetch("/api/admin/landmarks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          landmark: {
            id: editingLandmark.id,
            order: editingLandmark.order,
            title: editingLandmark.title.trim(),
            badge: editingLandmark.badge.trim(),
            image: editingLandmark.image,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setLandmarksList(data.data);
        setShowEditLandmarkModal(false);
        setEditingLandmark(null);
        setToastMessage(
          `✓ Landmark "${editingLandmark.title}" updated successfully!`,
        );
      } else {
        alert(data.error || "Failed to update upcoming landmark");
      }
    } catch (err) {
      console.error("Error updating upcoming landmark:", err);
      alert("Network error updating upcoming landmark");
    }
  };

  // Delete Landmark Handler
  const handleDeleteLandmark = async (id: string, title?: string) => {
    try {
      const res = await fetch(
        `/api/admin/landmarks?id=${encodeURIComponent(id)}`,
        { method: "DELETE" },
      );

      const data = await res.json();
      if (res.ok && data.success) {
        setLandmarksList(data.data);
        setToastMessage(`✓ Landmark "${title || id}" removed successfully.`);
      } else {
        alert(data.error || "Failed to remove upcoming landmark");
      }
    } catch (err) {
      console.error("Error deleting upcoming landmark:", err);
      alert("Network error deleting upcoming landmark");
    }
  };

  // Open Add Blog Modal with fresh empty fields and present date
  const handleOpenAddBlogModal = () => {
    setNewBlog(createEmptyBlogState());
    setShowAddBlogModal(true);
  };

  // Add Blog Handler
  const handleCreateBlog = async (e: FormEvent) => {
    e.preventDefault();
    if (!newBlog.title.trim()) {
      alert("Please enter blog title");
      return;
    }

    try {
      const formattedDate =
        formatReadableDate(newBlog.date.trim()) || newBlog.date.trim();

      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blog: {
            id: `blog-${Date.now()}`,
            order: blogsList.length + 1,
            title: newBlog.title.trim(),
            author: newBlog.author.trim() || "Patliputra",
            date: formattedDate,
            image: newBlog.image.trim() || BLOG_PRESET_IMAGES[0].url,
            subtitle: newBlog.subtitle.trim(),
            description: newBlog.description.trim(),
            offers: newBlog.offers
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
            highlights: newBlog.highlights
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
            whyInvest: newBlog.whyInvest
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
            contactPhone: newBlog.contactPhone.trim(),
            patnaOffice: newBlog.patnaOffice.trim(),
            noidaOffice: newBlog.noidaOffice.trim(),
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setBlogsList(data.data);
        setShowAddBlogModal(false);
        setNewBlog(createEmptyBlogState());
        setToastMessage(`✓ Blog "${newBlog.title}" published successfully!`);
      } else {
        alert(data.error || "Failed to publish blog");
      }
    } catch (err) {
      console.error("Error creating blog:", err);
      alert("Network error publishing blog");
    }
  };

  // Open Edit Blog Modal
  const handleOpenEditBlog = (b: BlogArticle) => {
    setEditingBlog({
      ...b,
      date: toInputDateISO(b.date),
    });
    setEditingBlogOffersStr(
      Array.isArray(b.offers) ? b.offers.join("\n") : "",
    );
    setEditingBlogHighlightsStr(
      Array.isArray(b.highlights) ? b.highlights.join("\n") : "",
    );
    setEditingBlogWhyInvestStr(
      Array.isArray(b.whyInvest) ? b.whyInvest.join("\n") : "",
    );
    setShowEditBlogModal(true);
  };

  // Update Blog Handler
  const handleUpdateBlog = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingBlog || !editingBlog.id || !editingBlog.title.trim()) {
      alert("Blog ID and title are required");
      return;
    }

    try {
      const formattedDate =
        formatReadableDate(editingBlog.date.trim()) || editingBlog.date.trim();

      const res = await fetch("/api/admin/blogs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blog: {
            id: editingBlog.id,
            order: editingBlog.order,
            title: editingBlog.title.trim(),
            author: editingBlog.author.trim() || "Patliputra",
            date: formattedDate,
            image: editingBlog.image,
            subtitle: editingBlog.subtitle?.trim() || "",
            description: editingBlog.description?.trim() || "",
            offers: editingBlogOffersStr
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
            highlights: editingBlogHighlightsStr
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
            whyInvest: editingBlogWhyInvestStr
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
            contactPhone: editingBlog.contactPhone?.trim() || "",
            patnaOffice: editingBlog.patnaOffice?.trim() || "",
            noidaOffice: editingBlog.noidaOffice?.trim() || "",
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setBlogsList(data.data);
        setShowEditBlogModal(false);
        setEditingBlog(null);
        setToastMessage(`✓ Blog "${editingBlog.title}" updated successfully!`);
      } else {
        alert(data.error || "Failed to update blog");
      }
    } catch (err) {
      console.error("Error updating blog:", err);
      alert("Network error updating blog");
    }
  };

  // Delete Blog Handler
  const handleDeleteBlog = async (id: string, title?: string) => {
    try {
      const res = await fetch(
        `/api/admin/blogs?id=${encodeURIComponent(id)}`,
        { method: "DELETE" },
      );

      const data = await res.json();
      if (res.ok && data.success) {
        setBlogsList(data.data);
        setToastMessage(`✓ Blog "${title || id}" removed successfully.`);
      } else {
        alert(data.error || "Failed to remove blog");
      }
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert("Network error deleting blog");
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
                src="https://mbfrobyozijbwglauqop.supabase.co/storage/v1/object/public/project%20images/logo%20and%20other/logo_final.png"
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
          isAuthenticated ? styles.mainContainerAuth : styles.mainContainer
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
                    src="https://mbfrobyozijbwglauqop.supabase.co/storage/v1/object/public/project%20images/logo%20and%20other/logo_final.png"
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
                      {diversifiedBusinesses.length} Diversified &bull;{" "}
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
                  <span>Preview Properties</span>
                </Link>
                <Link
                  href="/diversified"
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
                  <span>Preview Diversified</span>
                </Link>
                <Link
                  href="/blogs"
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
                  <span>Preview Blogs</span>
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
                aria-selected={activeTab === "diversified"}
                className={`${styles.tabBtn} ${activeTab === "diversified" ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveTab("diversified")}
              >
                <span>Diversified Businesses</span>
                <span className={styles.tabCountBadge}>
                  {diversifiedBusinesses.length}
                </span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "landmarks"}
                className={`${styles.tabBtn} ${activeTab === "landmarks" ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveTab("landmarks")}
              >
                <span>Upcoming Landmarks</span>
                <span className={styles.tabCountBadge}>
                  {landmarksList.length}
                </span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "blogs"}
                className={`${styles.tabBtn} ${activeTab === "blogs" ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveTab("blogs")}
              >
                <span>Blogs &amp; Offers</span>
                <span className={styles.tabCountBadge}>
                  {blogsList.length}
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
                          Delivered &bull; #
                          {String(p.order || index + 1).padStart(2, "0")}
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
                          {p.tag || "Ongoing"} &bull; #
                          {String(p.order || index + 1).padStart(2, "0")}
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
                          {p.bedrooms !== undefined &&
                            p.bedrooms !== null &&
                            Number(p.bedrooms) > 0 && (
                              <span>
                                BHK: <strong>{p.bedrooms}</strong>
                              </span>
                            )}
                          {p.bathrooms !== undefined &&
                            p.bathrooms !== null &&
                            Number(p.bathrooms) > 0 && (
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

            {/* TAB: DIVERSIFIED BUSINESSES */}
            {activeTab === "diversified" && (
              <div>
                <div className={styles.toolbarRow}>
                  <div className={styles.toolbarTitle}>
                    <span>Diversified Businesses Directory</span>
                    <span className={styles.tabCountBadge}>
                      {diversifiedBusinesses.length} Total
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.addProjectBtn}
                    onClick={() => setShowAddDiversifiedModal(true)}
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
                    <span>Add Business Vertical</span>
                  </button>
                </div>

                {diversifiedBusinesses.length === 0 ? (
                  <div
                    style={{
                      padding: "3rem 1.5rem",
                      textAlign: "center",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px dashed rgba(255,255,255,0.15)",
                      borderRadius: "12px",
                      marginTop: "1.5rem",
                    }}
                  >
                    <p
                      style={{
                        color: "rgba(255,255,255,0.6)",
                        marginBottom: "1rem",
                      }}
                    >
                      No diversified business verticals found in the directory.
                    </p>
                    <button
                      type="button"
                      className={styles.addProjectBtn}
                      onClick={() => setShowAddDiversifiedModal(true)}
                    >
                      + Add First Business Vertical
                    </button>
                  </div>
                ) : (
                  <div className={styles.projectsGrid}>
                    {diversifiedBusinesses.map((b, index) => (
                      <div key={b.id || index} className={styles.projectCard}>
                        <div className={styles.cardMedia}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={b.image} alt={b.title} loading="lazy" />
                          <span className={styles.cardStatusPill}>
                            {b.category} &bull; #
                            {String(b.order || index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <div className={styles.cardBody}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "0.25rem",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.72rem",
                                color: "#deb360",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                              }}
                            >
                              {b.categoryLabel || b.category}
                            </span>
                            <span
                              style={{
                                fontSize: "0.68rem",
                                padding: "2px 7px",
                                borderRadius: "10px",
                                background: "rgba(255,255,255,0.08)",
                                color: "#a5a8bd",
                                textTransform: "capitalize",
                              }}
                            >
                              {b.categoryFilter}
                            </span>
                          </div>
                          <h3 className={styles.cardTitle}>{b.title}</h3>
                          {b.tagline && (
                            <p
                              style={{
                                fontSize: "0.78rem",
                                color: "rgba(255,255,255,0.7)",
                                fontStyle: "italic",
                                marginBottom: "0.45rem",
                              }}
                            >
                              {b.tagline}
                            </p>
                          )}
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
                            <span>{b.location}</span>
                          </div>
                          <p className={styles.cardDescText}>{b.description}</p>

                          {/* Features Pills */}
                          {b.features && b.features.length > 0 && (
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "4px",
                                margin: "0.6rem 0",
                              }}
                            >
                              {b.features.slice(0, 3).map((feat, fIdx) => (
                                <span
                                  key={fIdx}
                                  style={{
                                    fontSize: "0.68rem",
                                    background: "rgba(222, 179, 96, 0.12)",
                                    border:
                                      "1px solid rgba(222, 179, 96, 0.25)",
                                    color: "#deb360",
                                    padding: "2px 6px",
                                    borderRadius: "3px",
                                  }}
                                >
                                  ✓ {feat}
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
                              ID: {b.id}
                            </span>
                            <div className={styles.cardActionBtns}>
                              <button
                                type="button"
                                className={styles.editCardBtn}
                                onClick={() => handleOpenEditDiversified(b)}
                                title="Edit business vertical"
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

                              {confirmDeleteDiversifiedId === b.id ? (
                                <div className={styles.deleteConfirmGroup}>
                                  <button
                                    type="button"
                                    className={styles.deleteConfirmBtn}
                                    onClick={() => {
                                      setConfirmDeleteDiversifiedId(null);
                                      handleDeleteDiversified(b.id, b.title);
                                    }}
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    type="button"
                                    className={styles.deleteCancelBtn}
                                    onClick={() =>
                                      setConfirmDeleteDiversifiedId(null)
                                    }
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  className={styles.deleteCardBtn}
                                  onClick={() =>
                                    setConfirmDeleteDiversifiedId(b.id)
                                  }
                                  title="Remove business vertical"
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
                )}
              </div>
            )}

            {/* TAB: UPCOMING LANDMARKS */}
            {activeTab === "landmarks" && (
              <div>
                <div className={styles.toolbarRow}>
                  <div className={styles.toolbarTitle}>
                    <span>Upcoming Landmarks Directory</span>
                    <span className={styles.tabCountBadge}>
                      {landmarksList.length} Total
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.addProjectBtn}
                    onClick={() => setShowAddLandmarkModal(true)}
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
                    <span>Add Upcoming Landmark</span>
                  </button>
                </div>

                {landmarksList.length === 0 ? (
                  <div
                    style={{
                      padding: "3rem 1.5rem",
                      textAlign: "center",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px dashed rgba(255,255,255,0.15)",
                      borderRadius: "12px",
                      marginTop: "1.5rem",
                    }}
                  >
                    <p
                      style={{
                        color: "rgba(255,255,255,0.6)",
                        marginBottom: "1rem",
                      }}
                    >
                      No upcoming landmarks found in the directory.
                    </p>
                    <button
                      type="button"
                      className={styles.addProjectBtn}
                      onClick={() => setShowAddLandmarkModal(true)}
                    >
                      + Add First Landmark
                    </button>
                  </div>
                ) : (
                  <div className={styles.projectsGrid}>
                    {landmarksList.map((l, index) => (
                      <div key={l.id || index} className={styles.projectCard}>
                        <div className={styles.cardMedia}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={l.image} alt={l.title} loading="lazy" />
                          <span className={styles.cardStatusPill}>
                            {l.badge} &bull; #
                            {String(l.order || index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <div className={styles.cardBody}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "0.25rem",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.72rem",
                                color: "#deb360",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                              }}
                            >
                              {l.badge}
                            </span>
                            <span
                              style={{
                                fontSize: "0.68rem",
                                padding: "2px 7px",
                                borderRadius: "10px",
                                background: "rgba(255,255,255,0.08)",
                                color: "#a5a8bd",
                              }}
                            >
                              Position #{l.order || index + 1}
                            </span>
                          </div>
                          <h3 className={styles.cardTitle}>{l.title}</h3>

                          <div className={styles.cardFooterAction}>
                            <span
                              style={{
                                fontSize: "0.72rem",
                                color: "rgba(255,255,255,0.4)",
                              }}
                            >
                              ID: {l.id}
                            </span>
                            <div className={styles.cardActionBtns}>
                              <button
                                type="button"
                                className={styles.editCardBtn}
                                onClick={() => handleOpenEditLandmark(l)}
                                title="Edit landmark"
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

                              {confirmDeleteLandmarkId === l.id ? (
                                <div className={styles.deleteConfirmGroup}>
                                  <button
                                    type="button"
                                    className={styles.deleteConfirmBtn}
                                    onClick={() => {
                                      setConfirmDeleteLandmarkId(null);
                                      handleDeleteLandmark(l.id, l.title);
                                    }}
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    type="button"
                                    className={styles.deleteCancelBtn}
                                    onClick={() =>
                                      setConfirmDeleteLandmarkId(null)
                                    }
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  className={styles.deleteCardBtn}
                                  onClick={() =>
                                    setConfirmDeleteLandmarkId(l.id)
                                  }
                                  title="Remove upcoming landmark"
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
                )}
              </div>
            )}

            {/* TAB: BLOGS & ARTICLES */}
            {activeTab === "blogs" && (
              <div>
                <div className={styles.toolbarRow}>
                  <div className={styles.toolbarTitle}>
                    <span>Corporate Blogs &amp; Offers Directory</span>
                    <span className={styles.tabCountBadge}>
                      {blogsList.length} Total
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.addProjectBtn}
                    onClick={handleOpenAddBlogModal}
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
                    <span>Publish New Blog</span>
                  </button>
                </div>

                {blogsList.length === 0 ? (
                  <div
                    style={{
                      padding: "3rem 1.5rem",
                      textAlign: "center",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px dashed rgba(255,255,255,0.15)",
                      borderRadius: "12px",
                      marginTop: "1.5rem",
                    }}
                  >
                    <p
                      style={{
                        color: "rgba(255,255,255,0.6)",
                        marginBottom: "1rem",
                      }}
                    >
                      No blogs or announcements found in the directory.
                    </p>
                    <button
                      type="button"
                      className={styles.addProjectBtn}
                      onClick={handleOpenAddBlogModal}
                    >
                      + Add First Blog
                    </button>
                  </div>
                ) : (
                  <div className={styles.projectsGrid}>
                    {blogsList.map((b, index) => (
                      <div key={b.id || index} className={styles.projectCard}>
                        <div className={styles.cardMedia}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={b.image} alt={b.title} loading="lazy" />
                          <span className={styles.cardStatusPill}>
                            {b.date} &bull; #
                            {String(b.order || index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <div className={styles.cardBody}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "0.25rem",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.72rem",
                                color: "#deb360",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                              }}
                            >
                              By {b.author || "Patliputra"}
                            </span>
                            <span
                              style={{
                                fontSize: "0.68rem",
                                padding: "2px 7px",
                                borderRadius: "10px",
                                background: "rgba(255,255,255,0.08)",
                                color: "#a5a8bd",
                              }}
                            >
                              #{b.order || index + 1}
                            </span>
                          </div>
                          <h3 className={styles.cardTitle}>{b.title}</h3>
                          {b.subtitle && (
                            <p
                              style={{
                                fontSize: "0.78rem",
                                color: "rgba(255,255,255,0.7)",
                                fontStyle: "italic",
                                marginBottom: "0.45rem",
                              }}
                            >
                              {b.subtitle}
                            </p>
                          )}
                          <p className={styles.cardDescText}>{b.description}</p>

                          {/* Offers summary pills */}
                          {b.offers && b.offers.length > 0 && (
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "4px",
                                margin: "0.5rem 0",
                              }}
                            >
                              {b.offers.slice(0, 2).map((off, oIdx) => (
                                <span
                                  key={oIdx}
                                  style={{
                                    fontSize: "0.68rem",
                                    background: "rgba(222, 179, 96, 0.12)",
                                    border: "1px solid rgba(222, 179, 96, 0.25)",
                                    color: "#deb360",
                                    padding: "2px 6px",
                                    borderRadius: "3px",
                                  }}
                                >
                                  💼 {off}
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
                              ID: {b.id}
                            </span>
                            <div className={styles.cardActionBtns}>
                              <button
                                type="button"
                                className={styles.editCardBtn}
                                onClick={() => handleOpenEditBlog(b)}
                                title="Edit blog post"
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

                              {confirmDeleteBlogId === b.id ? (
                                <div className={styles.deleteConfirmGroup}>
                                  <button
                                    type="button"
                                    className={styles.deleteConfirmBtn}
                                    onClick={() => {
                                      setConfirmDeleteBlogId(null);
                                      handleDeleteBlog(b.id, b.title);
                                    }}
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    type="button"
                                    className={styles.deleteCancelBtn}
                                    onClick={() => setConfirmDeleteBlogId(null)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  className={styles.deleteCardBtn}
                                  onClick={() => setConfirmDeleteBlogId(b.id)}
                                  title="Remove blog post"
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
                )}
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
                      Active Ongoing Developments
                    </div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statValue}>
                      {diversifiedBusinesses.length}
                    </div>
                    <div className={styles.statLabel}>
                      Diversified Business Verticals
                    </div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statValue}>
                      {landmarksList.length}
                    </div>
                    <div className={styles.statLabel}>
                      Upcoming Iconic Landmarks
                    </div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statValue}>
                      {blogsList.length}
                    </div>
                    <div className={styles.statLabel}>
                      Corporate Blogs &amp; Offers
                    </div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statValue}>
                      {newsArticles.length}
                    </div>
                    <div className={styles.statLabel}>
                      Published News Articles
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
                  style={{
                    marginTop: "2rem",
                    display: "flex",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <Link
                    href="/properties"
                    className={styles.submitBtn}
                    style={{ maxWidth: "260px", textDecoration: "none" }}
                  >
                    View Properties Portal
                  </Link>
                  <Link
                    href="/diversified"
                    className={styles.btnSecondary}
                    style={{ maxWidth: "260px", textDecoration: "none" }}
                    target="_blank"
                  >
                    View Diversified Portal
                  </Link>
                  <Link
                    href="/blogs"
                    className={styles.btnSecondary}
                    style={{ maxWidth: "260px", textDecoration: "none" }}
                    target="_blank"
                  >
                    View Blogs Portal
                  </Link>
                  <Link
                    href="/#landmarks"
                    className={styles.btnSecondary}
                    style={{ maxWidth: "260px", textDecoration: "none" }}
                    target="_blank"
                  >
                    View Landmarks Carousel
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
                      news articles in this directory are live-extracted into
                      the global website <strong>Footer</strong>, while all
                      published items appear with high-res clipping zoom on the
                      public <strong>/media</strong> portal.
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
                      Order Position: #
                      {String(deliveredProjects.length + 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      (First added remains #01 &bull; new project is appended
                      sequentially)
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
                  <ImageUpload
                    label="Project Photo / Image"
                    value={newDelivered.image}
                    onChange={(url) =>
                      setNewDelivered({ ...newDelivered, image: url })
                    }
                    folder="Projects"
                    required
                    hint="Upload from device"
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
                      Order Position: #
                      {String(ongoingProjects.length + 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      (First added remains #01 &bull; new project is appended
                      sequentially)
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
                          bedrooms: e.target.value
                            ? Number(e.target.value)
                            : "",
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
                          bathrooms: e.target.value
                            ? Number(e.target.value)
                            : "",
                        })
                      }
                    />
                  </div>
                </div>

                <div className={styles.formField}>
                  <ImageUpload
                    label="Development Banner Image"
                    value={newOngoing.image}
                    onChange={(url) =>
                      setNewOngoing({ ...newOngoing, image: url })
                    }
                    folder="Projects"
                    required
                    hint="Upload from device"
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
                      setNewOngoing({
                        ...newOngoing,
                        amenities: e.target.value,
                      })
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
                      Project #
                      {String(editingDelivered.order || 1).padStart(2, "0")}
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
                  <ImageUpload
                    label="Project Photo / Image"
                    value={editingDelivered.image}
                    onChange={(url) =>
                      setEditingDelivered({
                        ...editingDelivered,
                        image: url,
                      })
                    }
                    folder="Projects"
                    required
                    hint="Upload from device"
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
                  <h3 className={styles.modalTitle}>
                    Edit Ongoing Development
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
                      Project #
                      {String(editingOngoing.order || 1).padStart(2, "0")}
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
                          bedrooms: e.target.value
                            ? Number(e.target.value)
                            : undefined,
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
                          bathrooms: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                    />
                  </div>
                </div>

                <div className={styles.formField}>
                  <ImageUpload
                    label="Development Banner Image"
                    value={editingOngoing.image}
                    onChange={(url) =>
                      setEditingOngoing({
                        ...editingOngoing,
                        image: url,
                      })
                    }
                    folder="Projects"
                    required
                    hint="Upload from device"
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
                    value={
                      editingOngoing.about || editingOngoing.description || ""
                    }
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
                  <ImageUpload
                    label="Media Press / Clipping Image"
                    value={newNews.image}
                    onChange={(url) =>
                      setNewNews({ ...newNews, image: url })
                    }
                    folder="News"
                    required
                    hint="Upload from device"
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
                  <ImageUpload
                    label="Media Press / Clipping Image"
                    value={editingNews.image}
                    onChange={(url) =>
                      setEditingNews({ ...editingNews, image: url })
                    }
                    folder="News"
                    required
                    hint="Upload from device"
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

        {/* MODAL: ADD DIVERSIFIED BUSINESS VERTICAL */}
        {showAddDiversifiedModal && (
          <div
            className={styles.modalBackdrop}
            onClick={() => setShowAddDiversifiedModal(false)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <div>
                  <h3 className={styles.modalTitle}>
                    Add Business Vertical / Project
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
                      Position: #
                      {String(diversifiedBusinesses.length + 1).padStart(
                        2,
                        "0",
                      )}
                    </span>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      (Appended sequentially to diversified directory)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.modalCloseBtn}
                  onClick={() => setShowAddDiversifiedModal(false)}
                >
                  &times;
                </button>
              </div>

              <form
                onSubmit={handleCreateDiversified}
                className={styles.modalForm}
              >
                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label>Vertical Title / Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Hotel Patliputra Exotica"
                      value={newDiversified.title}
                      onChange={(e) =>
                        setNewDiversified({
                          ...newDiversified,
                          title: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Industry Category *</label>
                    <select
                      value={newDiversified.category}
                      onChange={(e) =>
                        setNewDiversified({
                          ...newDiversified,
                          category: e.target.value,
                        })
                      }
                      style={{
                        background: "rgba(20, 20, 36, 0.9)",
                        border: "1px solid rgba(200, 164, 92, 0.3)",
                        color: "#fff",
                        borderRadius: "8px",
                        padding: "0.6rem 0.8rem",
                        fontSize: "0.9rem",
                      }}
                    >
                      <option value="HOTEL">HOTEL</option>
                      <option value="RESORT">RESORT</option>
                      <option value="HOSPITAL">HOSPITAL</option>
                      <option value="SCHOOL">SCHOOL</option>
                      <option value="COMMERCIAL">COMMERCIAL</option>
                      <option value="HEALTHCARE">HEALTHCARE</option>
                      <option value="EDUCATION">EDUCATION</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label>Category Label (Subtitle)</label>
                    <input
                      type="text"
                      placeholder="e.g. 4-Star Luxury Business Hotel"
                      value={newDiversified.categoryLabel}
                      onChange={(e) =>
                        setNewDiversified({
                          ...newDiversified,
                          categoryLabel: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Directory Filter *</label>
                    <select
                      value={newDiversified.categoryFilter}
                      onChange={(e) =>
                        setNewDiversified({
                          ...newDiversified,
                          categoryFilter: e.target.value,
                        })
                      }
                      style={{
                        background: "rgba(20, 20, 36, 0.9)",
                        border: "1px solid rgba(200, 164, 92, 0.3)",
                        color: "#fff",
                        borderRadius: "8px",
                        padding: "0.6rem 0.8rem",
                        fontSize: "0.9rem",
                      }}
                    >
                      <option value="hospitality">
                        Hospitality (Hotels &amp; Resorts)
                      </option>
                      <option value="healthcare">
                        Healthcare (Hospitals &amp; Clinics)
                      </option>
                      <option value="education">
                        Education (Schools &amp; Academies)
                      </option>
                      <option value="other">Other Verticals</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label>City &amp; Location *</label>
                    <input
                      type="text"
                      placeholder="e.g. Exhibition Road, Patna"
                      value={newDiversified.location}
                      onChange={(e) =>
                        setNewDiversified({
                          ...newDiversified,
                          location: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Hero Tagline</label>
                    <input
                      type="text"
                      placeholder="e.g. Premier 4-Star Hospitality & Grand Banqueting Landmark"
                      value={newDiversified.tagline}
                      onChange={(e) =>
                        setNewDiversified({
                          ...newDiversified,
                          tagline: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className={styles.formField}>
                  <ImageUpload
                    label="Business Vertical Photo"
                    value={newDiversified.image}
                    onChange={(url) =>
                      setNewDiversified({ ...newDiversified, image: url })
                    }
                    folder="Diversified"
                    required
                    hint="Upload from device"
                  />
                </div>

                <div className={styles.formField}>
                  <label>Full Overview &amp; Description *</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the venture, amenities, architecture, and significance to Patliputra Group..."
                    value={newDiversified.description}
                    onChange={(e) =>
                      setNewDiversified({
                        ...newDiversified,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label>Physical Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Exhibition Road, Near Gandhi Maidan, Patna"
                      value={newDiversified.address}
                      onChange={(e) =>
                        setNewDiversified({
                          ...newDiversified,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Direct Contact Phone</label>
                    <input
                      type="text"
                      placeholder="e.g. +91 98765 43210"
                      value={newDiversified.contactInfo}
                      onChange={(e) =>
                        setNewDiversified({
                          ...newDiversified,
                          contactInfo: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className={styles.formField}>
                  <label>Key Features (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. 4-Star Executive Rooms, Multi-Cuisine Fine Dine, Grand Banquets"
                    value={newDiversified.features}
                    onChange={(e) =>
                      setNewDiversified({
                        ...newDiversified,
                        features: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>Key Highlights (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Prime location with seamless transit, 24/7 Concierge, Valet parking"
                    value={newDiversified.highlights}
                    onChange={(e) =>
                      setNewDiversified({
                        ...newDiversified,
                        highlights: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label>Stat 1 (Label &bull; Value)</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        type="text"
                        placeholder="Label (e.g. Rating)"
                        value={newDiversified.stat1Label}
                        onChange={(e) =>
                          setNewDiversified({
                            ...newDiversified,
                            stat1Label: e.target.value,
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 4-Star)"
                        value={newDiversified.stat1Value}
                        onChange={(e) =>
                          setNewDiversified({
                            ...newDiversified,
                            stat1Value: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className={styles.formField}>
                    <label>Stat 2 (Label &bull; Value)</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        type="text"
                        placeholder="Label (e.g. Accommodations)"
                        value={newDiversified.stat2Label}
                        onChange={(e) =>
                          setNewDiversified({
                            ...newDiversified,
                            stat2Label: e.target.value,
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 70+ Rooms)"
                        value={newDiversified.stat2Value}
                        onChange={(e) =>
                          setNewDiversified({
                            ...newDiversified,
                            stat2Value: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.btnCancel}
                    onClick={() => setShowAddDiversifiedModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.btnSubmit}>
                    Publish Business Vertical
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT DIVERSIFIED BUSINESS VERTICAL */}
        {showEditDiversifiedModal && editingDiversified && (
          <div
            className={styles.modalBackdrop}
            onClick={() => setShowEditDiversifiedModal(false)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <div>
                  <h3 className={styles.modalTitle}>Edit Business Vertical</h3>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(255,255,255,0.5)",
                      marginTop: "4px",
                    }}
                  >
                    ID: {editingDiversified.id}
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.modalCloseBtn}
                  onClick={() => setShowEditDiversifiedModal(false)}
                >
                  &times;
                </button>
              </div>

              <form
                onSubmit={handleUpdateDiversified}
                className={styles.modalForm}
              >
                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label>Vertical Title / Name *</label>
                    <input
                      type="text"
                      value={editingDiversified.title}
                      onChange={(e) =>
                        setEditingDiversified({
                          ...editingDiversified,
                          title: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Industry Category</label>
                    <select
                      value={editingDiversified.category}
                      onChange={(e) =>
                        setEditingDiversified({
                          ...editingDiversified,
                          category: e.target.value,
                        })
                      }
                      style={{
                        background: "rgba(20, 20, 36, 0.9)",
                        border: "1px solid rgba(200, 164, 92, 0.3)",
                        color: "#fff",
                        borderRadius: "8px",
                        padding: "0.6rem 0.8rem",
                        fontSize: "0.9rem",
                      }}
                    >
                      <option value="HOTEL">HOTEL</option>
                      <option value="RESORT">RESORT</option>
                      <option value="HOSPITAL">HOSPITAL</option>
                      <option value="SCHOOL">SCHOOL</option>
                      <option value="COMMERCIAL">COMMERCIAL</option>
                      <option value="HEALTHCARE">HEALTHCARE</option>
                      <option value="EDUCATION">EDUCATION</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label>Category Label (Subtitle)</label>
                    <input
                      type="text"
                      value={editingDiversified.categoryLabel}
                      onChange={(e) =>
                        setEditingDiversified({
                          ...editingDiversified,
                          categoryLabel: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Directory Filter</label>
                    <select
                      value={editingDiversified.categoryFilter}
                      onChange={(e) =>
                        setEditingDiversified({
                          ...editingDiversified,
                          categoryFilter: e.target.value,
                        })
                      }
                      style={{
                        background: "rgba(20, 20, 36, 0.9)",
                        border: "1px solid rgba(200, 164, 92, 0.3)",
                        color: "#fff",
                        borderRadius: "8px",
                        padding: "0.6rem 0.8rem",
                        fontSize: "0.9rem",
                      }}
                    >
                      <option value="hospitality">
                        Hospitality (Hotels &amp; Resorts)
                      </option>
                      <option value="healthcare">
                        Healthcare (Hospitals &amp; Clinics)
                      </option>
                      <option value="education">
                        Education (Schools &amp; Academies)
                      </option>
                      <option value="other">Other Verticals</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label>Location</label>
                    <input
                      type="text"
                      value={editingDiversified.location}
                      onChange={(e) =>
                        setEditingDiversified({
                          ...editingDiversified,
                          location: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Tagline</label>
                    <input
                      type="text"
                      value={editingDiversified.tagline}
                      onChange={(e) =>
                        setEditingDiversified({
                          ...editingDiversified,
                          tagline: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className={styles.formField}>
                  <ImageUpload
                    label="Business Vertical Photo"
                    value={editingDiversified.image}
                    onChange={(url) =>
                      setEditingDiversified({
                        ...editingDiversified,
                        image: url,
                      })
                    }
                    folder="Diversified"
                    required
                    hint="Upload from device"
                  />
                </div>

                <div className={styles.formField}>
                  <label>Description *</label>
                  <textarea
                    rows={3}
                    value={editingDiversified.description}
                    onChange={(e) =>
                      setEditingDiversified({
                        ...editingDiversified,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label>Physical Address</label>
                    <input
                      type="text"
                      value={editingDiversified.address}
                      onChange={(e) =>
                        setEditingDiversified({
                          ...editingDiversified,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Contact Phone</label>
                    <input
                      type="text"
                      value={editingDiversified.contactInfo}
                      onChange={(e) =>
                        setEditingDiversified({
                          ...editingDiversified,
                          contactInfo: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className={styles.formField}>
                  <label>Key Features (comma-separated)</label>
                  <input
                    type="text"
                    value={editingDiversifiedFeaturesStr}
                    onChange={(e) =>
                      setEditingDiversifiedFeaturesStr(e.target.value)
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>Key Highlights (comma-separated)</label>
                  <input
                    type="text"
                    value={editingDiversifiedHighlightsStr}
                    onChange={(e) =>
                      setEditingDiversifiedHighlightsStr(e.target.value)
                    }
                  />
                </div>

                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.btnCancel}
                    onClick={() => setShowEditDiversifiedModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.btnSubmit}>
                    Update Business Vertical
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD UPCOMING LANDMARK */}
        {showAddLandmarkModal && (
          <div
            className={styles.modalBackdrop}
            onClick={() => setShowAddLandmarkModal(false)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <div>
                  <h3 className={styles.modalTitle}>Add Upcoming Landmark</h3>
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
                      Position: #
                      {String(landmarksList.length + 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      (Appended sequentially to upcoming landmarks carousel)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.modalCloseBtn}
                  onClick={() => setShowAddLandmarkModal(false)}
                >
                  &times;
                </button>
              </div>

              <form
                onSubmit={handleCreateLandmark}
                className={styles.modalForm}
              >
                <div className={styles.formField}>
                  <label>Landmark Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 Star Hotel in Mussoorie, Luxury Mall in Patna"
                    value={newLandmark.title}
                    onChange={(e) =>
                      setNewLandmark({ ...newLandmark, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className={styles.formField}>
                  <label>Badge / Category Label</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 Star Hotel, Park, Luxury Commercial, Resort"
                    value={newLandmark.badge}
                    onChange={(e) =>
                      setNewLandmark({ ...newLandmark, badge: e.target.value })
                    }
                  />
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      marginTop: "6px",
                    }}
                  >
                    {[
                      "5 Star Hotel",
                      "Park",
                      "Luxury Commercial",
                      "Resort",
                      "Mega Convention",
                    ].map((quickBadge) => (
                      <button
                        key={quickBadge}
                        type="button"
                        onClick={() =>
                          setNewLandmark({ ...newLandmark, badge: quickBadge })
                        }
                        style={{
                          fontSize: "0.72rem",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          background:
                            newLandmark.badge === quickBadge
                              ? "rgba(222, 179, 96, 0.25)"
                              : "rgba(255, 255, 255, 0.05)",
                          border:
                            newLandmark.badge === quickBadge
                              ? "1px solid #deb360"
                              : "1px solid rgba(255, 255, 255, 0.15)",
                          color:
                            newLandmark.badge === quickBadge
                              ? "#deb360"
                              : "#bbb",
                          cursor: "pointer",
                        }}
                      >
                        {quickBadge}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.formField}>
                  <ImageUpload
                    label="Landmark Photo / Image"
                    value={newLandmark.image}
                    onChange={(url) =>
                      setNewLandmark({ ...newLandmark, image: url })
                    }
                    folder="Landmarks"
                    required
                    hint="Upload from device"
                  />
                </div>

                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.btnCancel}
                    onClick={() => setShowAddLandmarkModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.btnSubmit}>
                    Publish Landmark
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT UPCOMING LANDMARK */}
        {showEditLandmarkModal && editingLandmark && (
          <div
            className={styles.modalBackdrop}
            onClick={() => setShowEditLandmarkModal(false)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <div>
                  <h3 className={styles.modalTitle}>Edit Upcoming Landmark</h3>
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
                      ID: {editingLandmark.id}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.modalCloseBtn}
                  onClick={() => setShowEditLandmarkModal(false)}
                >
                  &times;
                </button>
              </div>

              <form
                onSubmit={handleUpdateLandmark}
                className={styles.modalForm}
              >
                <div className={styles.formRow}>
                  <div className={styles.formField} style={{ flex: 1 }}>
                    <label>Position / Order Index</label>
                    <input
                      type="number"
                      disabled
                      value={editingLandmark.order ?? 0}
                      onChange={(e) =>
                        setEditingLandmark({
                          ...editingLandmark,
                          order: parseInt(e.target.value) || 0,
                        })
                      }
                      min={1}
                    />
                  </div>
                  <div className={styles.formField} style={{ flex: 2 }}>
                    <label>Badge / Category</label>
                    <input
                      type="text"
                      value={editingLandmark.badge}
                      onChange={(e) =>
                        setEditingLandmark({
                          ...editingLandmark,
                          badge: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className={styles.formField}>
                  <label>Landmark Title *</label>
                  <input
                    type="text"
                    value={editingLandmark.title}
                    onChange={(e) =>
                      setEditingLandmark({
                        ...editingLandmark,
                        title: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className={styles.formField}>
                  <ImageUpload
                    label="Landmark Photo / Image"
                    value={editingLandmark.image}
                    onChange={(url) =>
                      setEditingLandmark({ ...editingLandmark, image: url })
                    }
                    folder="Landmarks"
                    required
                    hint="Upload from device"
                  />
                </div>

                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.btnCancel}
                    onClick={() => setShowEditLandmarkModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.btnSubmit}>
                    Update Landmark
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD NEW BLOG & ANNOUNCEMENT */}
        {showAddBlogModal && (
          <div
            className={styles.modalBackdrop}
            onClick={() => setShowAddBlogModal(false)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <div>
                  <h3 className={styles.modalTitle}>Publish Corporate Blog / Offer</h3>
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
                      Position: #{String(blogsList.length + 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      (Displayed on public /blogs portal with interactive detail modal)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.modalCloseBtn}
                  onClick={() => setShowAddBlogModal(false)}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleCreateBlog} className={styles.modalForm}>
                <div className={styles.formRow}>
                  <div className={styles.formField} style={{ flex: 2 }}>
                    <label>Blog Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. After Our Remarkable Success In Bihar"
                      value={newBlog.title}
                      onChange={(e) =>
                        setNewBlog({ ...newBlog, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className={styles.formField} style={{ flex: 1 }}>
                    <label>Author</label>
                    <input
                      type="text"
                      placeholder="e.g. Patliputra"
                      value={newBlog.author}
                      onChange={(e) =>
                        setNewBlog({ ...newBlog, author: e.target.value })
                      }
                    />
                  </div>
                  <div className={styles.formField} style={{ flex: 1 }}>
                    <label>Publish Date * (Calendar)</label>
                    <input
                      type="date"
                      value={newBlog.date}
                      onChange={(e) =>
                        setNewBlog({ ...newBlog, date: e.target.value })
                      }
                      style={{ colorScheme: "dark" }}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formField}>
                  <label>Subtitle / Headline</label>
                  <input
                    type="text"
                    placeholder="e.g. Patliputra Signature Park – Now in Greater Noida!"
                    value={newBlog.subtitle}
                    onChange={(e) =>
                      setNewBlog({ ...newBlog, subtitle: e.target.value })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>Introduction &amp; Overview Description</label>
                  <textarea
                    rows={3}
                    placeholder="Write introduction paragraph explaining the announcement..."
                    value={newBlog.description}
                    onChange={(e) =>
                      setNewBlog({ ...newBlog, description: e.target.value })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <ImageUpload
                    label="Blog Flyer / Poster Image"
                    value={newBlog.image}
                    onChange={(url) => setNewBlog({ ...newBlog, image: url })}
                    folder="Blogs"
                    required
                    hint="Upload from device"
                  />
                </div>

                <div className={styles.formField}>
                  <label>💼 Limited-Time Investment Offers (One bullet per line)</label>
                  <textarea
                    rows={3}
                    placeholder="12% Assured Return Till Possession&#10;Offer valid only till 30th June 2025&#10;RERA Approved Project (UPRERAPRJ422327/10/2024)"
                    value={newBlog.offers}
                    onChange={(e) =>
                      setNewBlog({ ...newBlog, offers: e.target.value })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>📍 Project Highlights (One bullet per line)</label>
                  <textarea
                    rows={3}
                    placeholder="Premium Studio Apartments, Office Spaces &amp; Retail Shops&#10;Located in Sector Chi V, Greater Noida"
                    value={newBlog.highlights}
                    onChange={(e) =>
                      setNewBlog({ ...newBlog, highlights: e.target.value })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <label>💡 Why Invest Now? (One bullet per line)</label>
                  <textarea
                    rows={3}
                    placeholder="High returns with low entry point&#10;Fully secure, RERA-compliant project&#10;Assured rental income before possession"
                    value={newBlog.whyInvest}
                    onChange={(e) =>
                      setNewBlog({ ...newBlog, whyInvest: e.target.value })
                    }
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label>Contact Phone</label>
                    <input
                      type="text"
                      placeholder="e.g. +91 9771417077"
                      value={newBlog.contactPhone}
                      onChange={(e) =>
                        setNewBlog({ ...newBlog, contactPhone: e.target.value })
                      }
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Patna Office Address</label>
                    <input
                      type="text"
                      placeholder="e.g. 301, Maharaja Kameshwar Complex, Frazer Road, Patna"
                      value={newBlog.patnaOffice}
                      onChange={(e) =>
                        setNewBlog({ ...newBlog, patnaOffice: e.target.value })
                      }
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Greater Noida Office Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Plot No. INS - 02, Sector - Chi V, Greater Noida"
                      value={newBlog.noidaOffice}
                      onChange={(e) =>
                        setNewBlog({ ...newBlog, noidaOffice: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.btnCancel}
                    onClick={() => setShowAddBlogModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.btnSubmit}>
                    Publish Blog Article
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT BLOG & ANNOUNCEMENT */}
        {showEditBlogModal && editingBlog && (
          <div
            className={styles.modalBackdrop}
            onClick={() => setShowEditBlogModal(false)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <div>
                  <h3 className={styles.modalTitle}>Edit Blog Article / Offer</h3>
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
                      ID: {editingBlog.id}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.modalCloseBtn}
                  onClick={() => setShowEditBlogModal(false)}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleUpdateBlog} className={styles.modalForm}>
                <div className={styles.formRow}>
                  <div className={styles.formField} style={{ flex: 1 }}>
                    <label>Position Index</label>
                    <input
                      type="number"
                      value={editingBlog.order ?? 0}
                      onChange={(e) =>
                        setEditingBlog({
                          ...editingBlog,
                          order: parseInt(e.target.value) || 0,
                        })
                      }
                      min={1}
                    />
                  </div>
                  <div className={styles.formField} style={{ flex: 2 }}>
                    <label>Blog Title *</label>
                    <input
                      type="text"
                      value={editingBlog.title}
                      onChange={(e) =>
                        setEditingBlog({
                          ...editingBlog,
                          title: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className={styles.formField} style={{ flex: 1 }}>
                    <label>Author</label>
                    <input
                      type="text"
                      value={editingBlog.author}
                      onChange={(e) =>
                        setEditingBlog({
                          ...editingBlog,
                          author: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formField} style={{ flex: 1 }}>
                    <label>Publish Date * (Calendar)</label>
                    <input
                      type="date"
                      value={editingBlog.date}
                      onChange={(e) =>
                        setEditingBlog({
                          ...editingBlog,
                          date: e.target.value,
                        })
                      }
                      style={{ colorScheme: "dark" }}
                      required
                    />
                  </div>
                  <div className={styles.formField} style={{ flex: 2 }}>
                    <label>Subtitle / Headline</label>
                    <input
                      type="text"
                      value={editingBlog.subtitle || ""}
                      onChange={(e) =>
                        setEditingBlog({
                          ...editingBlog,
                          subtitle: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className={styles.formField}>
                  <label>Introduction &amp; Overview Description</label>
                  <textarea
                    rows={3}
                    value={editingBlog.description || ""}
                    onChange={(e) =>
                      setEditingBlog({
                        ...editingBlog,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <ImageUpload
                    label="Blog Flyer / Poster Image"
                    value={editingBlog.image}
                    onChange={(url) => setEditingBlog({ ...editingBlog, image: url })}
                    folder="Blogs"
                    required
                    hint="Upload from device"
                  />
                </div>

                <div className={styles.formField}>
                  <label>💼 Limited-Time Investment Offers (One bullet per line)</label>
                  <textarea
                    rows={3}
                    value={editingBlogOffersStr}
                    onChange={(e) => setEditingBlogOffersStr(e.target.value)}
                  />
                </div>

                <div className={styles.formField}>
                  <label>📍 Project Highlights (One bullet per line)</label>
                  <textarea
                    rows={3}
                    value={editingBlogHighlightsStr}
                    onChange={(e) => setEditingBlogHighlightsStr(e.target.value)}
                  />
                </div>

                <div className={styles.formField}>
                  <label>💡 Why Invest Now? (One bullet per line)</label>
                  <textarea
                    rows={3}
                    value={editingBlogWhyInvestStr}
                    onChange={(e) => setEditingBlogWhyInvestStr(e.target.value)}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label>Contact Phone</label>
                    <input
                      type="text"
                      value={editingBlog.contactPhone || ""}
                      onChange={(e) =>
                        setEditingBlog({
                          ...editingBlog,
                          contactPhone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Patna Office Address</label>
                    <input
                      type="text"
                      value={editingBlog.patnaOffice || ""}
                      onChange={(e) =>
                        setEditingBlog({
                          ...editingBlog,
                          patnaOffice: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Greater Noida Office Address</label>
                    <input
                      type="text"
                      value={editingBlog.noidaOffice || ""}
                      onChange={(e) =>
                        setEditingBlog({
                          ...editingBlog,
                          noidaOffice: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.btnCancel}
                    onClick={() => setShowEditBlogModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.btnSubmit}>
                    Update Blog Article
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
