import { Button } from "@/components/ui/button";

// Mock Header Primary Component
const HeaderPrimary = () => (
  <header className="w-full z-50">
    <div className="w-full lg:w-[90%] max-w-[1440px] py-5 mx-auto flex items-center justify-between">
      <div className="hidden lg:flex items-center justify-evenly w-full">
        {/* Logo */}
        <a href="/">
          <img
            src="https://beta.limospro.com/_next/image?url=%2FLogos%2Flogo-limospro-1.png&w=256&q=75"
            alt="Limospro Logo"
            width={200}
            height={60}
            className="object-contain hover:cursor-pointer"
          />
        </a>

        {/* Menu items - simplified */}
        <div className="flex items-center gap-6">
          <a
            href="/services"
            className="text-white font-bold text-base"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Services
          </a>
          <a
            href="/fleet"
            className="text-white font-bold text-base"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Fleet
          </a>
          <a
            href="/about"
            className="text-white font-bold text-base"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            About Us
          </a>
          <a
            href="/contact"
            className="text-white font-bold text-base"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Contact
          </a>
        </div>

        {/* Sign In button */}
        <Button
          style={{ fontFamily: "var(--font-montserrat)" }}
          className="bg-[#FFB300] font-bold text-black py-2 px-6 rounded-full hover:cursor-pointer hover:text-white hover:bg-[#FFB300]"
        >
          SIGN IN
        </Button>
      </div>
    </div>
  </header>
);

// Mock Footer Component
const FooterPrimary = () => (
  <footer className="w-full bg-gradient-to-r from-[#000911] to-[#001F3E] flex items-center justify-center">
    <div className="w-full  flex flex-col py-16">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 justify-between">
        {/* Logo and description */}
        <div className="flex flex-col gap-6">
          <img
            src="https://beta.limospro.com/_next/image?url=%2FLogos%2Flogo-limospro-1.png&w=256&q=75"
            alt="Limospro Logo"
            width={300}
            height={100}
            className="hover:cursor-pointer"
          />
          <p
            style={{ fontFamily: "var(--font-montserrat)" }}
            className="text-white text-base"
          >
            World-class airport limousine service for discerning clients who
            demand excellence and luxury.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-6">
          <p
            style={{ fontFamily: "var(--font-montserrat)" }}
            className="font-bold text-lg text-white"
          >
            Quick Links
          </p>
          <div className="flex flex-col gap-3">
            {["Services", "Fleet", "About Us", "Contact", "Blog"].map(
              (link) => (
                <a key={link} href="#">
                  <p
                    style={{ fontFamily: "var(--font-montserrat)" }}
                    className="text-base text-white hover:underline"
                  >
                    {link}
                  </p>
                </a>
              ),
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-6">
          <p
            style={{ fontFamily: "var(--font-montserrat)" }}
            className="font-bold text-lg text-white"
          >
            Contact Us
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-2">
              <span className="text-white mt-1">📍</span>
              <p
                style={{ fontFamily: "var(--font-montserrat)" }}
                className="text-base text-white"
              >
                123 Luxury Avenue, Suite 500
                <br />
                New York, NY 10001
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white">📞</span>
              <p
                style={{ fontFamily: "var(--font-montserrat)" }}
                className="text-base text-white"
              >
                +1 (212) 555-1234
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white">✉️</span>
              <p
                style={{ fontFamily: "var(--font-montserrat)" }}
                className="text-base text-white"
              >
                info@limospro.com
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-6">
          <p
            style={{ fontFamily: "var(--font-montserrat)" }}
            className="font-bold text-lg text-white"
          >
            Newsletter
          </p>
          <div className="flex flex-col gap-3">
            <p
              style={{ fontFamily: "var(--font-montserrat)" }}
              className="text-base text-white"
            >
              Subscribe to receive special offers and updates.
            </p>
            <div className="flex items-center border border-yellow-500 rounded-md overflow-hidden bg-transparent pr-5">
              <input
                type="email"
                placeholder="Your Email"
                className="flex-1 px-4 py-4 text-gray-200 bg-transparent outline-none placeholder-gray-400"
              />
              <button className="bg-yellow-500 hover:bg-yellow-600 text-black p-2 flex items-center justify-center hover:cursor-pointer">
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="hidden lg:flex flex-row justify-between items-center pt-16">
        <p
          style={{ fontFamily: "var(--font-montserrat)" }}
          className="text-base text-white"
        >
          © Copyright 2025. All rights reserved by LIMOSPRO™
        </p>
        <div className="flex flex-row gap-5">
          <p
            style={{ fontFamily: "var(--font-montserrat)" }}
            className="text-base text-white hover:underline cursor-pointer"
          >
            Privacy Policy
          </p>
          <p
            style={{ fontFamily: "var(--font-montserrat)" }}
            className="text-base text-white hover:underline cursor-pointer"
          >
            Terms of Service
          </p>
          <p
            style={{ fontFamily: "var(--font-montserrat)" }}
            className="text-base text-white hover:underline cursor-pointer"
          >
            Sitemap
          </p>
        </div>
      </div>
    </div>
  </footer>
);

// Content Components Types
interface InfoCardProps {
  src: string;
  alt: string;
  title: string;
  description: string;
  height?: number;
  width?: number;
  orientation?: string;
  fontColour?: string;
}

interface ServiceCardProps {
  src: string;
  alt: string;
  title: string;
  description: string;
  button?: string;
  btnTitle?: string;
  fontColour?: string;
  fontWidth?: string;
  fontSize?: string;
}

interface ImageCardHelperProps {
  imageLeft?: boolean;
  src: string;
  alt: string;
  title: string;
  description: string | string[];
  info?: string;
  button?: string;
  btnTitle?: string;
  fontName?: string;
  leading?: string;
}

interface BlockData {
  type: string;
  service?: string;
  subService?: string;
  infoCards?: InfoCardProps[];
  infocards?: InfoCardProps[];
  img?: string;
  textRich?: string;
  serviceCards?: ServiceCardProps[];
  imageCards?: ImageCardHelperProps[];
  btnTitle?: string;
}

// Content Components (same as before but with img tags)
const InfoCard = ({
  src,
  alt,
  title,
  description,
  height,
  width,
  orientation,
  fontColour,
}: InfoCardProps) => (
  <div className="bg-white p-4 rounded-lg shadow border flex flex-col h-full">
    <div className={`flex ${orientation} gap-4 mb-3`}>
      <img
        src={src}
        alt={alt}
        height={height}
        width={width}
        className="shrink-0 object-contain"
      />
      <h3
        className={`font-bold text-xl ${fontColour}`}
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        {title}
      </h3>
    </div>
    <div
      style={{ fontFamily: "var(--font-varela)" }}
      className="text-gray-700"
      dangerouslySetInnerHTML={{ __html: description }}
    ></div>
  </div>
);

const ServiceCard = ({
  src,
  alt,
  title,
  description,
  button,
  fontColour,
  fontWidth,
  fontSize,
}: ServiceCardProps) => (
  <div className="bg-[#F9F9F9] rounded-xl overflow-hidden border">
    <div className="relative h-48">
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
    <div className="p-4">
      <h3
        className={`${fontWidth} ${fontColour} ${fontSize} mb-2`}
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        {title}
      </h3>
      <div
        style={{ fontFamily: "var(--font-varela)" }}
        className="text-[#2C2C2C] mb-4"
        dangerouslySetInnerHTML={{ __html: description }}
      />
      {button && (
        <Button className="w-full bg-[#FFB300] hover:bg-blue-600 text-black hover:text-white py-3">
          {button}
        </Button>
      )}
    </div>
  </div>
);

const ImageCardWithTextOnSideAndButton = ({
  imageLeft = true,
  src,
  alt,
  title,
  description,
  info,
  // button,
  btnTitle,
  fontName,
  leading,
}: ImageCardHelperProps) => (
  <div
    className={`flex flex-col ${imageLeft ? "" : "md:flex-row-reverse"} md:flex-row gap-6 w-full`}
  >
    <div className="md:w-2/5 relative">
      <div className="relative h-64">
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover rounded-lg"
        />
      </div>
    </div>
    <div className="md:w-3/5">
      <h2
        className="text-2xl font-bold text-[#003366] mb-4"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        {title}
      </h2>
      {Array.isArray(description) && (
        <ul className="space-y-2 mb-4">
          {description.map((d, idx) => (
            <li
              key={idx}
              className={`${leading}`}
              style={{ color: "black", fontFamily: `var(--font-${fontName})` }}
              dangerouslySetInnerHTML={{ __html: d }}
            />
          ))}
        </ul>
      )}
      {info && (
        <div
          className="mb-4"
          style={{ fontFamily: "var(--font-varela)" }}
          dangerouslySetInnerHTML={{ __html: info }}
        ></div>
      )}
      {btnTitle && (
        <Button className="bg-gradient-to-r from-[#0062C4] to-[#004C97] text-white px-8 py-3">
          {btnTitle}
        </Button>
      )}
    </div>
  </div>
);

interface PreviewRendererProps {
  data: {
    hero?: {
      image?: string;
      alt?: string;
      h1?: string;
      p?: string;
      btn?: string;
    };
    content?: BlockData[];
    seo?: {
      title?: string;
      description?: string;
      keywords?: string[];
      openGraph?: any;
      twitter?: any;
    };
  };
}

export default function PreviewRenderer({ data }: PreviewRendererProps) {
  const { hero, content, seo } = data;

  return (
    <div className="bg-white">
      {/* Header */}
      <HeaderPrimary />

      {/* Hero Section */}
      <section className="relative h-[70vh]">
        <div className="relative h-full">
          {hero?.image && (
            <img
              src={hero.image}
              alt={hero.alt || "Hero image"}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 h-full flex items-center">
            <div className="w-full md:w-[80%] max-w-[1440px] md:px-0 p-2 mx-auto flex flex-col gap-4">
              <h1 className="font-bold  text-xl md:text-3xl lg:text-5xl">
                {hero?.h1}
              </h1>
              <div
                className="font-bold  text-base md:text-xl lg:text-3xl"
                dangerouslySetInnerHTML={{ __html: hero?.p || "" }}
              />
              {hero?.btn && (
                <Button className="text-black bg-gradient-to-r from-[#FFB300] to-[#E0A200] text-lg rounded-full !font-bold px-10 !py-6 hover:cursor-pointer w-fit">
                  {hero.btn}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Blocks */}
      <div className="container mx-auto px-4 py-8 space-y-16">
        {(content || []).map((block: BlockData, index: number) => {
          switch (block.type) {
            case "serviceSection":
              return (
                <section key={index} className="py-8">
                  {/* Breadcrumb Navigation */}
                  <nav className="py-8 w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 text-lg font-medium">
                        {block.service}
                      </span>
                      <span className="text-gray-400">/</span>
                      <span className="text-[#003366] text-lg font-medium">
                        {block.subService}
                      </span>
                    </div>
                  </nav>

                  {/* Info Cards Grid */}
                  {block.infoCards && block.infoCards.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {block.infoCards.map(
                        (infocard: InfoCardProps, cardIndex: number) => (
                          <InfoCard
                            key={cardIndex}
                            src={infocard.src}
                            alt={infocard.alt}
                            title={infocard.title}
                            description={infocard.description}
                            height={60}
                            width={60}
                            orientation="flex-row items-center"
                            fontColour="text-black"
                          />
                        ),
                      )}
                    </div>
                  )}
                </section>
              );

            case "dedicatedServiceSection":
              return (
                <section
                  key={index}
                  className="bg-[#f5f5f5] py-16 flex justify-center items-center"
                >
                  <div className="w-[80%] max-w-[1440px] bg-white flex flex-col md:flex-row">
                    {block.img && (
                      <div className="md:w-[40%] relative">
                        <div className="relative h-52">
                          <img
                            src={block.img}
                            alt="Service"
                            className="absolute inset-0 w-full h-full object-fill"
                          />
                        </div>
                      </div>
                    )}
                    <div className="md:w-[60%] flex items-center p-6 md:p-10 text-black">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: block.textRich || "",
                        }}
                      />
                    </div>
                  </div>
                </section>
              );

            case "corporateServiceOfferings":
              return (
                <section key={index} className="w-full flex py-16">
                  <div className="flex flex-col lg:w-[80%] max-w-[1440px] w-full mx-auto gap-4 items-start">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-3 px-3 lg:px-0 gap-4 w-full">
                      {block.serviceCards &&
                        block.serviceCards.length > 0 &&
                        block.serviceCards.map(
                          (servicecard: ServiceCardProps, cardIndex: number) => (
                            <ServiceCard
                              key={cardIndex}
                              src={servicecard.src}
                              alt={servicecard.alt}
                              title={servicecard.title}
                              description={servicecard.description}
                              button={servicecard?.button }
                              fontColour="text-[#003366]"
                              fontWidth="font-bold"
                              fontSize="text-[22px] leading-[120%]"
                            />
                          ),
                        )}
                    </div>
                  </div>
                </section>
              );

            case "corporateServicesAndFeatures":
              return (
                <section key={index} className="w-full flex py-16">
                  <div className="flex flex-col lg:w-[80%] max-w-[1440px] w-full mx-auto gap-4 items-start">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-3 px-3 lg:px-0 gap-4 w-full">
                      {block?.infoCards &&
                        block.infoCards.length > 0 &&
                        block.infoCards.map(
                          (infocard: InfoCardProps, cardIndex: number) => (
                            <InfoCard
                              key={cardIndex}
                              src={infocard.src}
                              alt={infocard.alt}
                              title={infocard.title}
                              description={infocard.description}
                              height={60}
                              width={60}
                              orientation={
                                infocard.orientation === "vertical"
                                  ? "flex-col"
                                  : "flex-row items-center"
                              }
                              fontColour="text-black"
                            />
                          ),
                        )}
                    </div>
                  </div>
                </section>
              );

            case "whoWeSupport":
              return (
                <section
                  key={index}
                  className="w-full flex items-center justify-center py-16"
                >
                  {block?.imageCards &&
                    block.imageCards.length > 0 &&
                    block.imageCards.map(
                      (imagecard: any, cardIndex: number) => (
                        <div
                          key={`${imagecard.id}-${cardIndex}`}
                          className="w-full lg:w-[80%] max-w-[1440px] flex items-center justify-center"
                        >
                          <ImageCardWithTextOnSideAndButton
                            imageLeft={true}
                            src={imagecard.src}
                            alt={imagecard.alt}
                            title={imagecard.title}
                            description={
                              Array.isArray(imagecard.description)
                                ? imagecard.description
                                : [imagecard.description]
                            }
                            fontName="montserrat"
                            leading="leading-[120%]"
                          />
                        </div>
                      ),
                    )}
                </section>
              );

            case "ourGlobalReach":
              return (
                <section
                  key={index}
                  className="w-full flex items-center justify-center py-16"
                >
                  {block?.imageCards &&
                    block.imageCards.length > 0 &&
                    block.imageCards.map(
                      (imagecard: any, cardIndex: number) => (
                        <div
                          key={`${imagecard.id}-${cardIndex}`}
                          className="w-full lg:w-[80%] max-w-[1440px] flex items-center justify-center"
                        >
                          <ImageCardWithTextOnSideAndButton
                            imageLeft={true}
                            src={imagecard.src}
                            alt={imagecard.alt}
                            title={imagecard.title}
                            description={
                              Array.isArray(imagecard.description)
                                ? imagecard.description
                                : [imagecard.description]
                            }
                            fontName="montserrat"
                            leading="leading-[120%]"
                          />
                        </div>
                      ),
                    )}
                </section>
              );

            case "contactForService":
              return (
                <section
                  key={index}
                  className="w-full flex items-center justify-center px-3 lg:px-0 py-16"
                >
                  <div className="w-full lg:w-[80%] max-w-[1440px] bg-[#FFFCF6] border border-[#FFB300] flex flex-col sm:flex-row sm:justify-between gap-4 sm:items-center p-8">
                    <div className="flex flex-col text-black">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: block.textRich || "",
                        }}
                      />
                    </div>
                    {block.btnTitle && (
                      <div>
                        <Button className="bg-gradient-to-r from-[#0062C4] to-[#004C97] text-base !font-bold px-10 py-8 hover:cursor-pointer">
                          {block.btnTitle}
                        </Button>
                      </div>
                    )}
                  </div>
                </section>
              );

            default:
              return null;
          }
        })}
      </div>

      {/* Footer */}
      <FooterPrimary />

      {/* SEO Meta info (hidden but present) */}
      <div className="hidden">
        {seo?.title && <title>{seo.title}</title>}
        {seo?.description && (
          <meta name="description" content={seo.description} />
        )}
        {seo?.keywords && (
          <meta name="keywords" content={seo.keywords.join(", ")} />
        )}
        {seo?.openGraph?.title && (
          <meta property="og:title" content={seo?.openGraph?.title ?? ""} />
        )}
        {seo?.openGraph?.description && (
          <meta property="og:description" content={seo?.openGraph?.description ?? ""} />
        )}
        {seo?.openGraph?.images?.map((img: string, i: number) => (
          <meta key={i} property="og:image" content={img} />
        ))}
        {seo?.twitter?.title && (
          <meta name="twitter:title" content={seo?.twitter?.title ?? ""} />
        )}
        {seo?.twitter?.description && (
          <meta name="twitter:description" content={seo?.twitter?.description ?? ""} />
        )}
      </div>
    </div>
  );
}
