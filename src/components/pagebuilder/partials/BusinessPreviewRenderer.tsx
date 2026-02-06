import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, User, X } from "lucide-react";
import { useState } from "react";
import {
  BusinessBookRidePreview,
  BusinessFaqPreview,
  BusinessHeroPreview,
  BusinessPremiumFleetPreview,
  BusinessServicesPreview,
  BusinessSideImagePreview,
} from "./BusinessPreviewComponents";

// Mock Header Primary Component (Matched with Screenshot)
const HeaderPrimary = ({ language }: { language?: string }) => {
  const isArabic = language === "ar";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    {
      title: "Airport Transfers",
      arTitle: "خدمات النقل من وإلى المطار",
      hasDropdown: false,
    },
    { title: "Hourly Hire", arTitle: "تأجير بالساعة", hasDropdown: false },
    {
      title: "City To City",
      arTitle: "من مدينة إلى مدينة",
      hasDropdown: false,
    },
    {
      title: "Global Cities & Airports",
      arTitle: "مدن ومطارات عالمية",
      hasDropdown: true,
    },
    {
      title: "Business & Diplomats",
      arTitle: "رجال الأعمال والدبلوماسيون",
      hasDropdown: true,
    },
    { title: "Chauffeurs", arTitle: "السائقون", hasDropdown: false },
    { title: "Help", arTitle: "مساعدة", hasDropdown: false },
  ];

  return (
    <>
      <header
        className="absolute top-0 left-0 w-full z-50 bg-black/20 backdrop-blur-sm lg:bg-transparent py-4 lg:py-6 text-white overflow-hidden"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <div className="w-full lg:w-[94%] max-w-[1600px] mx-auto flex items-center justify-between px-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src="https://beta.limospro.com/Logos/logo-limospro-1.png"
              alt="LimosPro Logo"
              width={180}
              height={60}
              className="object-contain brightness-0 invert w-[140px] lg:w-[180px]"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://limospro-media.s3.amazonaws.com/Logos/logo-limospro-1.png";
              }}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {menuItems.map((item, idx) => (
              <div
                key={idx}
                className="relative group flex flex-col items-center"
              >
                <span
                  className="font-bold text-[14px] px-3 py-2 whitespace-nowrap cursor-pointer hover:bg-white/10 rounded-md transition-all group-hover:text-[#FFB300] flex items-center gap-1"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {isArabic ? item.arTitle : item.title}
                  {item.hasDropdown && <ChevronDown size={12} />}
                </span>
              </div>
            ))}

            {/* Language & User */}
            <div
              className={`flex items-center gap-6 ${isArabic ? "mr-4" : "ml-4"}`}
            >
              <span
                className="flex items-center gap-1 font-bold text-[14px] cursor-pointer hover:text-[#FFB300] transition-colors"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                <span className="text-lg">🌐</span>{" "}
                {isArabic ? "اللغة" : "Language"}
                <ChevronDown size={12} />
              </span>
              <div className="w-10 h-10 rounded-full border border-white/50 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                <User size={20} />
              </div>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-md transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-[100] lg:hidden"
            />
            {/* Sidebar Content */}
            <motion.div
              initial={{ x: isArabic ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: isArabic ? "-100%" : "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
              className={`fixed top-0 ${isArabic ? "left-0" : "right-0"} h-full w-[85%] max-w-[400px] bg-black text-white z-[101] lg:hidden flex flex-col p-8 overflow-y-auto`}
              dir={isArabic ? "rtl" : "ltr"}
            >
              {/* Close Button */}
              <button
                className="self-end p-2 hover:bg-white/10 rounded-full transition-colors mb-4"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X size={20} className="text-gray-400" />
              </button>

              {/* Navigation Items */}
              <nav className="flex flex-col">
                {menuItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between py-5 group cursor-pointer ${item.hasDropdown ? "border-b border-gray-600" : ""}`}
                  >
                    <span
                      className="font-bold text-[18px] group-hover:text-[#FFB300] transition-colors"
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      {isArabic ? item.arTitle : item.title}
                    </span>
                    {item.hasDropdown && (
                      <ChevronDown size={18} className="text-gray-400" />
                    )}
                  </div>
                ))}
                {/* Language Item */}
                <div className="flex items-center justify-between py-5 group cursor-pointer border-b border-gray-600">
                  <span
                    className="font-bold text-[18px] group-hover:text-[#FFB300] transition-colors"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {isArabic ? "اللغة" : "Language"}
                  </span>
                  <ChevronDown size={18} className="text-gray-400" />
                </div>
              </nav>

              {/* Action Buttons */}
              <div className="mt-auto pt-10 flex flex-col gap-5">
                <button className="w-full bg-[#FFB300] text-black font-bold py-4 rounded-md text-[17px] uppercase tracking-wider hover:bg-[#FFB300]/90 transition-colors">
                  {isArabic ? "تسجيل الدخول" : "SIGN IN"}
                </button>
                <button className="w-full bg-transparent border-2 border-white text-white font-bold py-4 rounded-md text-[17px] uppercase tracking-wider hover:bg-white/10 transition-colors">
                  {isArabic ? "يسجل" : "SIGN UP"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Mock Footer Component (Matched with Screenshot 2)
const FooterPrimary = ({ language }: { language?: string }) => {
  const isArabic = language === "ar";

  return (
    <footer
      className="w-full bg-[#001429] text-white pt-20 pb-12 mt-16 relative"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="w-[90%] max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-12 gap-y-16">
        {/* 1. Logo and Description */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <div className={`${isArabic ? "mr-0" : "ml-0"}`}>
            <img
              src="https://beta.limospro.com/Logos/logo-limospro-1.png"
              alt="LimosPro Logo"
              width={160}
              height={50}
              className="brightness-0 invert mb-2"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://limospro-media.s3.amazonaws.com/Logos/logo-limospro-1.png";
              }}
            />
          </div>
          <p
            className="text-[14px] text-gray-400 leading-relaxed font-medium"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {isArabic
              ? "خدمة ليموزين المطار ذات المستوى العالمي للعملاء المتطلبين الذين يطلبون التميز والرفاهية."
              : "World-class airport limousine service for discerning clients who demand excellence and luxury."}
          </p>
        </div>

        {/* 2. Destinations */}
        <div className="flex flex-col gap-5">
          <h4
            className="font-bold text-[18px]"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {isArabic ? "الوجهات" : "Destinations"}
          </h4>
          <ul
            className="space-y-4 text-[14px] text-gray-400 font-medium"
            style={{ fontFamily: "var(--font-varela)" }}
          >
            {[
              isArabic ? "USA Dallas Airport DFW" : "USA Dallas Airport DFW",
              isArabic ? "USA Dallas Airport DAL" : "USA Dallas Airport DAL",
              isArabic ? "USA Atlanta Airport ATL" : "USA Atlanta Airport ATL",
              isArabic ? "USA Houston Airport IAH" : "USA Houston Airport IAH",
              isArabic
                ? "Canada Toronto Airport YYZ"
                : "Canada Toronto Airport YYZ",
            ].map((item) => (
              <li
                key={item}
                className="hover:text-[#FFB300] cursor-pointer transition-colors"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Services */}
        <div className="flex flex-col gap-5">
          <h4
            className="font-bold text-[18px]"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {isArabic ? "الخدمات" : "Services"}
          </h4>
          <ul
            className="space-y-4 text-[14px] text-gray-400 font-medium"
            style={{ fontFamily: "var(--font-varela)" }}
          >
            {[
              isArabic ? "خدمات نقل المطار" : "Airport Transfers",
              isArabic ? "استئجار بالساعة" : "Hourly Hire",
              isArabic ? "من مدينة إلى مدينة" : "City to City",
            ].map((item) => (
              <li
                key={item}
                className="hover:text-[#FFB300] cursor-pointer transition-colors"
              >
                {item}
              </li>
            ))}
            <li className="flex items-center gap-2 text-[#FFB300] font-bold">
              <span className="w-5 h-5 rounded-full border border-[#FFB300] flex items-center justify-center text-[10px]">
                ✔
              </span>
              {isArabic ? "الشركات" : "Corporations"}
            </li>
            {[
              { en: "Diplomatic Services", ar: "الخدمات الدبلوماسية" },
              { en: "Events Planners", ar: "منظمو الفعاليات" },
              { en: "Travel Agents", ar: "وكلاء السفر" },
            ].map((item) => (
              <li
                key={item.en}
                className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors"
              >
                <span className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center text-[10px]">
                  ○
                </span>
                {isArabic ? item.ar : item.en}
              </li>
            ))}
          </ul>
        </div>

        {/* 4. Legal */}
        <div className="flex flex-col gap-5">
          <h4
            className="font-bold text-[18px]"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {isArabic ? "قانوني" : "Legal"}
          </h4>
          <ul
            className="space-y-4 text-[14px] text-gray-400 font-medium"
            style={{ fontFamily: "var(--font-varela)" }}
          >
            {[
              { en: "Terms of Service", ar: "شروط الخدمة" },
              { en: "Privacy Policy", ar: "سياسة الخصوصية" },
              { en: "Payment Policy", ar: "سياسة الدفع" },
              { en: "Merchant Policy", ar: "سياسة التاجر" },
              { en: "Partner's Agreement Policy", ar: "سياسة اتفاقية الشريك" },
              { en: "Sitemap", ar: "خريطة الموقع" },
            ].map((item) => (
              <li
                key={item.en}
                className="hover:text-[#FFB300] cursor-pointer transition-colors"
              >
                {isArabic ? item.ar : item.en}
              </li>
            ))}
          </ul>
        </div>

        {/* 5. Global Support & Newsletter */}
        <div className="flex flex-col gap-8">
          <div>
            <h4
              className="font-bold text-[18px] mb-5"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {isArabic ? "Global Support" : "Global Support"}
            </h4>
            <div
              className="space-y-3 text-[14px] text-gray-400 font-medium"
              style={{ fontFamily: "var(--font-varela)" }}
            >
              <p
                className={`flex items-center gap-3 hover:text-white cursor-pointer transition-colors ${isArabic ? "flex-row-reverse justify-end" : ""}`}
              >
                <span>📞</span> +1 (XXX) XXX-XXXX
              </p>
              <p
                className={`flex items-center gap-3 hover:text-white cursor-pointer transition-colors ${isArabic ? "flex-row-reverse justify-end" : ""}`}
              >
                <span>✉️</span> support@limospro.com
              </p>
            </div>
          </div>

          <div className="mt-4">
            <h4
              className="font-bold text-[18px] mb-5"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {isArabic ? "Newsletter" : "Newsletter"}
            </h4>
            <p
              className="text-[12px] text-gray-400 mb-5 font-medium"
              style={{ fontFamily: "var(--font-varela)" }}
            >
              {isArabic
                ? "اشترك لتلقي العروض والتحديثات الخاصة."
                : "Subscribe to receive special offers and updates."}
            </p>
            <div
              className={`flex items-center w-full ${isArabic ? "flex-row-reverse" : ""}`}
            >
              <input
                type="text"
                placeholder={isArabic ? "بريدك الإلكتروني" : "Your Email"}
                className={`bg-[#002142] border-none px-4 py-3 text-[14px] w-full focus:ring-1 focus:ring-[#FFB300] placeholder:text-gray-500 ${isArabic ? "rounded-r-md" : "rounded-l-md"}`}
              />
              <button
                className={`bg-[#FFB300] text-black px-5 py-3 hover:bg-[#FFB300]/90 transition-colors font-bold text-lg ${isArabic ? "rounded-l-md" : "rounded-r-md"}`}
              >
                {isArabic ? "◀" : "➜"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div
        className={`w-[90%] max-w-[1440px] mx-auto border-t border-gray-800/50 mt-20 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 relative ${isArabic ? "md:flex-row-reverse" : ""}`}
      >
        <p className="text-[12px] text-gray-500 font-medium">
          {isArabic
            ? "© حقوق الطبع والنشر 2026. جميع الحقوق محفوظة لـ LIMOSPRO™"
            : "© Copyright 2026. All rights reserved by LIMOSPRO™"}
        </p>
        <button className="bg-[#FFB300] text-black w-12 h-12 rounded-lg flex items-center justify-center font-bold text-2xl hover:bg-[#FFB300]/90 shadow-lg transition-transform hover:-translate-y-1">
          ↑
        </button>
      </div>
    </footer>
  );
};

interface BusinessPreviewRendererProps {
  data: {
    hero?: any;
    content?: any[];
    pageName?: string;
  };
  language?: string;
}

export default function BusinessPreviewRenderer({
  data,
  language,
}: BusinessPreviewRendererProps) {
  const { hero, content } = data;
  const isRTL = language === "ar";

  // Filter out any blocks without a type to prevent implementation warnings
  const safeContent = (content || []).filter(
    (block: any) => block && block.type,
  );

  return (
    <div
      className={`bg-white min-h-screen relative ${isRTL ? "text-right" : "text-left"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <HeaderPrimary language={language} />

      {/* Hero Section */}
      <BusinessHeroPreview hero={hero} language={language} />

      {/* Content Blocks */}
      <div className="flex flex-col">
        {safeContent.map((block: any, index: number) => {
          switch (block.type) {
            case "serviceSection":
              return (
                <BusinessServicesPreview
                  key={block.id || index}
                  block={block}
                  language={language}
                />
              );

            case "sideImageSection":
              return (
                <BusinessSideImagePreview
                  key={block.id || index}
                  block={block}
                  language={language}
                />
              );

            case "bookRideSection":
              return (
                <BusinessBookRidePreview
                  key={block.id || index}
                  block={block}
                  language={language}
                />
              );

            case "premiumFleetSection":
              return (
                <BusinessPremiumFleetPreview
                  key={block.id || index}
                  block={block}
                  language={language}
                />
              );

            case "faqSection":
              return (
                <BusinessFaqPreview
                  key={block.id || index}
                  block={block}
                  language={language}
                />
              );

            default:
              return (
                <div
                  key={index}
                  className="py-10 text-center text-gray-400 border-y border-dashed"
                >
                  Block type "{block.type}" rendering not implemented in
                  Business Preview.
                </div>
              );
          }
        })}
      </div>

      <FooterPrimary language={language} />
    </div>
  );
}
