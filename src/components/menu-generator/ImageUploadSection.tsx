"use client";

import { RefObject } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ImageUploader,
  ImageUploaderRef,
} from "@/components/ui/image-uploader";
import { FiImage, FiLoader, FiUpload, FiRefreshCw } from "react-icons/fi";
import { MenuItem } from "./types";

interface ImageUploadSectionProps {
  error: string;
  uploadedFile: File | null;
  isAnalyzing: boolean;
  menuItems: MenuItem[];
  imageUploaderRef: RefObject<ImageUploaderRef | null>;
  onImageSelect: (imageDataUrl: string, file: File) => void;
  onImageError: (errorMessage: string) => void;
  onAnalyze: () => void;
  onReset: () => void;
}

export function ImageUploadSection({
  error,
  uploadedFile,
  isAnalyzing,
  menuItems,
  imageUploaderRef,
  onImageSelect,
  onImageError,
  onAnalyze,
  onReset,
}: ImageUploadSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FiImage />
          メニュー画像をアップロード
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-4">
          <ImageUploader
            ref={imageUploaderRef}
            onImageSelect={onImageSelect}
            onError={onImageError}
            maxSize={10}
            showPreview={true}
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={onAnalyze}
              disabled={!uploadedFile || isAnalyzing}
              className="flex-1"
            >
              {isAnalyzing ? (
                <>
                  <FiLoader className="mr-2 animate-spin" />
                  解析中...
                </>
              ) : (
                <>
                  <FiUpload className="mr-2" />
                  メニューを解析・翻訳
                </>
              )}
            </Button>
            {(menuItems.length > 0 || uploadedFile) && (
              <Button onClick={onReset} variant="outline" className="sm:w-auto">
                <FiRefreshCw className="mr-2" />
                リセット
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
