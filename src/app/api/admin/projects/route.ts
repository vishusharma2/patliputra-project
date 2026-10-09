import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { deleteImageFromStorage } from "@/lib/storage";

interface DeliveredProject {
  id: string;
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

interface ProjectsData {
  delivered: DeliveredProject[];
  ongoing: OngoingProject[];
}

// Helper to fetch all projects (both delivered and ongoing) directly from Supabase
async function fetchAllProjects(): Promise<ProjectsData> {
  if (!supabaseAdmin) return { delivered: [], ongoing: [] };

  const [delRes, onRes] = await Promise.all([
    supabaseAdmin
      .from("delivered_projects")
      .select("*")
      .order("order_index", { ascending: true }),
    supabaseAdmin
      .from("ongoing_projects")
      .select("*")
      .order("order_index", { ascending: true }),
  ]);

  if (delRes.error) {
    console.error("Supabase delivered_projects fetch error:", delRes.error);
  }
  if (onRes.error) {
    console.error("Supabase ongoing_projects fetch error:", onRes.error);
  }

  const delivered: DeliveredProject[] = (delRes.data || []).map((r) => ({
    id: String(r.id),
    order: typeof r.order_index === "number" ? r.order_index : 0,
    name: String(r.name || ""),
    location: String(r.location || "Patna"),
    image: String(r.image || "/img/delivered/satyam.webp"),
    description: String(r.description || ""),
  }));

  const ongoing: OngoingProject[] = (onRes.data || []).map((r) => ({
    id: String(r.id),
    order: typeof r.order_index === "number" ? r.order_index : 0,
    title: String(r.title || ""),
    location: String(r.location || "Patna"),
    type: String(r.type || "Luxury Residential"),
    area: String(r.area || ""),
    price: String(r.price || "Price on Request"),
    bedrooms: r.bedrooms !== null && r.bedrooms !== undefined ? Number(r.bedrooms) : undefined,
    bathrooms: r.bathrooms !== null && r.bathrooms !== undefined ? Number(r.bathrooms) : undefined,
    image: String(r.image || "/img/signature_park.jpg"),
    tag: String(r.tag || "Under Construction"),
    rera: r.rera ? String(r.rera) : undefined,
    sqft: r.sqft ? String(r.sqft) : undefined,
    description: r.description ? String(r.description) : undefined,
    about: r.about ? String(r.about) : undefined,
    address: r.address ? String(r.address) : undefined,
    amenities: Array.isArray(r.amenities) ? (r.amenities as string[]) : [],
    features: Array.isArray(r.features) ? (r.features as string[]) : [],
  }));

  return { delivered, ongoing };
}

// GET: Return all projects directly from Supabase
export async function GET() {
  if (!isSupabaseConfigured || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase credentials are not configured" },
      { status: 500 }
    );
  }

  try {
    const data = await fetchAllProjects();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching projects from Supabase:", err);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST: Add a new project directly into Supabase
export async function POST(req: Request) {
  if (!isSupabaseConfigured || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase credentials are not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { category, project } = body;

    if (!category || !project || (!project.name && !project.title)) {
      return NextResponse.json(
        { error: "Invalid project payload" },
        { status: 400 }
      );
    }

    const currentData = await fetchAllProjects();

    if (category === "delivered") {
      const nextOrder = currentData.delivered.length + 1;
      const newDelivered: DeliveredProject = {
        id: project.id || `delivered-${Date.now()}`,
        order: nextOrder,
        name: project.name || "Untitled Project",
        location: project.location || "Patna",
        image: project.image || "/img/delivered/lalita.webp",
        description: project.description || "",
      };

      const { error: insertError } = await supabaseAdmin
        .from("delivered_projects")
        .insert({
          id: newDelivered.id,
          order_index: newDelivered.order,
          name: newDelivered.name,
          location: newDelivered.location,
          image: newDelivered.image,
          description: newDelivered.description,
        });

      if (insertError) {
        console.error("Supabase delivered insert error:", insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      const updatedData = await fetchAllProjects();
      return NextResponse.json({ success: true, project: newDelivered, data: updatedData });
    } else {
      const nextOrder = currentData.ongoing.length + 1;
      const newOngoing: OngoingProject = {
        id: project.id || `ongoing-${Date.now()}`,
        order: nextOrder,
        title: project.title || "Untitled Ongoing Project",
        location: project.location || "Patna",
        type: project.type || "Luxury Residential",
        area: project.area || "N/A",
        price: project.price || "Price on Request",
        bedrooms: project.bedrooms ? Number(project.bedrooms) : undefined,
        bathrooms: project.bathrooms ? Number(project.bathrooms) : undefined,
        image: project.image || "/img/signature_park.jpg",
        tag: project.tag || "Under Construction",
        rera: project.rera || "",
        sqft: project.sqft || "",
        description: project.description || "",
        about: project.about || project.description || "",
        address: project.address || "",
        amenities: Array.isArray(project.amenities) ? project.amenities : [],
        features: Array.isArray(project.features) ? project.features : [],
      };

      const { error: insertError } = await supabaseAdmin
        .from("ongoing_projects")
        .insert({
          id: newOngoing.id,
          order_index: newOngoing.order,
          title: newOngoing.title,
          location: newOngoing.location,
          type: newOngoing.type,
          area: newOngoing.area,
          price: newOngoing.price,
          bedrooms: newOngoing.bedrooms,
          bathrooms: newOngoing.bathrooms,
          image: newOngoing.image,
          tag: newOngoing.tag,
          rera: newOngoing.rera,
          sqft: newOngoing.sqft,
          description: newOngoing.description,
          about: newOngoing.about,
          address: newOngoing.address,
          amenities: newOngoing.amenities,
          features: newOngoing.features,
        });

      if (insertError) {
        console.error("Supabase ongoing insert error:", insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      const updatedData = await fetchAllProjects();
      return NextResponse.json({ success: true, project: newOngoing, data: updatedData });
    }
  } catch (err) {
    console.error("Error adding project:", err);
    return NextResponse.json({ error: "Failed to add project" }, { status: 500 });
  }
}

// PUT: Update an existing project directly in Supabase
export async function PUT(req: Request) {
  if (!isSupabaseConfigured || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase credentials are not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { category, project } = body;

    if (!category || !project || !project.id) {
      return NextResponse.json(
        { error: "Category and Project ID are required" },
        { status: 400 }
      );
    }

    if (category === "delivered") {
      const updatePayload: Record<string, unknown> = {};
      if (project.name !== undefined) updatePayload.name = project.name;
      if (project.location !== undefined) updatePayload.location = project.location;
      if (project.image !== undefined) updatePayload.image = project.image;
      if (project.description !== undefined) updatePayload.description = project.description;
      if (project.order !== undefined) updatePayload.order_index = project.order;

      // If image changed, fetch old image to delete it from storage
      if (project.image) {
        try {
          const { data: currentProject } = await supabaseAdmin
            .from("delivered_projects")
            .select("image")
            .eq("id", project.id)
            .single();

          if (
            currentProject &&
            currentProject.image &&
            currentProject.image !== project.image
          ) {
            deleteImageFromStorage(currentProject.image).catch((err) =>
              console.warn("Notice deleting replaced delivered project image:", err)
            );
          }
        } catch (checkErr) {
          console.warn("Notice checking delivered project image replacement:", checkErr);
        }
      }

      const { error: updateError } = await supabaseAdmin
        .from("delivered_projects")
        .update(updatePayload)
        .eq("id", project.id);

      if (updateError) {
        console.error("Supabase delivered update error:", updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      const updatedData = await fetchAllProjects();
      const updatedItem = updatedData.delivered.find((p) => p.id === project.id) || project;

      return NextResponse.json({ success: true, project: updatedItem, data: updatedData });
    } else {
      const updatePayload: Record<string, unknown> = {};
      if (project.title !== undefined) updatePayload.title = project.title;
      if (project.location !== undefined) updatePayload.location = project.location;
      if (project.type !== undefined) updatePayload.type = project.type;
      if (project.area !== undefined) updatePayload.area = project.area;
      if (project.price !== undefined) updatePayload.price = project.price;
      if (project.bedrooms !== undefined) {
        updatePayload.bedrooms = project.bedrooms ? Number(project.bedrooms) : null;
      }
      if (project.bathrooms !== undefined) {
        updatePayload.bathrooms = project.bathrooms ? Number(project.bathrooms) : null;
      }
      if (project.image !== undefined) updatePayload.image = project.image;
      if (project.tag !== undefined) updatePayload.tag = project.tag;
      if (project.rera !== undefined) updatePayload.rera = project.rera;
      if (project.sqft !== undefined) updatePayload.sqft = project.sqft;
      if (project.description !== undefined) updatePayload.description = project.description;
      if (project.about !== undefined) updatePayload.about = project.about;
      if (project.address !== undefined) updatePayload.address = project.address;
      if (project.amenities !== undefined) {
        updatePayload.amenities = Array.isArray(project.amenities) ? project.amenities : [];
      }
      if (project.features !== undefined) {
        updatePayload.features = Array.isArray(project.features) ? project.features : [];
      }
      if (project.order !== undefined) updatePayload.order_index = project.order;

      // If image changed, fetch old image to delete it from storage
      if (project.image) {
        try {
          const { data: currentProject } = await supabaseAdmin
            .from("ongoing_projects")
            .select("image")
            .eq("id", project.id)
            .single();

          if (
            currentProject &&
            currentProject.image &&
            currentProject.image !== project.image
          ) {
            deleteImageFromStorage(currentProject.image).catch((err) =>
              console.warn("Notice deleting replaced ongoing project image:", err)
            );
          }
        } catch (checkErr) {
          console.warn("Notice checking ongoing project image replacement:", checkErr);
        }
      }

      const { error: updateError } = await supabaseAdmin
        .from("ongoing_projects")
        .update(updatePayload)
        .eq("id", project.id);

      if (updateError) {
        console.error("Supabase ongoing update error:", updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      const updatedData = await fetchAllProjects();
      const updatedItem = updatedData.ongoing.find((p) => p.id === project.id) || project;

      return NextResponse.json({ success: true, project: updatedItem, data: updatedData });
    }
  } catch (err) {
    console.error("Error updating project:", err);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

// DELETE: Delete a project directly from Supabase and delete its image from storage
export async function DELETE(req: Request) {
  if (!isSupabaseConfigured || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase credentials are not configured" },
      { status: 500 }
    );
  }

  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const id = url.searchParams.get("id");

    if (!category || !id) {
      return NextResponse.json(
        { error: "Category and ID are required" },
        { status: 400 }
      );
    }

    if (category === "delivered") {
      // 1. Fetch image URL before deleting
      let imageToDelete: string | null = null;
      try {
        const { data: projData } = await supabaseAdmin
          .from("delivered_projects")
          .select("image")
          .eq("id", id)
          .single();
        if (projData && projData.image) {
          imageToDelete = projData.image;
        }
      } catch (fetchErr) {
        console.warn("Notice fetching delivered project before deletion:", fetchErr);
      }

      // 2. Delete row from database
      const { error: deleteError } = await supabaseAdmin
        .from("delivered_projects")
        .delete()
        .eq("id", id);

      if (deleteError) {
        console.error("Supabase delivered delete error:", deleteError);
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
      }

      // 3. Delete image from storage
      if (imageToDelete) {
        deleteImageFromStorage(imageToDelete).catch((err) =>
          console.warn("Notice deleting delivered project image from storage:", err)
        );
      }

      const updatedData = await fetchAllProjects();
      return NextResponse.json({ success: true, data: updatedData });
    } else {
      // 1. Fetch image URL before deleting
      let imageToDelete: string | null = null;
      try {
        const { data: projData } = await supabaseAdmin
          .from("ongoing_projects")
          .select("image")
          .eq("id", id)
          .single();
        if (projData && projData.image) {
          imageToDelete = projData.image;
        }
      } catch (fetchErr) {
        console.warn("Notice fetching ongoing project before deletion:", fetchErr);
      }

      // 2. Delete row from database
      const { error: deleteError } = await supabaseAdmin
        .from("ongoing_projects")
        .delete()
        .eq("id", id);

      if (deleteError) {
        console.error("Supabase ongoing delete error:", deleteError);
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
      }

      // 3. Delete image from storage
      if (imageToDelete) {
        deleteImageFromStorage(imageToDelete).catch((err) =>
          console.warn("Notice deleting ongoing project image from storage:", err)
        );
      }

      const updatedData = await fetchAllProjects();
      return NextResponse.json({ success: true, data: updatedData });
    }
  } catch (err) {
    console.error("Error deleting project:", err);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
