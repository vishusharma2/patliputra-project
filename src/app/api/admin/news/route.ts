import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src", "data", "newsData.json");

async function readData() {
  try {
    const raw = await fs.readFile(dataFilePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading news data:", err);
    return [];
  }
}

async function writeData(data: unknown) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
}

// GET: Return all news items
export async function GET() {
  const data = await readData();
  return NextResponse.json(data);
}

// POST: Add a new news article (prepends to top so it's the latest)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const article = body.article || body;

    if (!article || (!article.headline && !article.englishTitle)) {
      return NextResponse.json(
        { error: "Headline or Title is required" },
        { status: 400 }
      );
    }

    const data = await readData();

    const newArticle = {
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
      highlights: Array.isArray(article.highlights)
        ? article.highlights
        : article.highlights
        ? article.highlights.split(",").map((s: string) => s.trim())
        : [],
    };

    // Prepend to top so it's the latest
    const updated = [newArticle, ...data];
    await writeData(updated);

    return NextResponse.json({ success: true, article: newArticle, data: updated });
  } catch (err) {
    console.error("Error adding news article:", err);
    return NextResponse.json(
      { error: "Failed to add news article" },
      { status: 500 }
    );
  }
}

// PUT: Update an existing article
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const article = body.article || body;

    if (!article || !article.id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    const data = await readData();
    const index = data.findIndex((item: { id: string }) => item.id === article.id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    data[index] = {
      ...data[index],
      ...article,
      highlights: Array.isArray(article.highlights)
        ? article.highlights
        : typeof article.highlights === "string"
        ? article.highlights.split(",").map((s: string) => s.trim())
        : data[index].highlights,
    };

    await writeData(data);
    return NextResponse.json({ success: true, article: data[index], data });
  } catch (err) {
    console.error("Error updating news article:", err);
    return NextResponse.json(
      { error: "Failed to update news article" },
      { status: 500 }
    );
  }
}

// DELETE: Delete an article
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const data = await readData();
    const filtered = data.filter((item: { id: string }) => item.id !== id);

    await writeData(filtered);
    return NextResponse.json({ success: true, data: filtered });
  } catch (err) {
    console.error("Error deleting news article:", err);
    return NextResponse.json(
      { error: "Failed to delete news article" },
      { status: 500 }
    );
  }
}
