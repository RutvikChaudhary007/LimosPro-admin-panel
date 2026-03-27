// lib/tailwind-tokens.ts

// Actual font names (for TinyMCE - can't use CSS vars)
export const twFontFamilies = {
  montserrat: "Montserrat, sans-serif",
  varela: "'Varela Round', sans-serif",
  quicksand: "Quicksand, sans-serif",
};

// Tailwind font sizes (match your project)
export const twFontSizes = {
  xs: "12px",
  sm: "14px",
  base: "16px",
  lg: "18px",
  xl: "20px",
  "2xl": "24px",
  "3xl": "30px",
  "4xl": "36px",
  "5xl": "48px",
  "6xl": "60px",
};

// TinyMCE format strings
export const tinyFontFamilyFormats =
  "Montserrat=Montserrat,sans-serif; " +
  "Varela Round='Varela Round',sans-serif; " +
  "Quicksand=Quicksand,sans-serif";

export const tinyFontSizeFormats =
  "xs=12px sm=14px base=16px lg=18px xl=20px 2xl=24px 3xl=30px 4xl=36px 5xl=48px 6xl=60px";
