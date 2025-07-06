"use client";

import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { FiUpload } from "react-icons/fi";

interface ImageUploaderProps {
  onImageSelect: (imageDataUrl: string, file: File) => void;
  onError?: (error: string) => void;
  label?: string;
  className?: string;
  accept?: string;
  maxSize?: number; // MB
  showPreview?: boolean;
}

export interface ImageUploaderRef {
  reset: () => void;
}

export const ImageUploader = forwardRef<ImageUploaderRef, ImageUploaderProps>(
  (
    {
      onImageSelect,
      onError,
      className = "",
      accept = "image/*",
      maxSize = 10,
      showPreview = true,
    },
    ref
  ) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const reset = () => {
      setUploadedImage("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    useImperativeHandle(ref, () => ({
      reset,
    }));

    const handleFileSelect = (file: File) => {
      // ファイルタイプの検証
      if (!file.type.startsWith("image/")) {
        onError?.("画像ファイルを選択してください");
        return;
      }

      // ファイルサイズの検証
      if (file.size > maxSize * 1024 * 1024) {
        onError?.(`ファイルサイズは${maxSize}MB以下にしてください`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        onImageSelect(result, file);
        onError?.(""); // エラーをクリア
      };
      reader.readAsDataURL(file);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    };

    const handleDragOver = (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragOver(true);
    };

    const handleDragLeave = (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragOver(false);
    };

    const handleDrop = (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragOver(false);

      const files = event.dataTransfer.files;
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    };

    const handleDropZoneClick = () => {
      fileInputRef.current?.click();
    };

    return (
      <div className={className}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept={accept}
          className="hidden"
        />
        {/* Drag and drop zone */}
        <div
          onClick={handleDropZoneClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            mt-2 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${
              isDragOver
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }
            ${uploadedImage ? "border-green-500 bg-green-50" : ""}
          `}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <FiUpload
              className={`w-8 h-8 ${
                isDragOver ? "text-blue-500" : "text-gray-400"
              }`}
            />
            <div className="text-sm text-gray-600">
              <p className="font-medium">
                {uploadedImage
                  ? "画像がアップロードされました"
                  : isDragOver
                  ? "ここにファイルをドロップ"
                  : "クリックまたはドラッグ&ドロップで画像をアップロード"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF (最大{maxSize}MB)
              </p>
            </div>
          </div>
        </div>

        {/* Preview */}
        {showPreview && uploadedImage && (
          <div className="mt-4 border rounded-lg p-4">
            <img
              src={uploadedImage}
              alt="アップロードされた画像"
              className="h-auto max-h-64 mx-auto rounded"
            />
          </div>
        )}
      </div>
    );
  }
);

ImageUploader.displayName = "ImageUploader";
