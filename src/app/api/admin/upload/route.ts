import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { extractStoragePath, deleteImageFromStorage } from "@/lib/storage";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided in request" },
        { status: 400 }
      );
    }

    // Validate image MIME type
    if (
      !file.type.startsWith("image/") &&
      !/\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(file.name)
    ) {
      return NextResponse.json(
        {
          error:
            "Uploaded file must be an image (PNG, JPG, WEBP, SVG, GIF, AVIF)",
        },
        { status: 400 }
      );
    }

    // Clean filename
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `${folder}/${Date.now()}-${cleanFileName}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let publicUrl = "";

    // 1. Try uploading to Supabase Storage bucket 'project images'
    if (supabaseAdmin) {
      try {
        const { data, error: uploadError } = await supabaseAdmin.storage
          .from("project images")
          .upload(storagePath, buffer, {
            contentType: file.type || "image/png",
            upsert: true,
          });

        if (!uploadError && data) {
          const { data: pubData } = supabaseAdmin.storage
            .from("project images")
            .getPublicUrl(storagePath);
          if (pubData && pubData.publicUrl) {
            publicUrl = pubData.publicUrl;
          }
        } else if (uploadError) {
          console.warn("Supabase Storage upload warning:", uploadError.message);
        }
      } catch (storageErr) {
        console.warn("Supabase Storage exception:", storageErr);
      }
    }

    // 2. Fallback to local public/uploads directory if Supabase was unavailable
    if (!publicUrl) {
      const localDir = path.join(process.cwd(), "public", "uploads", folder);
      if (!fs.existsSync(localDir)) {
        fs.mkdirSync(localDir, { recursive: true });
      }
      const localFilePath = path.join(
        localDir,
        `${Date.now()}-${cleanFileName}`
      );
      fs.writeFileSync(localFilePath, buffer);
      publicUrl = `/uploads/${folder}/${path.basename(localFilePath)}`;
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: cleanFileName,
    });
  } catch (err: unknown) {
    console.error("Error handling image upload:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Internal error uploading image",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const parsedUrl = new URL(req.url);
    let targetUrl = parsedUrl.searchParams.get("url") || "";

    if (!targetUrl) {
      try {
        const body = await req.json();
        targetUrl = body?.url || "";
      } catch {
        // no body provided
      }
    }

    if (!targetUrl) {
      return NextResponse.json(
        { error: "Image URL is required for deletion" },
        { status: 400 }
      );
    }

    const success = await deleteImageFromStorage(targetUrl);

    return NextResponse.json({
      success: true,
      deleted: success,
      message: "Image successfully removed from database storage.",
    });
  } catch (err: unknown) {
    console.error("Error deleting image from storage:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to delete image from storage",
      },
      { status: 500 }
    );
  }
}
