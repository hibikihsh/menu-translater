import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "画像ファイルが提供されていません" },
        { status: 400 }
      );
    }

    // ファイルをBase64に変換
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");
    const mimeType = file.type;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `この画像からメニューを解析して、以下のJSON形式で日本語に翻訳して返してください。料理の説明も魅力的で詳細に書いてください。
              レスポンス形式:
              {
                "menuItems": [
                  {
                    "name": "料理名（日本語）",
                    "originalName": "元の言語での料理名",
                    "description": "料理の詳細な説明（日本語、魅力的に）",
                    "price": 価格（数値）,
                    "currency": "通貨記号",
                    "category": "カテゴリ（日本語）"
                  }
                ],
                "restaurantInfo": {
                  "name": "レストラン名（もしあれば）",
                  "cuisine": "料理のジャンル（日本語）"
                }
              }

              注意事項：
              - 価格は数値のみで返してください
              - 説明は食材や調理方法、味の特徴を含めて魅力的に書いてください
              - カテゴリは「前菜」「メイン料理」「デザート」「飲み物」などに分類してください
              - JSON形式のみで返答し、余計な説明は含めないでください
              `,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
                detail: "high",
              },
            },
          ],
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "メニューの解析に失敗しました" },
        { status: 500 }
      );
    }

    try {
      // コードブロックを除去してJSONのみを抽出
      let cleanContent = content.trim();

      // ```json から ``` までのコードブロックを除去
      const jsonMatch = cleanContent.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        cleanContent = jsonMatch[1].trim();
      } else {
        // ```から```までのコードブロックを除去
        const codeMatch = cleanContent.match(/```\s*([\s\S]*?)\s*```/);
        if (codeMatch) {
          cleanContent = codeMatch[1].trim();
        }
      }

      // JSONレスポンスをパース
      const menuData = JSON.parse(cleanContent);
      return NextResponse.json(menuData);
    } catch (parseError) {
      console.error("JSON解析エラー:", parseError);
      console.error("元のコンテンツ:", content);
      return NextResponse.json(
        { error: "メニューデータの解析に失敗しました", content },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("画像解析エラー:", error);
    return NextResponse.json(
      { error: "画像の解析中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
