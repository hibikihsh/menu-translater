import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export async function POST(request: NextRequest) {
  try {
    const { menuItems }: { menuItems: MenuItem[] } = await request.json();

    if (!menuItems || menuItems.length === 0) {
      return NextResponse.json(
        { error: "メニュー項目が提供されていません" },
        { status: 400 }
      );
    }

    // メニュー項目から画像生成のプロンプトを作成
    const menuText = menuItems
      .map((item, index) => {
        return `${index + 1}. ${item.name} (${
          item.category
        }) - ¥${item.price.toLocaleString()}
   ${item.description}`;
      })
      .join("\n\n");

    const prompt = `美しいメニュー表の画像を作成してください。以下のメニュー項目を含む、エレガントで読みやすいデザインにしてください：

${menuText}

デザインの要件：
- モダンで洗練されたレイアウト
- 読みやすいフォントとカラーリング
- 各料理の魅力が伝わる装飾的な要素
- レストランのメニューとして適切なプロフェッショナルな見た目
- 価格が明確に表示されている
- カテゴリごとに整理された構成`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    if (!response.data || response.data.length === 0) {
      return NextResponse.json(
        { error: "画像の生成に失敗しました" },
        { status: 500 }
      );
    }

    const imageUrl = response.data[0].url;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "画像の生成に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("画像生成エラー:", error);
    return NextResponse.json(
      { error: "画像の生成中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
