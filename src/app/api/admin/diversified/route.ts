import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { deleteImageFromStorage } from "@/lib/storage";

export interface BusinessSector {
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

export const DEFAULT_DIVERSIFIED_SECTORS: BusinessSector[] = [
  {
    id: "patliputra-exotica",
    order: 1,
    title: "Hotel Patliputra Exotica",
    category: "HOTEL",
    categoryLabel: "4-Star Luxury Business Hotel",
    categoryFilter: "hospitality",
    location: "Exhibition Road, Patna",
    tagline: "Premier 4-Star Hospitality & Grand Banqueting Landmark",
    image: "/img/Business/delivered_exotica.webp",
    description:
      "Patna's distinguished luxury business hotel offering plush executive suites, signature fine dining at Bawarchi, versatile conference facilities, and majestic celebration halls.",
    features: [
      "4-Star Executive Rooms",
      "Bawarchi Multi-Cuisine Fine Dine",
      "Grand Banquets & Ballrooms",
      "24/7 Corporate Business Hub",
    ],
    stats: [
      { label: "Rating", value: "4-Star" },
      { label: "Accommodations", value: "70+ Rooms" },
      { label: "Banquets", value: "3 Grand Halls" },
    ],
    address: "Exhibition Road, Near Gandhi Maidan, Patna, Bihar 800001",
    contactInfo: "+91 98765 43210",
    highlights: [
      "Prime central commercial hub location with seamless transit connectivity",
      "Signature Bawarchi restaurant serving acclaimed North Indian, Mughlai & Oriental cuisine",
      "Comprehensive high-tech conference spaces for corporate conventions",
      "Dedicated concierge, valet parking, and luxury airport transfers",
    ],
  },
  {
    id: "patliputra-nirvana",
    order: 2,
    title: "Hotel Patliputra Nirvana",
    category: "HOTEL",
    categoryLabel: "Boutique Urban Hotel",
    categoryFilter: "hospitality",
    location: "Buddha Colony / Boring Road, Patna",
    tagline: "Tranquil Boutique Hospitality & Curated Dining Ambience",
    image: "/img/Business/delivered_nirvana.webp",
    description:
      "An exquisite boutique urban retreat combining serene zen aesthetics with personalized hospitality, handcrafted culinary delights, and private banqueting spaces crafted for memorable stays.",
    features: [
      "Designer Boutique Suites",
      "Themed Ambient Restaurant",
      "Bespoke Event Spaces",
      "24/7 Personalized Concierge",
    ],
    stats: [
      { label: "Ambiance", value: "Zen Boutique" },
      { label: "Dining", value: "Curated Cuisine" },
      { label: "Location", value: "Buddha Colony" },
    ],
    address: "Buddha Colony, Off Boring Canal Road, Patna, Bihar 800001",
    contactInfo: "+91 98765 43210",
    highlights: [
      "Calm, aesthetic environment nestled in central Patna",
      "Thoughtfully appointed rooms with contemporary conveniences",
      "Intimate venue for social gatherings, engagements, and corporate meetings",
      "Dedicated guest services and prompt room assistance",
    ],
  },
  {
    id: "alina-resort",
    order: 3,
    title: "Alina Resort",
    category: "RESORT",
    categoryLabel: "Destination Resort & Events",
    categoryFilter: "hospitality",
    location: "Patna Outskirts, Bihar",
    tagline: "Luxury Poolside Paradise & Grand Wedding Haven",
    image: "/img/Business/delivered_alina.webp",
    description:
      "An expansive leisure resort featuring sparkling swimming pools, lush landscaped party lawns, poolside gazebos, and grand catering designed for fairytale weddings and weekend retreats.",
    features: [
      "Open-Air Designer Pool",
      "1,000+ Guest Wedding Lawns",
      "Poolside Cabanas & Lounge",
      "Weekend Leisure & Banquets",
    ],
    stats: [
      { label: "Venue Type", value: "Resort & Lawns" },
      { label: "Capacity", value: "1,000+ Guests" },
      { label: "Setting", value: "Poolside Greenery" },
    ],
    address: "Patna - Gaya Highway Corridor, Patna Outskirts, Bihar",
    contactInfo: "+91 98765 43210",
    highlights: [
      "Spacious open-air swimming pool with sun lounge deck",
      "Massive manicured lawns ideal for grand destination weddings & galas",
      "Dedicated catering kitchens and VIP dressing suites",
      "Tranquil getaway away from urban noise with ample valet parking",
    ],
  },
  {
    id: "mims-hospital",
    order: 4,
    title: "MIMS Hospital",
    category: "HOSPITAL",
    categoryLabel: "Super-Speciality Healthcare",
    categoryFilter: "healthcare",
    location: "Bihar",
    tagline: "Advanced Critical Care & Compassionate Medical Services",
    image: "/img/Business/delivered_mims.webp",
    description:
      "A state-of-the-art multi-speciality medical complex providing round-the-clock emergency trauma services, modern ICU facilities, diagnostic laboratories, and super-specialist healthcare.",
    features: [
      "24/7 Trauma & Emergency",
      "Modular OTs & Advanced ICUs",
      "NABL-Standard Pathology",
      "Multi-Speciality Consultations",
    ],
    stats: [
      { label: "Emergency", value: "24/7 Service" },
      { label: "Care Units", value: "Advanced ICU" },
      { label: "Departments", value: "Multi-Speciality" },
    ],
    address: "Medical Hub Corridor, Bihar",
    contactInfo: "+91 98765 43210",
    highlights: [
      "Round-the-clock emergency casualty and trauma response team",
      "Fully equipped critical care unit with modern ventilators and monitors",
      "Digital imaging, ultrasound, and comprehensive diagnostic laboratory",
      "In-house emergency pharmacy and dedicated ambulance fleet",
    ],
  },
  {
    id: "babu-g-vidyamandir",
    order: 5,
    title: "Babu G Vidyamandir",
    category: "SCHOOL",
    categoryLabel: "Academic Institution",
    categoryFilter: "education",
    location: "Bihar",
    tagline: "Excellence in Comprehensive Education & Character Building",
    image: "/img/Business/delivered_school.webp",
    description:
      "A premier co-educational institution nurturing academic excellence, holistic personality development, smart digital classrooms, and extensive sports facilities for future leaders.",
    features: [
      "Smart Interactive Classrooms",
      "Modern STEM & Science Labs",
      "Expansive Athletic Grounds",
      "Holistic Value-Based Learning",
    ],
    stats: [
      { label: "Campus", value: "Expansive Green" },
      { label: "Education", value: "Comprehensive" },
      { label: "Activities", value: "Sports & Arts" },
    ],
    address: "Campus Enclave, Bihar",
    contactInfo: "+91 98765 43210",
    highlights: [
      "Wide open campus with full-sized athletic grounds and play courts",
      "Dedicated computer labs, library, and science practical rooms",
      "Experienced faculty focusing on intellectual, moral, and physical growth",
      "Safe and secure campus environment with transport facilities",
    ],
  },
];

// Helper to map DB row to BusinessSector format
function rowToBusiness(row: Record<string, unknown>): BusinessSector {
  return {
    id: String(row.id),
    order: typeof row.order_index === "number" ? row.order_index : 0,
    title: String(row.title || ""),
    category: String(row.category || "HOTEL"),
    categoryLabel: String(row.category_label || row.category || "Business Vertical"),
    categoryFilter: String(row.category_filter || "hospitality"),
    location: String(row.location || "Patna, Bihar"),
    tagline: String(row.tagline || ""),
    image: String(row.image || "/img/Business/delivered_exotica.webp"),
    description: String(row.description || ""),
    features: Array.isArray(row.features) ? (row.features as string[]) : [],
    stats: Array.isArray(row.stats) ? (row.stats as { label: string; value: string }[]) : [],
    address: String(row.address || ""),
    contactInfo: String(row.contact_info || "+91 98765 43210"),
    highlights: Array.isArray(row.highlights) ? (row.highlights as string[]) : [],
  };
}

// Fetch all businesses from Supabase
async function fetchAllBusinesses(): Promise<BusinessSector[]> {
  if (!supabaseAdmin) return DEFAULT_DIVERSIFIED_SECTORS;

  try {
    const { data, error } = await supabaseAdmin
      .from("diversified_businesses")
      .select("*")
      .order("order_index", { ascending: true });

    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map(rowToBusiness);
    }
  } catch (err) {
    console.warn("Supabase diversified fetch notice:", err);
  }

  return DEFAULT_DIVERSIFIED_SECTORS;
}

// GET: Return all diversified businesses
export async function GET() {
  try {
    const list = await fetchAllBusinesses();
    return NextResponse.json(list);
  } catch (err) {
    console.error("Error fetching diversified businesses:", err);
    return NextResponse.json(
      { error: "Failed to fetch diversified businesses" },
      { status: 500 }
    );
  }
}

// POST: Add a new diversified business project
export async function POST(req: Request) {
  if (!isSupabaseConfigured || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase credentials are not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const item = body.business || body;

    if (!item || !item.title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const current = await fetchAllBusinesses();
    const nextOrder = current.length + 1;

    const newBusiness: BusinessSector = {
      id: item.id || `diversified-${Date.now()}`,
      order: nextOrder,
      title: item.title.trim(),
      category: item.category || "HOTEL",
      categoryLabel: item.categoryLabel || item.category || "Business Vertical",
      categoryFilter: item.categoryFilter || "hospitality",
      location: item.location || "Patna, Bihar",
      tagline: item.tagline || "",
      image: item.image || "/img/Business/delivered_exotica.webp",
      description: item.description || "",
      features: Array.isArray(item.features)
        ? item.features
        : typeof item.features === "string"
        ? item.features.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [],
      stats: Array.isArray(item.stats)
        ? item.stats
        : [
            { label: "Status", value: "Operational" },
            { label: "Location", value: item.location || "Patna" },
          ],
      address: item.address || "",
      contactInfo: item.contactInfo || "+91 98765 43210",
      highlights: Array.isArray(item.highlights)
        ? item.highlights
        : typeof item.highlights === "string"
        ? item.highlights.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [],
    };

    const { error: insertError } = await supabaseAdmin
      .from("diversified_businesses")
      .insert({
        id: newBusiness.id,
        order_index: newBusiness.order,
        title: newBusiness.title,
        category: newBusiness.category,
        category_label: newBusiness.categoryLabel,
        category_filter: newBusiness.categoryFilter,
        location: newBusiness.location,
        tagline: newBusiness.tagline,
        image: newBusiness.image,
        description: newBusiness.description,
        features: newBusiness.features,
        stats: newBusiness.stats,
        address: newBusiness.address,
        contact_info: newBusiness.contactInfo,
        highlights: newBusiness.highlights,
      });

    if (insertError) {
      console.error("Supabase diversified insert error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const updated = await fetchAllBusinesses();
    return NextResponse.json({ success: true, business: newBusiness, data: updated });
  } catch (err) {
    console.error("Error creating diversified business:", err);
    return NextResponse.json(
      { error: "Failed to create diversified business" },
      { status: 500 }
    );
  }
}

// PUT: Update an existing diversified business
export async function PUT(req: Request) {
  if (!isSupabaseConfigured || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase credentials are not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const item = body.business || body;

    if (!item || !item.id || !item.title) {
      return NextResponse.json(
        { error: "ID and Title are required" },
        { status: 400 }
      );
    }

    const updatePayload: Record<string, unknown> = {};
    if (item.title !== undefined) updatePayload.title = item.title.trim();
    if (item.category !== undefined) updatePayload.category = item.category;
    if (item.categoryLabel !== undefined) updatePayload.category_label = item.categoryLabel;
    if (item.categoryFilter !== undefined) updatePayload.category_filter = item.categoryFilter;
    if (item.location !== undefined) updatePayload.location = item.location;
    if (item.tagline !== undefined) updatePayload.tagline = item.tagline;
    if (item.image !== undefined) updatePayload.image = item.image;
    if (item.description !== undefined) updatePayload.description = item.description;
    if (item.address !== undefined) updatePayload.address = item.address;
    if (item.contactInfo !== undefined) updatePayload.contact_info = item.contactInfo;

    if (item.features !== undefined) {
      updatePayload.features = Array.isArray(item.features)
        ? item.features
        : typeof item.features === "string"
        ? item.features.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [];
    }

    if (item.highlights !== undefined) {
      updatePayload.highlights = Array.isArray(item.highlights)
        ? item.highlights
        : typeof item.highlights === "string"
        ? item.highlights.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [];
    }

    if (item.stats !== undefined && Array.isArray(item.stats)) {
      updatePayload.stats = item.stats;
    }

    if (item.order !== undefined) {
      updatePayload.order_index = item.order;
    }

    // If image changed, fetch old image to delete it from storage
    if (item.image) {
      try {
        const { data: currentBusiness } = await supabaseAdmin
          .from("diversified_businesses")
          .select("image")
          .eq("id", item.id)
          .single();

        if (
          currentBusiness &&
          currentBusiness.image &&
          currentBusiness.image !== item.image
        ) {
          deleteImageFromStorage(currentBusiness.image).catch((err) =>
            console.warn("Notice deleting replaced diversified image:", err)
          );
        }
      } catch (checkErr) {
        console.warn("Notice checking diversified image replacement:", checkErr);
      }
    }

    const { error: updateError } = await supabaseAdmin
      .from("diversified_businesses")
      .update(updatePayload)
      .eq("id", item.id);

    if (updateError) {
      console.error("Supabase diversified update error:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    const updated = await fetchAllBusinesses();
    const updatedItem = updated.find((b) => b.id === item.id) || item;

    return NextResponse.json({ success: true, business: updatedItem, data: updated });
  } catch (err) {
    console.error("Error updating diversified business:", err);
    return NextResponse.json(
      { error: "Failed to update diversified business" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a diversified business project and its image from database and storage
export async function DELETE(req: Request) {
  if (!isSupabaseConfigured || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase credentials are not configured" },
      { status: 500 }
    );
  }

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // 1. Fetch business before deletion to obtain its image URL
    let imageToDelete: string | null = null;
    try {
      const { data: businessData } = await supabaseAdmin
        .from("diversified_businesses")
        .select("image")
        .eq("id", id)
        .single();
      if (businessData && businessData.image) {
        imageToDelete = businessData.image;
      }
    } catch (fetchErr) {
      console.warn("Notice fetching diversified business before deletion:", fetchErr);
    }

    // 2. Delete record from database table
    const { error: deleteError } = await supabaseAdmin
      .from("diversified_businesses")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Supabase diversified delete error:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // 3. Delete associated image from Supabase Storage bucket
    if (imageToDelete) {
      deleteImageFromStorage(imageToDelete).catch((err) =>
        console.warn("Notice deleting diversified image from storage:", err)
      );
    }

    const updated = await fetchAllBusinesses();
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("Error deleting diversified business:", err);
    return NextResponse.json(
      { error: "Failed to delete diversified business" },
      { status: 500 }
    );
  }
}
