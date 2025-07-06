"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FiTrash2 } from "react-icons/fi";
import { MenuItem } from "./types";

interface MenuItemsListProps {
  menuItems: MenuItem[];
  onRemoveItem: (id: string) => void;
}

export function MenuItemsList({ menuItems, onRemoveItem }: MenuItemsListProps) {
  if (menuItems.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>解析されたメニュー項目</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {menuItems.map((item, index) => (
            <div key={item.id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {item.originalName && (
                    <Badge variant="outline" className="text-xs">
                      {item.originalName}
                    </Badge>
                  )}

                  <div className="flex items-center gap-2 mb-2 pt-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <Badge variant="secondary">{item.category}</Badge>
                    <span className="text-lg font-bold text-green-600">
                      {item.currency || "¥"}
                      {typeof item.price === "number"
                        ? item.price.toLocaleString()
                        : "価格未定"}
                    </span>
                  </div>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {/* <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemoveItem(item.id)}
                >
                  <FiTrash2 />
                </Button> */}
              </div>
              {index < menuItems.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
