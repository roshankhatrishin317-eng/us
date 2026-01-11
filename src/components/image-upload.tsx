"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  accept?: "image" | "video" | "both";
  className?: string;
}

export function ImageUpload({ 
  value, 
  onChange, 
  onRemove,
  accept = "image",
  className = "" 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptTypes = {
    image: "image/jpeg,image/png,image/gif,image/webp",
    video: "video/mp4,video/webm,video/quicktime",
    both: "image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime",
  };

  const handleUpload = async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleRemove = async () => {
    if (!value) return;
    
    try {
      await fetch(`/api/upload?url=${encodeURIComponent(value)}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to delete file:", err);
    }
    
    onRemove?.();
  };

  const isVideo = value?.match(/\.(mp4|webm|mov)$/i);

  if (value) {
    return (
      <div className={`relative rounded-xl overflow-hidden bg-muted ${className}`}>
        {isVideo ? (
          <video 
            src={value} 
            controls 
            className="w-full h-48 object-cover"
          />
        ) : (
          <img 
            src={value} 
            alt="Uploaded" 
            className="w-full h-48 object-cover"
          />
        )}
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8"
          onClick={handleRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${dragActive 
            ? "border-primary bg-primary/10" 
            : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50"
          }
          ${isUploading ? "pointer-events-none opacity-60" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptTypes[accept]}
          onChange={handleFileChange}
          className="hidden"
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              {accept === "video" ? (
                <Video className="h-10 w-10" />
              ) : accept === "both" ? (
                <>
                  <ImageIcon className="h-8 w-8" />
                  <Video className="h-8 w-8" />
                </>
              ) : (
                <ImageIcon className="h-10 w-10" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Click or drag to upload</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {accept === "image" && "JPG, PNG, GIF, WebP (max 10MB)"}
              {accept === "video" && "MP4, WebM, MOV (max 50MB)"}
              {accept === "both" && "Images (10MB) or Videos (50MB)"}
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
