export type HeroSectionBlock = {
  type: "heroSection";
  image: string;
  alt: string;
  h1: string;
  p: string;
  btn: string;
};

export type ServiceSectionBlock = {
  type: "serviceSection";
  service: string;
  subservice: string;
};

export type DedicatedServiceSectionBlock = {
  type: "dedicatedServiceSection";
  img: string;
  textrich: string;
};

export type CorporateServiceOfferingsBlock = {
  type: "corporateServiceOfferings";
  cards: {
    src: string;
    alt: string;
    title: string;
    description: string;
    button: string;
    btnTitle: string;
  }[];
};

export type CorporateServicesAndFeaturesBlock = {
  type: "corporateServicesAndFeatures";
  cards: {
    src: string;
    alt: string;
    title: string;
    description: string;
    height?: string;
    width?: string;
    orientation: "horizontal" | "vertical";
  }[];
};

export type WhoWeSupportBlock = {
  type: "whoWeSupport";
  src: string;
  alt: string;
  title: string;
  description: string;
  button: string;
  btnTitle: string;
};

export type OurGlobalReachBlock = {
  type: "ourGlobalReach";
  src: string;
  alt: string;
  title: string;
  description: string;
  button: string;
  btnTitle: string;
};

export type ContactForServiceBlock = {
  type: "contactForService";
  textrich: string;
  btn: string;
  btnTitle: string;
};

export type ContentBlock =
  | ServiceSectionBlock
  | DedicatedServiceSectionBlock
  | CorporateServiceOfferingsBlock
  | CorporateServicesAndFeaturesBlock
  | WhoWeSupportBlock
  | OurGlobalReachBlock
  | ContactForServiceBlock;

export type PageLayout = {
  hero: HeroSectionBlock;
  content: ContentBlock[];
};
