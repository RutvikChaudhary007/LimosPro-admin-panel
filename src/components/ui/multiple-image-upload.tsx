// @ts-nocheck

import { Image as ImageIcon, Link as LinkIcon, Loader, Plus, Upload, X } from "lucide-react";
import type React from "react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { mediaService } from "../../api/contentServices.api";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Input } from "./input";
import { Label } from "./label";

interface MultipleImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  maxImages?: number;
  className?: string;
}

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  value = [],
  onChange,
  label = "Images",
  maxImages = 10,
  className = "",
}) => {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [uploadMode, setUploadMode] = useState<"url" | "upload">("url");

  const handleFileUpload = useCallback(
    async (files: FileList) => {
      const fileArray = Array.from(files);

      // Validate file count
      if (value.length + fileArray.length > maxImages) {
        toast.error(`Maximum ${maxImages} images allowed`);
        return;
      }

      // Validate file types
      const invalidFiles = fileArray.filter((file) => !file.type.startsWith("image/"));
      if (invalidFiles.length > 0) {
        toast.error("Please select only image files");
        return;
      }

      // Validate file sizes (5MB limit each)
      const maxSize = 5 * 1024 * 1024; // 5MB
      const oversizedFiles = fileArray.filter((file) => file.size > maxSize);
      if (oversizedFiles.length > 0) {
        toast.error("Each file must be less than 5MB");
        return;
      }

      try {
        setUploading(true);

        const uploadResults = await mediaService.uploadMultiple(fileArray, "blog", "blog-images");

        if (uploadResults.data && Array.isArray(uploadResults.data)) {
          const newUrls = uploadResults.data.filter((item) => item?.fileUrl).map((item) => item.fileUrl);

          onChange([...value, ...newUrls]);
          toast.success(`${newUrls.length} image(s) uploaded successfully`);
        } else {
          throw new Error("No file URLs returned");
        }
      } catch (error) {
        console.error("Error uploading images:", error);

        if (error instanceof Error && error.message.includes("404")) {
          toast.error("Media Upload Not Available", {
            description: "The media upload feature is not yet implemented. Please use image URLs instead.",
            duration: 6000,
          });
          setUploadMode("url");
        } else {
          toast.error("Failed to upload images. Please try again.");
        }
      } finally {
        setUploading(false);
      }
    },
    [onChange, value, maxImages],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files);
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
      handleFileUpload(files);
    }
  };

  const addUrl = () => {
    if (!urlInput.trim()) return;

    if (value.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    if (value.includes(urlInput.trim())) {
      toast.error("This image URL is already added");
      return;
    }

    onChange([...value, urlInput.trim()]);
    setUrlInput("");
  };

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <Label>
          {label} ({value.length}/{maxImages})
        </Label>
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
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="Enter image URL"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
          />
          <Button type="button" onClick={addUrl} disabled={!urlInput.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
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
                input.multiple = true;
                input.onchange = handleFileInputChange;
                input.click();
              }}
            >
              {uploading ? (
                <div className="space-y-2">
                  <Loader className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                  <p className="text-sm text-gray-600">Uploading images...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each (max {maxImages})</p>
                  </div>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" multiple onChange={handleFileInputChange} className="hidden" />
          </CardContent>
        </Card>
      )}

      {/* Image Grid */}
      {value.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {value.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                  <div className="hidden flex items-center justify-center w-full h-32 bg-gray-100 rounded-lg">
                    <div className="text-center">
                      <ImageIcon className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                      <p className="text-xs text-gray-500">Failed to load</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {url}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MultipleImageUpload;
