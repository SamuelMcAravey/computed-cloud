export type TemplateId = "agency" | "saas" | "consulting" | "trades" | "retail" | "fintech";

export type HexColor = `#${string}`;
export type ColorString = string;
export type UrlString = string;
export type RoutePath = `/${string}` | "/";

export type Link = {
  label: string;
  href: RoutePath | UrlString;
  external?: boolean;
};

export type ImageRef = {
  src: RoutePath;     // "/images/..."
  alt: string;
  rights?: "owned" | "licensed" | "stock" | "generated" | "unknown";
};

export type Brand = {
  primary: HexColor;
  accent: HexColor;
  dark: boolean;
  logo?: {
    light?: RoutePath;
    dark?: RoutePath;
    icon?: RoutePath;
  };
};

export type ThemePalette = {
  surface?: ColorString;
  surfaceMuted?: ColorString;
  text?: ColorString;
  textStrong?: ColorString;
  textMuted?: ColorString;
  textSubtle?: ColorString;
  border?: ColorString;
  ring?: ColorString;
  footer?: {
    background?: ColorString;
    text?: ColorString;
    textStrong?: ColorString;
    textMuted?: ColorString;
    link?: ColorString;
    linkHover?: ColorString;
    border?: ColorString;
  };
  brand?: Partial<
    Record<
      "50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900",
      ColorString
    >
  >;
  accent?: Partial<Record<"500" | "600" | "700", ColorString>>;
};

export type ThemeRadius = {
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  "2xl"?: string;
};

export type ThemeTypography = {
  body?: string;
  heading?: string;
};

export type ThemeFontSource = {
  url: string;
  format: "woff2" | "woff" | "ttf" | "otf";
};

export type ThemeFont = {
  family: string;
  src: ThemeFontSource[];
  weight?: string | number;
  style?: "normal" | "italic" | "oblique";
  display?: "auto" | "swap" | "block" | "fallback" | "optional";
  unicodeRange?: string;
};

export type ThemeShadows = {
  card?: string;
  hover?: string;
  elevated?: string;
};

export type ThemeBackground = {
  mode?: "none" | "gradient" | "pattern";
  base?: ColorString;
  accent?: ColorString;
  patternOpacity?: string;
  patternSize?: string;
};

export type Theme = {
  palette?: ThemePalette;
  radius?: ThemeRadius;
  typography?: ThemeTypography;
  fonts?: ThemeFont[];
  preloadFonts?: string[];
  shadows?: ThemeShadows;
  background?: ThemeBackground;
};

export type BusinessBasics = {
  businessName: string;
  tagline: string;
  shortDescription?: string;

  phone?: string;
  email?: string;

  addressLine?: string;
  cityStateZip?: string;
  serviceArea?: string;
  hoursText?: string[];
};

export type SocialLinks = Partial<
  Record<"linkedin" | "x" | "facebook" | "instagram" | "youtube", UrlString>
>;

export type Seo = {
  canonicalBaseUrl?: UrlString;
  defaultTitle?: string;
  defaultDescription?: string;
  ogImage?: ImageRef;
};

export type MarketingSampleOutput = {
  previewJson: string;
  previewCsv: string;
  downloadJsonUrl: RoutePath;
  downloadCsvUrl: RoutePath;
};

export type MarketingConfig = {
  sampleOutput?: MarketingSampleOutput;
};

export type PricingConfig = {
  documentPrice: number;
  includedPages: number;
  additionalPagePrice: number;
  maxPages?: number;
  signupUrl?: UrlString;
};

export type Footer = {
  description: string;

  quickLinks: Link[];
  serviceLinks?: Link[];
  legalLinks?: Link[];

  cta: { headline: string; body?: string; buttonLabel: string; href: RoutePath | UrlString };

  showContactInfo?: boolean;
  contactHeadline?: string;

  copyrightName?: string;
};

export type BaseSite = {
  template: TemplateId;

  business: BusinessBasics;
  brand: Brand;
  theme?: Theme;

  nav: Link[];
  headerCta?: Link;
  headerSecondaryCta?: Link;
  analytics?: {
    googleTagId?: string;
  };

  social?: SocialLinks;
  footer: Footer;

  marketing?: MarketingConfig;
  pricing?: PricingConfig;

  seo?: Seo;
};
