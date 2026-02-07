/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Keeping semantic colors but ensuring they pop on dark
        // primary removed to avoid duplication
        success: {
          DEFAULT: "#10B981", // Emerald 500
          light: "#34D399", // Emerald 400
        },
        warning: {
          DEFAULT: "#F59E0B", // Amber 500
          light: "#FBBF24", // Amber 400
        },
        danger: {
          DEFAULT: "#EF4444", // Red 500
          light: "#F87171", // Red 400
        },
        // Pure Black Theme Palette
        black: {
          DEFAULT: "#000000", // Pure Black
          card: "#0A0A0A", // Slightly lifted
          border: "#1A1A1A", // Subtle border
          input: "#111111", // Input background
        },
        // Text Colors
        text: {
          primary: "#FFFFFF",
          secondary: "#B3B3B3",
          muted: "#7A7A7A",
        },
        // Status Colors (Strict Meaning)
        status: {
          success: "#10B981", // Green (Normal/Low Risk)
          warning: "#F59E0B", // Yellow (Medium Risk)
          critical: "#EF4444", // Red (High Risk)
          caution: "#F97316", // Orange (Elevated)
        },
        // Overriding default colors to ensure no accidental blues/grays
        gray: {
          950: "#000000",
          900: "#0A0A0A",
          800: "#1A1A1A",
          700: "#333333",
          600: "#4D4D4D",
          500: "#7A7A7A",
          400: "#B3B3B3",
          300: "#E5E5E5",
          200: "#FFFFFF",
        },
        // Remap primary to Green (as per request for active state) or Neutral
        primary: {
          DEFAULT: "#10B981", // Green
          foreground: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
};
