export interface MenuItem {
  id: string;
  name: string;
  originalName?: string;
  description: string;
  price: number | null;
  currency?: string;
  category: string;
}

export interface MenuAnalysisResult {
  menuItems: Omit<MenuItem, "id">[];
  restaurantInfo?: {
    name?: string;
    cuisine?: string;
  };
}
