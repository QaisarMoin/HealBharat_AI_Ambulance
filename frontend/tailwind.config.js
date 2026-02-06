/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "emergency-red": "#dc2626",
        "warning-orange": "#f97316",
        "success-green": "#16a34a",
        "info-blue": "#2563eb",
        "neutral-gray": "#6b7280",
        "dark-navy": "#1f2937",
        "light-gray": "#f3f4f6",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
