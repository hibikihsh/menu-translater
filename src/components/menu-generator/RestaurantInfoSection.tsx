"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MenuAnalysisResult } from "./types";

interface RestaurantInfoSectionProps {
  analysisResult: MenuAnalysisResult | null;
}

export function RestaurantInfoSection({
  analysisResult,
}: RestaurantInfoSectionProps) {
  if (!analysisResult?.restaurantInfo) {
    return null;
  }

  const { name, cuisine } = analysisResult.restaurantInfo;

  if (!name && !cuisine) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>レストラン情報</CardTitle>
      </CardHeader>
      <CardContent>
        {name && (
          <div className="mb-2">
            <strong>レストラン名:</strong> {name}
          </div>
        )}
        {cuisine && (
          <div>
            <strong>料理ジャンル:</strong> {cuisine}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
