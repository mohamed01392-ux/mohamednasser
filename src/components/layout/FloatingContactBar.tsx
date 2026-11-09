"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Phone,
  ShieldCheck,
  X,
  Building2,
  Sparkles,
} from "lucide-react";
import { BRAND } from "@/lib/constants";

export default function FloatingContactBar() {
  const [collapsed, setCollapsed] = useState(false);

  const waText1 = encodeURIComponent(
    `مرحباً أ. عبدالله حسين، أرغب في الاستفسار أو عرض عقار جديد على منصة مأوى العقارية.`
  );
  const waText2 = encodeURIComponent(
    `مرحباً أ. عبدالله حسين، أود حجز موعد معاينة أو الاستفسار عن الوحدات المتاحة.`
  );

  return (
    <>
      {/* Floating Bottom Bar for Mobile & Desktop */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-forest/95 backdrop-blur-lg border-t border-sand/30 text-ivory py-2.5 px-3 sm:px-6 shadow-floating">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {/* Manager & Notice Info */}
          <div className="flex items-center gap-2.5 text-center sm:text-right">
            <div className="w-8 h-8 rounded-full bg-sand text-forest font-bold text-xs flex items-center justify-center shrink-0">
              ع
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 justify-center sm:justify-start">
                <span>{BRAND.managerName}</span>
                <span className="text-[10px] text-sand font-medium">({BRAND.managerTitle})</span>
              </span>
              <span className="text-[11px] text-sand-100/90 hidden sm:inline">
                لعرض عقارك أو حجز موعد معاينة خاصة فورية، تواصل مباشرة:
              </span>
            </div>
          </div>

          {/* Quick WhatsApp & Call Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
            {/* WhatsApp 1: 01120687700 */}
            <a
              href={`https://wa.me/${BRAND.whatsapp1}?text=${waText1}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
              title="محادثة واتساب مباشرة على 01120687700"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>واتساب 01120687700</span>
            </a>

            {/* WhatsApp 2: 01095052739 */}
            <a
              href={`https://wa.me/${BRAND.whatsapp2}?text=${waText2}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
              title="محادثة واتساب مباشرة على 01095052739"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>واتساب 01095052739</span>
            </a>

            {/* Admin Dashboard shortcut */}
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-xl bg-forest-800 hover:bg-forest-900 border border-sand/40 text-sand text-xs font-bold flex items-center justify-center gap-1 transition-all"
              title="التحكم الكامل في الموقع والمدير"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sand" />
              <span className="hidden md:inline">لوحة الإدارة</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
