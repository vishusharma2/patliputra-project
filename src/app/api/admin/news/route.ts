import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { deleteImageFromStorage } from "@/lib/storage";

interface NewsItem {
  id: string;
  category: string;
  source: string;
  date: string;
  headline: string;
  englishTitle?: string;
  excerpt: string;
  image: string;
  tag: string;
  isClipping?: boolean;
  highlights?: string[];
}

// Map database row to app format
function rowToItem(row: Record<string, unknown>): NewsItem {
  return {
    id: String(row.id),
    category: String(row.category || "clipping"),
    source: String(row.source || "PRESS RELEASE"),
    date: String(row.date || "RECENT COVERAGE"),
    headline: String(row.headline || ""),
    englishTitle: String(row.english_title || row.headline || ""),
    excerpt: String(row.excerpt || ""),
    image: String(row.image || "/img/news/delivered_news1.webp"),
    tag: String(row.tag || "PRESS RELEASE"),
    isClipping: Boolean(row.is_clipping),
    highlights: Array.isArray(row.highlights)
      ? (row.highlights as string[])
      : [],
  };
}

// Helper to fetch all news items directly from Supabase
async function fetchAllNews(): Promise<NewsItem[]> {
  if (!supabaseAdmin) return [];
  const { data, error } = await supabaseAdmin
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase news fetch error:", error);
    return [];
  }
  return (data || []).map(rowToItem);
}

// GET: Return all news items from Supabase
export async function GET() {
  if (!isSupabaseConfigured || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase credentials are not configured" },
      { status: 500 }
    );
  }

  try {
    const news = await fetchAllNews();
    return NextResponse.json(news);
  } catch (err) {
    console.error("Error fetching news from Supabase:", err);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

// POST: Add a new news article directly into Supabase
export async function POST(req: Request) {
  if (!isSupabaseConfigured || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase credentials are not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const article = body.article || body;

    if (!article || (!article.headline && !article.englishTitle)) {
      return NextResponse.json(
        { error: "Headline or Title is required" },
        { status: 400 }
      );
    }

    const highlightsArray = Array.isArray(article.highlights)
      ? article.highlights
      : typeof article.highlights === "string" && article.highlights.trim()
      ? article.highlights.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [];

    const newArticle: NewsItem = {
      id: article.id || `news-${Date.now()}`,
      category: article.category || "clipping",
      source: article.source || "PRESS RELEASE",
      date: article.date || "RECENT COVERAGE",
      headline: article.headline || article.englishTitle || "News Headline",
      englishTitle: article.englishTitle || article.headline || "",
      excerpt: article.excerpt || "",
      image: article.image || "/img/news/delivered_news1.webp",
      tag: article.tag || "PRESS RELEASE",
      isClipping: article.category === "clipping" || Boolean(article.isClipping),
      highlights: highlightsArray,
    };

    const { error: insertError } = await supabaseAdmin.from("news").insert({
      id: newArticle.id,
      category: newArticle.category,
      source: newArticle.source,
      date: newArticle.date,
      headline: newArticle.headline,
      english_title: newArticle.englishTitle,
      excerpt: newArticle.excerpt,
      image: newArticle.image,
      tag: newArticle.tag,
      is_clipping: newArticle.isClipping,
      highlights: newArticle.highlights,
    });

    if (insertError) {
      console.error("Supabase news insert error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const updated = await fetchAllNews();
    return NextResponse.json({ success: true, article: newArticle, data: updated });
  } catch (err) {
    console.error("Error adding news article:", err);
    return NextResponse.json(
      { error: "Failed to add news article" },
      { status: 500 }
    );
  }
}

// PUT: Update an existing article directly in Supabase
export async function PUT(req: Request) {
  if (!isSupabaseConfigured || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase credentials are not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const article = body.article || body;

    if (!article || !article.id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    const highlightsArray = Array.isArray(article.highlights)
      ? article.highlights
      : typeof article.highlights === "string" && article.highlights.trim()
      ? article.highlights.split(",").map((s: string) => s.trim()).filter(Boolean)
      : undefined;

    const updatePayload: Record<string, unknown> = {};
    if (article.headline !== undefined) updatePayload.headline = article.headline;
    if (article.englishTitle !== undefined) updatePayload.english_title = article.englishTitle;
    if (article.source !== undefined) updatePayload.source = article.source;
    if (article.date !== undefined) updatePayload.date = article.date;
    if (article.excerpt !== undefined) updatePayload.excerpt = article.excerpt;
    if (article.image !== undefined) updatePayload.image = article.image;
    if (article.tag !== undefined) updatePayload.tag = article.tag;
    if (article.category !== undefined) {
      updatePayload.category = article.category;
      updatePayload.is_clipping = article.category === "clipping" || Boolean(article.isClipping);
    } else if (article.isClipping !== undefined) {
      updatePayload.is_clipping = Boolean(article.isClipping);
    }
    if (highlightsArray !== undefined) updatePayload.highlights = highlightsArray;

    // If image changed, fetch old image to delete it from storage
    if (article.image) {
      try {
        const { data: currentNews } = await supabaseAdmin
          .from("news")
          .select("image")
          .eq("id", article.id)
          .single();

        if (
          currentNews &&
          currentNews.image &&
          currentNews.image !== article.image
        ) {
          deleteImageFromStorage(currentNews.image).catch((err) =>
            console.warn("Notice deleting replaced news image:", err)
          );
        }
      } catch (checkErr) {
        console.warn("Notice checking news image replacement:", checkErr);
      }
    }

    const { error: updateError } = await supabaseAdmin
      .from("news")
      .update(updatePayload)
      .eq("id", article.id);

    if (updateError) {
      console.error("Supabase news update error:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    const updated = await fetchAllNews();
    const updatedItem = updated.find((item) => item.id === article.id) || article;

    return NextResponse.json({ success: true, article: updatedItem, data: updated });
  } catch (err) {
    console.error("Error updating news article:", err);
    return NextResponse.json(
      { error: "Failed to update news article" },
      { status: 500 }
    );
  }
}

// DELETE: Delete an article directly from Supabase and delete its image from storage
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

    // 1. Fetch news before deletion to obtain image URL
    let imageToDelete: string | null = null;
    try {
      const { data: newsData } = await supabaseAdmin
        .from("news")
        .select("image")
        .eq("id", id)
        .single();
      if (newsData && newsData.image) {
        imageToDelete = newsData.image;
      }
    } catch (fetchErr) {
      console.warn("Notice fetching news before deletion:", fetchErr);
    }

    // 2. Delete row from database
    const { error: deleteError } = await supabaseAdmin
      .from("news")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Supabase news delete error:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // 3. Delete image from storage
    if (imageToDelete) {
      deleteImageFromStorage(imageToDelete).catch((err) =>
        console.warn("Notice deleting news image from storage:", err)
      );
    }

    const updated = await fetchAllNews();
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("Error deleting news article:", err);
    return NextResponse.json(
      { error: "Failed to delete news article" },
      { status: 500 }
    );
  }
}
