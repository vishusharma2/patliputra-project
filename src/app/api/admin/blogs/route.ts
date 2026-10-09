import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { deleteImageFromStorage } from "@/lib/storage";
import { BlogArticle, DEFAULT_BLOGS } from "@/types/blogs";
export { type BlogArticle, DEFAULT_BLOGS };

// Helper to map DB row to BlogArticle format
function rowToBlog(row: Record<string, unknown>): BlogArticle {
  return {
    id: String(row.id),
    order: typeof row.order_index === "number" ? row.order_index : 0,
    title: String(row.title || ""),
    author: String(row.author || "Patliputra"),
    date: String(row.date || "07-August 2025"),
    image: String(row.image || DEFAULT_BLOGS[0].image),
    subtitle: String(row.subtitle || ""),
    description: String(row.description || ""),
    offers: Array.isArray(row.offers) ? (row.offers as string[]) : [],
    highlights: Array.isArray(row.highlights)
      ? (row.highlights as string[])
      : [],
    whyInvest: Array.isArray(row.why_invest)
      ? (row.why_invest as string[])
      : [],
    contactPhone: String(row.contact_phone || "+91 9771417077"),
    patnaOffice: String(
      row.patna_office ||
        "301, Maharaja Kameshwar Complex, Frazer Road, Patna"
    ),
    noidaOffice: String(
      row.noida_office || "Plot No. INS - 02, Sector - Chi V, Greater Noida"
    ),
  };
}

// Fetch all blogs from Supabase
async function fetchAllBlogs(): Promise<BlogArticle[]> {
  if (!supabaseAdmin) return DEFAULT_BLOGS;

  try {
    const { data, error } = await supabaseAdmin
      .from("blogs")
      .select("*")
      .order("order_index", { ascending: true });

    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map(rowToBlog);
    }
  } catch (err) {
    console.warn("Supabase blogs fetch notice:", err);
  }

  return DEFAULT_BLOGS;
}

// GET: Return all blogs
export async function GET() {
  try {
    const list = await fetchAllBlogs();
    return NextResponse.json(list);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

// POST: Add a new blog
export async function POST(req: Request) {
  if (!isSupabaseConfigured || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase credentials are not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const item = body.blog || body;

    if (!item || !item.title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const current = await fetchAllBlogs();
    const nextOrder = current.length + 1;

    const newBlog: BlogArticle = {
      id: item.id || `blog-${Date.now()}`,
      order: typeof item.order === "number" ? item.order : nextOrder,
      title: item.title.trim(),
      author: item.author ? item.author.trim() : "Patliputra",
      date: item.date ? item.date.trim() : "07-August 2025",
      image: item.image || DEFAULT_BLOGS[0].image,
      subtitle: item.subtitle ? item.subtitle.trim() : "",
      description: item.description ? item.description.trim() : "",
      offers: Array.isArray(item.offers)
        ? item.offers
        : typeof item.offers === "string"
        ? item.offers
            .split("\n")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
      highlights: Array.isArray(item.highlights)
        ? item.highlights
        : typeof item.highlights === "string"
        ? item.highlights
            .split("\n")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
      whyInvest: Array.isArray(item.whyInvest)
        ? item.whyInvest
        : typeof item.whyInvest === "string"
        ? item.whyInvest
            .split("\n")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
      contactPhone: item.contactPhone
        ? item.contactPhone.trim()
        : "+91 9771417077",
      patnaOffice: item.patnaOffice
        ? item.patnaOffice.trim()
        : "301, Maharaja Kameshwar Complex, Frazer Road, Patna",
      noidaOffice: item.noidaOffice
        ? item.noidaOffice.trim()
        : "Plot No. INS - 02, Sector - Chi V, Greater Noida",
    };

    const { error: insertError } = await supabaseAdmin.from("blogs").insert({
      id: newBlog.id,
      order_index: newBlog.order,
      title: newBlog.title,
      author: newBlog.author,
      date: newBlog.date,
      image: newBlog.image,
      subtitle: newBlog.subtitle,
      description: newBlog.description,
      offers: newBlog.offers,
      highlights: newBlog.highlights,
      why_invest: newBlog.whyInvest,
      contact_phone: newBlog.contactPhone,
      patna_office: newBlog.patnaOffice,
      noida_office: newBlog.noidaOffice,
    });

    if (insertError) {
      console.error("Supabase blogs insert error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const updated = await fetchAllBlogs();
    return NextResponse.json({ success: true, blog: newBlog, data: updated });
  } catch (err) {
    console.error("Error creating blog:", err);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}

// PUT: Update an existing blog
export async function PUT(req: Request) {
  if (!isSupabaseConfigured || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase credentials are not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const item = body.blog || body;

    if (!item || !item.id || !item.title) {
      return NextResponse.json(
        { error: "ID and Title are required" },
        { status: 400 }
      );
    }

    const updatePayload: Record<string, unknown> = {};
    if (item.title !== undefined) updatePayload.title = item.title.trim();
    if (item.author !== undefined) updatePayload.author = item.author.trim();
    if (item.date !== undefined) updatePayload.date = item.date.trim();
    if (item.image !== undefined) updatePayload.image = item.image;
    if (item.subtitle !== undefined) updatePayload.subtitle = item.subtitle.trim();
    if (item.description !== undefined)
      updatePayload.description = item.description.trim();
    if (item.contactPhone !== undefined)
      updatePayload.contact_phone = item.contactPhone.trim();
    if (item.patnaOffice !== undefined)
      updatePayload.patna_office = item.patnaOffice.trim();
    if (item.noidaOffice !== undefined)
      updatePayload.noida_office = item.noidaOffice.trim();

    if (item.offers !== undefined) {
      updatePayload.offers = Array.isArray(item.offers)
        ? item.offers
        : typeof item.offers === "string"
        ? item.offers
            .split("\n")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [];
    }

    if (item.highlights !== undefined) {
      updatePayload.highlights = Array.isArray(item.highlights)
        ? item.highlights
        : typeof item.highlights === "string"
        ? item.highlights
            .split("\n")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [];
    }

    if (item.whyInvest !== undefined) {
      updatePayload.why_invest = Array.isArray(item.whyInvest)
        ? item.whyInvest
        : typeof item.whyInvest === "string"
        ? item.whyInvest
            .split("\n")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [];
    }

    if (item.order !== undefined) {
      updatePayload.order_index = Number(item.order);
    }

    // If image changed, fetch old image to delete it from storage
    if (item.image) {
      try {
        const { data: currentBlog } = await supabaseAdmin
          .from("blogs")
          .select("image")
          .eq("id", item.id)
          .single();

        if (currentBlog && currentBlog.image && currentBlog.image !== item.image) {
          deleteImageFromStorage(currentBlog.image).catch((err) =>
            console.warn("Notice: could not delete replaced blog image:", err)
          );
        }
      } catch (checkErr) {
        console.warn("Notice checking blog image replacement:", checkErr);
      }
    }

    const { error: updateError } = await supabaseAdmin
      .from("blogs")
      .update(updatePayload)
      .eq("id", item.id);

    if (updateError) {
      console.error("Supabase blogs update error:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    const updated = await fetchAllBlogs();
    const updatedItem = updated.find((b) => b.id === item.id) || item;

    return NextResponse.json({ success: true, blog: updatedItem, data: updated });
  } catch (err) {
    console.error("Error updating blog:", err);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a blog and its image from database and storage
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

    // 1. Fetch blog before deletion to obtain its image URL
    let imageToDelete: string | null = null;
    try {
      const { data: blogData } = await supabaseAdmin
        .from("blogs")
        .select("image")
        .eq("id", id)
        .single();
      if (blogData && blogData.image) {
        imageToDelete = blogData.image;
      }
    } catch (fetchErr) {
      console.warn("Notice fetching blog before deletion:", fetchErr);
    }

    // 2. Delete blog record from database
    const { error: deleteError } = await supabaseAdmin
      .from("blogs")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Supabase blogs delete error:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // 3. Delete associated image from Supabase Storage bucket
    if (imageToDelete) {
      deleteImageFromStorage(imageToDelete).catch((err) =>
        console.warn("Notice deleting blog image from storage:", err)
      );
    }

    const updated = await fetchAllBlogs();
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("Error deleting blog:", err);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
