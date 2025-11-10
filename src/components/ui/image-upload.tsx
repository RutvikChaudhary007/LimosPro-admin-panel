// @ts-nocheck

import { Image as ImageIcon, Link as LinkIcon, Loader, Upload, X } from "lucide-react";
import type React from "react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { mediaService } from "@/api/contentServices.api";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Input } from "./input";
import { Label } from "./label";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value = "",
  onChange,
  label = "Image",
  placeholder = "Enter image URL or upload file",
  className = "",
}) => {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value);
  const [uploadMode, setUploadMode] = useState<"url" | "upload">("url");

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error("File size must be less than 5MB");
        return;
      }

      try {
        setUploading(true);

        const uploadData = {
          file,
          category: "blog",
          folder: "blog-images",
          alt: file.name.split(".")[0],
        };

        const response = await mediaService.upload(uploadData);

        if (response.data?.fileUrl) {
          onChange(response.data.fileUrl);
          setUrlInput(response.data.fileUrl);
          toast.success("Image uploaded successfully");
        } else {
          throw new Error("No file URL returned");
        }
      } catch (error) {
        console.error("Error uploading image:", error);

        if (error instanceof Error && error.message.includes("404")) {
          toast.error("Media Upload Not Available", {
            description: "The media upload feature is not yet implemented. Please use image URLs instead.",
            duration: 6000,
          });
          setUploadMode("url");
        } else {
          toast.error("Failed to upload image. Please try again.");
        }
      } finally {
        setUploading(false);
      }
    },
    [onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrlInput(newUrl);
    onChange(newUrl);
  };

  const clearImage = () => {
    onChange("");
    setUrlInput("");
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <Label>{label}</Label>
        <div className="flex gap-2 mt-2 mb-4">
          <Button
            type="button"
            variant={uploadMode === "url" ? "default" : "outline"}
            size="sm"
            onClick={() => setUploadMode("url")}
          >
            <LinkIcon className="h-4 w-4 mr-1" />
            URL
          </Button>
          <Button
            type="button"
            variant={uploadMode === "upload" ? "default" : "outline"}
            size="sm"
            onClick={() => setUploadMode("upload")}
          >
            <Upload className="h-4 w-4 mr-1" />
            Upload
          </Button>
        </div>
      </div>

      {uploadMode === "url" ? (
        <div>
          <Input type="url" placeholder={placeholder} value={urlInput} onChange={handleUrlChange} />
        </div>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = handleFileInputChange;
                input.click();
              }}
            >
              {uploading ? (
                <div className="space-y-2">
                  <Loader className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                  <p className="text-sm text-gray-600">Uploading image...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />
          </CardContent>
        </Card>
      )}

      {/* Image Preview */}
      {value && (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <img
                src={value}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove("hidden");
                }}
              />
              <div className="hidden flex items-center justify-center w-full h-48 bg-gray-100 rounded-lg">
                <div className="text-center">
                  <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Failed to load image</p>
                </div>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500 break-all">{value}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageUpload;
