import { supabaseAdmin } from "@/lib/supabase";

export interface ExtractedStorageInfo {
  bucketName: string;
  storagePath: string;
}

/**
 * Dynamically parses the bucket name and file path from any Supabase public URL or relative path
 */
export function parseSupabaseStorageUrl(
  imageUrl: string,
  defaultBucket = "project images"
): ExtractedStorageInfo | null {
  if (!imageUrl || typeof imageUrl !== "string") return null;

  const publicMarker = "/storage/v1/object/public/";
  const markerIdx = imageUrl.indexOf(publicMarker);

  if (markerIdx !== -1) {
    const afterMarker = imageUrl.slice(markerIdx + publicMarker.length);
    const slashIdx = afterMarker.indexOf("/");
    if (slashIdx !== -1) {
      let bucket = decodeURIComponent(
        afterMarker.slice(0, slashIdx).replace(/\+/g, " ")
      );
      let rawPath = afterMarker.slice(slashIdx + 1);
      rawPath = rawPath.split("?")[0].split("#")[0];
      const storagePath = decodeURIComponent(rawPath);
      return {
        bucketName: bucket || defaultBucket,
        storagePath,
      };
    }
  }

  // Local /uploads/ pattern
  if (imageUrl.startsWith("/uploads/")) {
    let rawPath = imageUrl.replace(/^\/uploads\//, "");
    rawPath = rawPath.split("?")[0].split("#")[0];
    return {
      bucketName: defaultBucket,
      storagePath: decodeURIComponent(rawPath),
    };
  }

  // If already relative path (e.g. "Blogs/1728...png" without protocol or leading slash)
  if (
    !imageUrl.startsWith("http://") &&
    !imageUrl.startsWith("https://") &&
    !imageUrl.startsWith("/")
  ) {
    let rawPath = imageUrl.split("?")[0].split("#")[0];
    return {
      bucketName: defaultBucket,
      storagePath: decodeURIComponent(rawPath),
    };
  }

  return null;
}

/**
 * Extracts relative storage path from a full public Supabase or local image URL
 */
export function extractStoragePath(
  imageUrl: string,
  defaultBucket = "project images"
): string | null {
  const parsed = parseSupabaseStorageUrl(imageUrl, defaultBucket);
  return parsed ? parsed.storagePath : null;
}

/**
 * Deletes an image from Supabase Storage and local fallback
 */
export async function deleteImageFromStorage(
  imageUrl: string,
  defaultBucket = "project images"
): Promise<boolean> {
  if (!imageUrl) return false;

  const parsed = parseSupabaseStorageUrl(imageUrl, defaultBucket);
  if (!parsed || !parsed.storagePath) return false;

  const { bucketName, storagePath } = parsed;
  let deleted = false;

  // 1. Delete from Supabase Storage
  if (supabaseAdmin) {
    try {
      const pathsToRemove = Array.from(
        new Set([storagePath, encodeURI(storagePath)])
      );
      const { data, error } = await supabaseAdmin.storage
        .from(bucketName)
        .remove(pathsToRemove);

      if (!error && data && data.length > 0) {
        deleted = true;
      } else if (error) {
        console.warn(
          `Notice: could not delete from Supabase storage [${bucketName}]:`,
          error.message
        );
      }
    } catch (err) {
      console.warn("Storage deletion exception:", err);
    }
  }

  // 2. Delete from local public/uploads directory if present (Node.js runtime only)
  if (typeof window === "undefined") {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const localFilePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        storagePath
      );
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        deleted = true;
      }
    } catch (err) {
      console.warn("Local storage file delete notice:", err);
    }
  }

  return deleted;
}
