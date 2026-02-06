import { CircleMinus, CirclePlus, Star } from "lucide-react";
import type React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Reusable Button with Business Styling
const BusinessCTAButton = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <Button
    className={cn(
      "text-black bg-gradient-to-r from-[#FFB300] to-[#E0A200] text-lg rounded-full font-bold px-10 py-6 hover:cursor-pointer w-fit",
      className,
    )}
    style={{ fontFamily: "var(--font-montserrat)" }}
  >
    {children}
  </Button>
);

const BlueGradientButton = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <Button
    className={cn(
      "bg-gradient-to-r from-[#0062C4] to-[#004C97] text-white text-base font-bold px-10 py-8 hover:cursor-pointer rounded-md",
      className,
    )}
    style={{ fontFamily: "var(--font-montserrat)" }}
  >
    {children}
  </Button>
);

// Hero Preview Component
export const BusinessHeroPreview = ({
  hero,
  language,
}: {
  hero: any;
  language?: string;
}) => {
  if (!hero) return null;
  const isArabic = language === "ar";
  return (
    <div className="flex flex-col w-full">
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {hero.image && (
          <img
            src={hero.image}
            alt={hero.alt || "Hero"}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 w-full flex justify-center items-center py-20 pt-32">
          <div className="w-full md:w-[80%] max-w-[1440px] px-4 flex flex-col gap-2 text-white">
            <h1
              style={{ fontFamily: "var(--font-montserrat)" }}
              className="font-bold text-4xl md:text-5xl lg:text-[70px] leading-tight"
            >
              {hero.h1 || "Trusted by Professionals."}
            </h1>
            <p
              style={{ fontFamily: "var(--font-montserrat)" }}
              className="font-bold text-xl md:text-2xl lg:text-[38px] opacity-90"
              dangerouslySetInnerHTML={{
                __html:
                  hero.h2 || hero.p || "Preferred by Diplomats. Ready for You.",
              }}
            />
            {hero.btn && (
              <div className="mt-8">
                <BusinessCTAButton className="uppercase font-bold tracking-wider">
                  {hero.btn || "BOOK A RIDE"}
                </BusinessCTAButton>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Hero Breadcrumb Area */}
      <div className="w-full bg-white border-b border-gray-100 flex justify-center py-10 px-4">
        <div className="w-full md:w-[80%] max-w-[1440px] flex items-center gap-3 text-sm font-medium">
          <span
            className="text-gray-500"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {isArabic ? "الأعمال والدبلوماسيون" : "Business & Diplomats"}
          </span>
          <span className="text-gray-400 transform rotate-0 rtl:rotate-180">
            ›
          </span>
          <span
            className="text-[#003366] font-bold"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {isArabic ? "الشركات" : "Corporations"}
          </span>
        </div>
      </div>
    </div>
  );
};

// Breadcrumb for Service Section
const PreviewBreadcrumb = ({
  service,
  subservice,
}: {
  service: string;
  subservice: string;
}) => (
  <nav className="py-8 w-full">
    <div className="flex items-center gap-2">
      <span
        className="text-gray-600 text-lg font-medium"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        {service}
      </span>
      <span className="text-gray-400">/</span>
      <span
        className="text-[#003366] text-lg font-medium"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        {subservice}
      </span>
    </div>
  </nav>
);

// Photo Card Preview
const BusinessPhotoCard = ({ src, alt, title, description }: any) => (
  <div className="flex flex-col h-full">
    <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
    <Card className="rounded-none rounded-b-lg p-4 flex-1 border-gray-100 shadow-sm">
      <CardHeader className="p-0">
        <h3
          style={{ fontFamily: "var(--font-montserrat)" }}
          className="font-bold text-[#003366] text-2xl mb-2"
        >
          {title}
        </h3>
      </CardHeader>
      <CardContent className="p-0">
        <div
          style={{ fontFamily: "var(--font-varela)" }}
          className="text-lg text-gray-700"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </CardContent>
    </Card>
  </div>
);

// Services Section Preview
export const BusinessServicesPreview = ({
  block,
  language,
}: {
  block: any;
  language?: string;
}) => {
  const content = block.serviceSection || block;
  const isArabic = language === "ar";
  return (
    <section className="w-full flex flex-col justify-center items-center py-8">
      <div className="w-[80%] max-w-[1440px]">
        <PreviewBreadcrumb
          service={content.service}
          subservice={content.subService}
        />

        <div
          className={`flex flex-col gap-4 py-8 ${isArabic ? "items-start" : "items-start"}`}
        >
          <div className="gap-2 flex flex-col">
            <p
              style={{ fontFamily: "var(--font-quicksand)" }}
              className="text-base lg:text-lg text-[#2C2C2C] font-semibold"
            >
              {content.headingTop}
            </p>
            <h2
              style={{ fontFamily: "var(--font-montserrat)" }}
              className="font-bold text-xl lg:text-3xl text-[#003366]"
            >
              {content.headingBottom}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch gap-4 w-full mt-3">
            {content.infoCards?.map((card: any, idx: number) => (
              <BusinessPhotoCard
                key={idx}
                src={card.src}
                alt={card.alt}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Side Image Section Preview (Matches ImageCardWithTextOnSide)
export const BusinessSideImagePreview = ({
  block,
  language,
}: {
  block: any;
  language?: string;
}) => {
  const isArabic = language === "ar";
  // In RTL, "image on left" means the image should be on the right side of the container visually if we use row-reverse.
  // Actually, dir="rtl" handles the flow. flex-row-reverse flips the order in the DOM flow.
  // LTR: imageLeft=true -> [Img, Content] (row), imageLeft=false -> [Content, Img] (row-reverse)
  // RTL: imageLeft=true -> [Content, Img] (row), imageLeft=false -> [Img, Content] (row-reverse)
  // Let's use a simpler approach:
  const rowClass = isArabic
    ? block.imageLeft
      ? "flex-col lg:flex-row-reverse"
      : "flex-col lg:flex-row"
    : block.imageLeft
      ? "flex-col lg:flex-row"
      : "flex-col lg:flex-row-reverse";

  return (
    <section className="w-full flex items-center justify-center py-16">
      <div
        className={`w-full lg:w-[80%] max-w-[1440px] px-4 flex gap-14 items-center ${rowClass}`}
      >
        {/* Image Section */}
        <div className="relative w-full overflow-hidden lg:basis-4/12 h-[450px] rounded-2xl shadow-lg">
          <img
            src={block.src}
            alt={block.alt}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="self-center w-full lg:basis-8/12">
          <p
            style={{ fontFamily: "var(--font-montserrat)" }}
            className="text-base text-[#2C2C2C] font-medium mb-1"
          >
            {block.headingTop}
          </p>
          <h2
            style={{ fontFamily: "var(--font-montserrat)" }}
            className="font-bold text-xl md:text-2xl lg:text-[38px] text-[#003366] leading-tight"
          >
            {block.headingBottom}
          </h2>
          <div
            style={{ fontFamily: "var(--font-montserrat)" }}
            className="text-base text-[#2C2C2C] font-medium mt-8 space-y-4"
            dangerouslySetInnerHTML={{ __html: block.description }}
          />
        </div>
      </div>
    </section>
  );
};

// Book Ride Section Preview (Matches BookARide.jsx)
export const BusinessBookRidePreview = ({
  block,
  language,
}: {
  block: any;
  language?: string;
}) => {
  const isArabic = language === "ar";
  return (
    <section className="w-full flex items-center justify-center px-4 py-16">
      <div className="w-full lg:w-[80%] max-w-[1440px] bg-[#FFFCF6] border border-[#FFB300] flex flex-col md:flex-row md:justify-between gap-6 md:items-center p-8 rounded-lg shadow-sm">
        <div className={isArabic ? "text-right" : "text-left"}>
          <h2
            style={{ fontFamily: "var(--font-montserrat)" }}
            className="text-xl lg:text-2xl font-bold mb-2"
          >
            {block.heading}
          </h2>
          <div
            style={{ fontFamily: "var(--font-varela)" }}
            className="text-base text-gray-700"
            dangerouslySetInnerHTML={{ __html: block.description }}
          />
        </div>
        <BlueGradientButton className="whitespace-nowrap">
          {block.btn || (isArabic ? "احجز الآن" : "Book Now")}
        </BlueGradientButton>
      </div>
    </section>
  );
};

// Price Card for Fleet Section
const BusinessPriceCard = ({
  src,
  alt,
  title,
  description,
  features,
  priceInfo,
  language,
}: any) => {
  const isArabic = language === "ar";
  return (
    <div className="flex flex-col h-full group">
      <div className="relative h-64 w-full overflow-hidden rounded-t-xl">
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className={`absolute bottom-4 ${isArabic ? "left-4" : "right-4"}`}>
          <BusinessCTAButton className="!px-6 !py-4 text-base">
            {isArabic ? "احجز الآن" : "Book Now"}
          </BusinessCTAButton>
        </div>
      </div>
      <Card className="rounded-none rounded-b-xl p-4 flex-1 border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <p
            style={{ fontFamily: "var(--font-varela)" }}
            className="text-sm text-gray-500"
          >
            {priceInfo || (isArabic ? "تبدأ من" : "Starting From")}
          </p>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={16}
                className="fill-[#FFB300] text-[#FFB300]"
              />
            ))}
          </div>
        </div>
        <h3
          style={{ fontFamily: "var(--font-montserrat)" }}
          className="font-semibold text-lg mb-2"
        >
          {title}
        </h3>
        <Separator className="my-3 bg-gray-100" />
        <ul className="space-y-2 mt-4">
          {features?.map((f: string, i: number) => (
            <li
              key={i}
              style={{ fontFamily: "var(--font-varela)" }}
              className="text-sm text-gray-700 flex items-start gap-2"
            >
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FFB300] shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

// Premium Fleet Section Preview
export const BusinessPremiumFleetPreview = ({
  block,
  language,
}: {
  block: any;
  language?: string;
}) => {
  return (
    <section className="w-full flex flex-col justify-center items-center py-16">
      <div className="w-[80%] max-w-[1440px]">
        <header className="gap-2 flex flex-col mb-10">
          <p
            style={{ fontFamily: "var(--font-quicksand)" }}
            className="text-base lg:text-lg text-[#2C2C2C] font-semibold"
          >
            {block.headingTop}
          </p>
          <h2
            style={{ fontFamily: "var(--font-montserrat)" }}
            className="font-bold text-xl lg:text-4xl text-[#003366]"
          >
            {block.headingBottom}
          </h2>
          <div
            style={{ fontFamily: "var(--font-varela)" }}
            className="text-base lg:text-lg text-gray-600 mt-4 max-w-4xl"
            dangerouslySetInnerHTML={{ __html: block.description }}
          />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch gap-6 w-full">
          {block.serviceCards?.map((card: any, idx: number) => {
            return (
              <BusinessPriceCard
                key={idx}
                src={card?.src}
                alt={card?.alt}
                title={card.title}
                features={card.features}
                priceInfo={card.heading}
                language={language}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

// FAQ Preview Component
export const BusinessFaqPreview = ({
  block,
  language,
}: {
  block: any;
  language?: string;
}) => {
  const isArabic = language === "ar";
  return (
    <section className="w-full flex flex-col justify-center items-center py-16">
      <div className="w-[80%] max-w-[1440px]">
        <div className={`mb-12 ${isArabic ? "text-right" : "text-left"}`}>
          <h2
            style={{ fontFamily: "var(--font-montserrat)" }}
            className="font-bold text-3xl lg:text-4xl text-[#003366]"
          >
            {block.heading ||
              (isArabic ? "الأسئلة الشائعة" : "Frequently Asked Questions")}
          </h2>
        </div>

        <Accordion
          type="single"
          collapsible
          defaultValue="item-1"
          className="flex flex-col w-full gap-6 bg-transparent"
        >
          {block.faqCards?.map((item: any, idx: number) => (
            <AccordionItem
              key={idx}
              value={`item-${idx + 1}`}
              className="rounded-md border last:border-b-1 border-[#2B5680] bg-[#F9F9F9] data-[state=open]:bg-white px-6 shadow-[0px_0px_40px_0px_#0000001A] transition-all duration-300"
            >
              <AccordionTrigger
                className="group py-6 text-base md:text-xl font-bold text-[#002447] hover:cursor-pointer hover:no-underline [&>svg]:hidden overflow-visible"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                <span className={isArabic ? "text-right" : "text-left"}>
                  {item.question}
                </span>

                <span className="relative size-10 flex items-center justify-center overflow-visible shrink-0">
                  <CirclePlus
                    strokeWidth={1}
                    className={`absolute size-7 transition-all duration-300 group-data-[state=open]:opacity-0 drop-shadow-[0_0_12px_rgba(0,0,0,0.16)] ${isArabic ? "left-0" : "right-0"}`}
                  />
                  <CircleMinus
                    strokeWidth={1}
                    className={`absolute size-7 opacity-0 transition-all duration-300 group-data-[state=open]:opacity-100 drop-shadow-[0_0_12px_rgba(0,0,0,0.16)] ${isArabic ? "left-0" : "right-0"}`}
                  />
                </span>
              </AccordionTrigger>
              <AccordionContent
                style={{ fontFamily: "var(--font-montserrat)" }}
                className="text-base md:text-lg font-medium text-[#757575] pb-6"
              >
                <div dangerouslySetInnerHTML={{ __html: item.answer }} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
