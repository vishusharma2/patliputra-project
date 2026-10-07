import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src", "data", "projectsData.json");

async function readData() {
  try {
    const raw = await fs.readFile(dataFilePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading projects data:", err);
    return { delivered: [], ongoing: [] };
  }
}

async function writeData(data: unknown) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
}

// GET: Return all projects (delivered & ongoing)
export async function GET() {
  const data = await readData();
  return NextResponse.json(data);
}

// POST: Add a new project
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, project } = body;

    if (!category || !project || !project.name && !project.title) {
      return NextResponse.json(
        { error: "Invalid project payload" },
        { status: 400 }
      );
    }

    const data = await readData();

    if (category === "delivered") {
      const newDelivered = {
        id: project.id || `delivered-${Date.now()}`,
        name: project.name || "Untitled Project",
        location: project.location || "Patna",
        image: project.image || "/img/delivered/satyam.webp",
        description: project.description || "",
      };
      data.delivered = [newDelivered, ...data.delivered];
    } else if (category === "ongoing") {
      const newOngoing = {
        id: project.id || `ongoing-${Date.now()}`,
        type: project.type || "2 & 3 BHK",
        title: project.title || "Untitled Project",
        location: project.location || "Patna",
        area: project.area || "1,200 - 2,000 sq.ft.",
        price: project.price || "Price on Request",
        bedrooms: Number(project.bedrooms) || 3,
        bathrooms: Number(project.bathrooms) || 2,
        image:
          project.image ||
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
        tag: project.tag || "Under Construction",
        rera: project.rera || "BRERAP-PENDING",
        features: Array.isArray(project.features)
          ? project.features
          : ["Clubhouse Access", "24/7 Security", "Power Backup"],
      };
      data.ongoing = [newOngoing, ...data.ongoing];
    } else {
      return NextResponse.json(
        { error: "Invalid category. Must be 'delivered' or 'ongoing'" },
        { status: 400 }
      );
    }

    await writeData(data);
    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to add project";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE: Remove a project
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const id = searchParams.get("id");

    if (!category || !id) {
      return NextResponse.json(
        { error: "Category and ID query parameters are required" },
        { status: 400 }
      );
    }

    const data = await readData();

    if (category === "delivered") {
      data.delivered = data.delivered.filter(
        (p: { id: string }) => p.id !== id
      );
    } else if (category === "ongoing") {
      data.ongoing = data.ongoing.filter((p: { id: string }) => p.id !== id);
    } else {
      return NextResponse.json(
        { error: "Invalid category. Must be 'delivered' or 'ongoing'" },
        { status: 400 }
      );
    }

    await writeData(data);
    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to delete project";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
