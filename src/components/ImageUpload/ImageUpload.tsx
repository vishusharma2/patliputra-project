"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import styles from "./ImageUpload.module.css";

interface ImageUploadProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  required?: boolean;
  hint?: string;
}

export default function ImageUpload({
  label = "Upload Image From Device",
  value,
  onChange,
  folder = "uploads",
  required = false,
  hint = "Supports PNG, JPG, WEBP, SVG",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const uploadFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/") && !/\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(file.name)) {
      setUploadError("Please select a valid image file (PNG, JPG, WEBP, SVG).");
      return;
    }

    const previousUrl = value;
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success && data.url) {
        onChange(data.url);

        // If replacing an existing custom upload, delete previous file from storage
        if (previousUrl && previousUrl !== data.url) {
          fetch(`/api/admin/upload?url=${encodeURIComponent(previousUrl)}`, {
            method: "DELETE",
          }).catch((err) => console.warn("Notice deleting replaced image:", err));
        }
      } else {
        setUploadError(data.error || "Failed to upload image from device.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError("Network error while uploading image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleChooseClick = () => {
    fileInputRef.current?.click();
  };

  // Remove image: deletes from Supabase Storage and clears state
  const handleRemove = async () => {
    const urlToDelete = value;
    onChange("");
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (urlToDelete) {
      try {
        await fetch(`/api/admin/upload?url=${encodeURIComponent(urlToDelete)}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.warn("Notice: could not delete file from storage immediately:", err);
      }
    }
  };

  return (
    <div className={styles.uploadContainer}>
      {label && (
        <label className={styles.uploadLabel}>
          <span>
            {label}
            {required && <span className={styles.requiredStar}>*</span>}
          </span>
          <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", fontWeight: 400 }}>
            {hint}
          </span>
        </label>
      )}

      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={styles.hiddenInput}
        aria-label="Upload image from device"
      />

      {/* When uploading */}
      {isUploading ? (
        <div className={styles.dropzone}>
          <div className={styles.loadingBox}>
            <div className={styles.spinner} />
            <span className={styles.loadingText}>Uploading image to storage...</span>
          </div>
        </div>
      ) : value ? (
        /* Image Preview State */
        <div className={styles.previewCard}>
          <div className={styles.previewTop}>
            <span className={styles.statusBadge}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Image uploaded &amp; ready to save</span>
            </span>

            <div className={styles.previewActions}>
              <button
                type="button"
                className={styles.btnReplace}
                onClick={handleChooseClick}
                title="Choose different image from device"
              >
                <span>📁 Change Image</span>
              </button>
              <button
                type="button"
                className={styles.btnRemove}
                onClick={handleRemove}
                title="Remove image"
              >
                <span>&times; Remove</span>
              </button>
            </div>
          </div>

          <div className={styles.previewImgWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Uploaded Preview" className={styles.previewImg} />
          </div>
        </div>
      ) : (
        /* Empty Dropzone to select file */
        <div
          className={`${styles.dropzone} ${dragActive ? styles.dropzoneActive : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleChooseClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleChooseClick();
            }
          }}
        >
          <div className={styles.iconWrap}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <span className={styles.uploadPrompt}>Click to upload image from device</span>
          <span className={styles.uploadSub}>or drag and drop your image file here</span>
          <button type="button" className={styles.chooseBtn} onClick={(e) => { e.stopPropagation(); handleChooseClick(); }}>
            <span>📁 Select File</span>
          </button>
        </div>
      )}

      {uploadError && <p className={styles.errorMsg}>⚠️ {uploadError}</p>}
    </div>
  );
}
