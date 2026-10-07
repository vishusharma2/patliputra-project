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

// GET: Return all projects (delivered & ongoing) in ascending chronological order
export async function GET() {
  const data = await readData();
  if (Array.isArray(data.delivered)) {
    data.delivered.sort(
      (a: { order?: number }, b: { order?: number }) =>
        (a.order ?? 0) - (b.order ?? 0)
    );
  }
  if (Array.isArray(data.ongoing)) {
    data.ongoing.sort(
      (a: { order?: number }, b: { order?: number }) =>
        (a.order ?? 0) - (b.order ?? 0)
    );
  }
  return NextResponse.json(data);
}

// POST: Add a new project
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, project } = body;

    if (!category || !project || (!project.name && !project.title)) {
      return NextResponse.json(
        { error: "Invalid project payload" },
        { status: 400 }
      );
    }

    const data = await readData();

    if (category === "delivered") {
      const nextOrder = data.delivered.length + 1;
      const newDelivered = {
        id: project.id || `delivered-${Date.now()}`,
        order: nextOrder,
        name: project.name || "Untitled Project",
        location: project.location || "Patna",
        image: project.image || "/img/delivered/satyam.webp",
        description: project.description || "",
      };
      data.delivered = [...data.delivered, newDelivered];
    } else if (category === "ongoing") {
      const nextOrder = data.ongoing.length + 1;
      const newOngoing = {
        id: project.id || `ongoing-${Date.now()}`,
        order: nextOrder,
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
      data.ongoing = [...data.ongoing, newOngoing];
    } else {
      return NextResponse.json(
        { error: "Invalid category. Must be 'delivered' or 'ongoing'" },
        { status: 400 }
      );
    }

    await writeData(data);
    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to add project";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE: Remove a project and preserve sequential chronological ordering
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
      data.delivered = data.delivered
        .filter((p: { id: string }) => p.id !== id)
        .map((p: Record<string, unknown>, idx: number) => ({
          ...p,
          order: idx + 1,
        }));
    } else if (category === "ongoing") {
      data.ongoing = data.ongoing
        .filter((p: { id: string }) => p.id !== id)
        .map((p: Record<string, unknown>, idx: number) => ({
          ...p,
          order: idx + 1,
        }));
    } else {
      return NextResponse.json(
        { error: "Invalid category. Must be 'delivered' or 'ongoing'" },
        { status: 400 }
      );
    }

    await writeData(data);
    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to delete project";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT: Update an existing project's info
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { category, project } = body;

    if (!category || !project || !project.id) {
      return NextResponse.json(
        { error: "Category and project ID are required" },
        { status: 400 }
      );
    }

    const data = await readData();

    if (category === "delivered") {
      const index = data.delivered.findIndex(
        (p: { id: string }) => p.id === project.id
      );
      if (index === -1) {
        return NextResponse.json(
          { error: "Delivered project not found" },
          { status: 404 }
        );
      }
      data.delivered[index] = {
        ...data.delivered[index],
        name: project.name ?? data.delivered[index].name,
        location: project.location ?? data.delivered[index].location,
        image: project.image ?? data.delivered[index].image,
        description: project.description ?? data.delivered[index].description,
        order:
          project.order !== undefined
            ? Number(project.order)
            : data.delivered[index].order,
      };
    } else if (category === "ongoing") {
      const index = data.ongoing.findIndex(
        (p: { id: string }) => p.id === project.id
      );
      if (index === -1) {
        return NextResponse.json(
          { error: "Ongoing project not found" },
          { status: 404 }
        );
      }
      data.ongoing[index] = {
        ...data.ongoing[index],
        title: project.title ?? data.ongoing[index].title,
        type: project.type ?? data.ongoing[index].type,
        location: project.location ?? data.ongoing[index].location,
        area: project.area ?? data.ongoing[index].area,
        price: project.price ?? data.ongoing[index].price,
        bedrooms:
          project.bedrooms !== undefined
            ? Number(project.bedrooms)
            : data.ongoing[index].bedrooms,
        bathrooms:
          project.bathrooms !== undefined
            ? Number(project.bathrooms)
            : data.ongoing[index].bathrooms,
        image: project.image ?? data.ongoing[index].image,
        tag: project.tag ?? data.ongoing[index].tag,
        rera: project.rera ?? data.ongoing[index].rera,
        features: Array.isArray(project.features)
          ? project.features
          : data.ongoing[index].features,
        order:
          project.order !== undefined
            ? Number(project.order)
            : data.ongoing[index].order,
      };
    } else {
      return NextResponse.json(
        { error: "Invalid category. Must be 'delivered' or 'ongoing'" },
        { status: 400 }
      );
    }

    await writeData(data);
    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to update project";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

