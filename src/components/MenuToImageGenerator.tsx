"use client";

import { useState, useRef, useEffect } from "react";
import { ImageUploaderRef } from "@/components/ui/image-uploader";
import { MenuItem, MenuAnalysisResult } from "./menu-generator/types";
import { ImageUploadSection } from "./menu-generator/ImageUploadSection";
import { RestaurantInfoSection } from "./menu-generator/RestaurantInfoSection";
import { MenuItemsList } from "./menu-generator/MenuItemsList";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function MenuToImageGenerator() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<MenuAnalysisResult | null>(null);
  const [error, setError] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const imageUploaderRef = useRef<ImageUploaderRef>(null);

  // レスポンシブ対応のためのウィンドウサイズ監視
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleImageSelect = (_imageDataUrl: string, file: File) => {
    setUploadedFile(file);
    setError("");
  };

  const handleImageError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const analyzeMenuImage = async () => {
    if (!uploadedFile) {
      setError("画像を選択してください");
      return;
    }

    setIsAnalyzing(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", uploadedFile);

      const response = await fetch("/api/analyze-menu", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "画像解析に失敗しました");
      }

      setAnalysisResult(data);

      // 解析されたメニュー項目を状態に設定
      const itemsWithId = data.menuItems.map(
        (item: Omit<MenuItem, "id">, index: number) => ({
          ...item,
          id: `analyzed-${index}-${Date.now()}`,
        })
      );

      setMenuItems(itemsWithId);

      // 解析完了後にドロワーを開く
      setIsDrawerOpen(true);
    } catch (error) {
      console.error("メニュー解析エラー:", error);
      setError(
        error instanceof Error
          ? error.message
          : "画像解析中にエラーが発生しました"
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeMenuItem = (id: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  const resetAll = () => {
    setMenuItems([]);
    setAnalysisResult(null);
    setError("");
    setUploadedFile(null);
    setIsDrawerOpen(false);
    imageUploaderRef.current?.reset();
  };

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      <ImageUploadSection
        error={error}
        uploadedFile={uploadedFile}
        isAnalyzing={isAnalyzing}
        menuItems={menuItems}
        imageUploaderRef={imageUploaderRef}
        onImageSelect={handleImageSelect}
        onImageError={handleImageError}
        onAnalyze={analyzeMenuImage}
        onReset={resetAll}
      />

      {/* 解析結果がある場合は結果を表示するボタンを表示 */}
      {analysisResult && (
        <div className="flex justify-center">
          <Button onClick={openDrawer} variant="outline" className="gap-2">
            解析結果を表示
          </Button>
        </div>
      )}

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className={
            isMobile ? "h-[80vh] p-4" : "w-[600px] sm:max-w-[1000px] sm:p-6"
          }
        >
          <SheetHeader>
            <SheetTitle>メニュー解析結果</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto space-y-6">
            <RestaurantInfoSection analysisResult={analysisResult} />
            <MenuItemsList
              menuItems={menuItems}
              onRemoveItem={removeMenuItem}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
