import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { deleteImageFromStorage } from "@/lib/storage";

export interface LandmarkItem {
  id: string;
  order?: number;
  title: string;
  badge: string;
  image: string;
}

export const DEFAULT_LANDMARKS: LandmarkItem[] = [
  {
    id: "mussoorie-hotel",
    order: 1,
    title: "5 Star Hotel in Mussoorie",
    badge: "5 Star Hotel",
    image: "https://mbfrobyozijbwglauqop.supabase.co/storage/v1/object/public/project%20images/Landmarks/Mussoorie_Hotel.png",
  },
  {
    id: "ranchi-hotel",
    order: 2,
    title: "5 Star Hotel in Ranchi",
    badge: "5 Star Hotel",
    image: "https://mbfrobyozijbwglauqop.supabase.co/storage/v1/object/public/project%20images/Landmarks/Ranchi_Hotel.png",
  },
  {
    id: "patliputra-park",
    order: 3,
    title: "Patliputra Park in Patna - Saguna More",
    badge: "Park",
    image: "https://mbfrobyozijbwglauqop.supabase.co/storage/v1/object/public/project%20images/Landmarks/Patliputra_Park.png",
  },
  {
    id: "greaternoida-hotel",
    order: 4,
    title: "5 Star Hotel in Greater Noida",
    badge: "5 Star Hotel",
    image: "https://mbfrobyozijbwglauqop.supabase.co/storage/v1/object/public/project%20images/Landmarks/GreaterNoida_Hotel.png",
  },
];

// Helper to map DB row to LandmarkItem format
function rowToLandmark(row: Record<string, unknown>): LandmarkItem {
  return {
    id: String(row.id),
    order: typeof row.order_index === "number" ? row.order_index : 0,
    title: String(row.title || ""),
    badge: String(row.badge || "5 Star Hotel"),
    image: String(row.image || "/img/landmarks/Mussoorie_Hotel.png"),
  };
}

// Fetch all landmarks from Supabase
async function fetchAllLandmarks(): Promise<LandmarkItem[]> {
  if (!supabaseAdmin) return DEFAULT_LANDMARKS;

  try {
    const { data, error } = await supabaseAdmin
      .from("upcoming_landmarks")
      .select("*")
      .order("order_index", { ascending: true });

    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map(rowToLandmark);
    }
  } catch (err) {
    console.warn("Supabase upcoming landmarks fetch notice:", err);
  }

  return DEFAULT_LANDMARKS;
}

// GET: Return all upcoming landmarks
export async function GET() {
  try {
    const list = await fetchAllLandmarks();
    return NextResponse.json(list);
  } catch (err) {
    console.error("Error fetching upcoming landmarks:", err);
    return NextResponse.json(
      { error: "Failed to fetch upcoming landmarks" },
      { status: 500 }
    );
  }
}

// POST: Add a new upcoming landmark
export async function POST(req: Request) {
  if (!isSupabaseConfigured || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase credentials are not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const item = body.landmark || body;

    if (!item || !item.title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const current = await fetchAllLandmarks();
    const nextOrder = current.length + 1;

    const newLandmark: LandmarkItem = {
      id: item.id || `landmark-${Date.now()}`,
      order: typeof item.order === "number" ? item.order : nextOrder,
      title: item.title.trim(),
      badge: item.badge ? item.badge.trim() : "5 Star Hotel",
      image: item.image || "/img/landmarks/Mussoorie_Hotel.png",
    };

    const { error: insertError } = await supabaseAdmin
      .from("upcoming_landmarks")
      .insert({
        id: newLandmark.id,
        order_index: newLandmark.order,
        title: newLandmark.title,
        badge: newLandmark.badge,
        image: newLandmark.image,
      });

    if (insertError) {
      console.error("Supabase upcoming landmarks insert error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const updated = await fetchAllLandmarks();
    return NextResponse.json({ success: true, landmark: newLandmark, data: updated });
  } catch (err) {
    console.error("Error creating upcoming landmark:", err);
    return NextResponse.json(
      { error: "Failed to create upcoming landmark" },
      { status: 500 }
    );
  }
}

// PUT: Update an existing upcoming landmark
export async function PUT(req: Request) {
  if (!isSupabaseConfigured || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase credentials are not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const item = body.landmark || body;

    if (!item || !item.id || !item.title) {
      return NextResponse.json(
        { error: "ID and Title are required" },
        { status: 400 }
      );
    }

    const updatePayload: Record<string, unknown> = {};
    if (item.title !== undefined) updatePayload.title = item.title.trim();
    if (item.badge !== undefined) updatePayload.badge = item.badge.trim();
    if (item.image !== undefined) updatePayload.image = item.image;
    if (item.order !== undefined) updatePayload.order_index = Number(item.order);

    // If image changed, fetch old image to delete it from storage
    if (item.image) {
      try {
        const { data: currentLandmark } = await supabaseAdmin
          .from("upcoming_landmarks")
          .select("image")
          .eq("id", item.id)
          .single();

        if (
          currentLandmark &&
          currentLandmark.image &&
          currentLandmark.image !== item.image
        ) {
          deleteImageFromStorage(currentLandmark.image).catch((err) =>
            console.warn("Notice deleting replaced landmark image:", err)
          );
        }
      } catch (checkErr) {
        console.warn("Notice checking landmark image replacement:", checkErr);
      }
    }

    const { error: updateError } = await supabaseAdmin
      .from("upcoming_landmarks")
      .update(updatePayload)
      .eq("id", item.id);

    if (updateError) {
      console.error("Supabase upcoming landmarks update error:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    const updated = await fetchAllLandmarks();
    const updatedItem = updated.find((l) => l.id === item.id) || item;

    return NextResponse.json({ success: true, landmark: updatedItem, data: updated });
  } catch (err) {
    console.error("Error updating upcoming landmark:", err);
    return NextResponse.json(
      { error: "Failed to update upcoming landmark" },
      { status: 500 }
    );
  }
}

// DELETE: Delete an upcoming landmark and its image from database and storage
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

    // 1. Fetch landmark before deletion to obtain its image URL
    let imageToDelete: string | null = null;
    try {
      const { data: landmarkData } = await supabaseAdmin
        .from("upcoming_landmarks")
        .select("image")
        .eq("id", id)
        .single();
      if (landmarkData && landmarkData.image) {
        imageToDelete = landmarkData.image;
      }
    } catch (fetchErr) {
      console.warn("Notice fetching landmark before deletion:", fetchErr);
    }

    // 2. Delete record from database table
    const { error: deleteError } = await supabaseAdmin
      .from("upcoming_landmarks")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Supabase upcoming landmarks delete error:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // 3. Delete associated image from Supabase Storage bucket
    if (imageToDelete) {
      deleteImageFromStorage(imageToDelete).catch((err) =>
        console.warn("Notice deleting landmark image from storage:", err)
      );
    }

    const updated = await fetchAllLandmarks();
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("Error deleting upcoming landmark:", err);
    return NextResponse.json(
      { error: "Failed to delete upcoming landmark" },
      { status: 500 }
    );
  }
}
