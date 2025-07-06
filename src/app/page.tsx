"use client";

import { MenuToImageGenerator } from "@/components/MenuToImageGenerator";
import { Accordion } from "@/components/ui/accordion";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            📋 Menu Translater
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            海外のメニューを日本語に翻訳することができます。
          </p>

          <div className="mt-6 mx-auto">
            <Accordion title="こんなときにおすすめ">
              <ul className="space-y-2 text-left mt-3">
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2 mt-1">✈️</span>
                  <span className="text-gray-700 text-sm">
                    海外旅行先のレストランで料理を選ぶ
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="text-orange-500 mr-2 mt-1">🍽️</span>
                  <span className="text-gray-700 text-sm">
                    外国料理の名前や説明を理解したい
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2 mt-1">👥</span>
                  <span className="text-gray-700 text-sm">
                    外国人の友達と一緒に食事をするとき
                  </span>
                </li>
              </ul>
            </Accordion>
          </div>
        </div>

        <MenuToImageGenerator />
      </div>
    </main>
  );
}
