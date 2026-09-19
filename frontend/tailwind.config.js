/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eduva: {
          canvas: "#FBFBFB",
          surface1: "#E5E1DA",
          surface2: "#E5E1DA",
          surface3: "#DBD6CD",
          border: "#D5D0C7",
          borderLight: "#D5D0C7",
          accent: "#4F46E5",
          accentHover: "#4338CA",
          cobalt: "#4F46E5",
          emerald: "#0F766E",
          emeraldGlow: "rgba(15, 118, 110, 0.12)",
          amber: "#D97706",
          rose: "#DC2626",
          textPrimary: "#191B1F",
          textSecondary: "#5C5852",
          textMuted: "#7E7A73"
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Plus Jakarta Sans', 'sans-serif']
      },
      boxShadow: {
        'depth-sm': '0 3px 12px rgba(15, 23, 42, 0.05)',
        'depth-md': '0 8px 30px rgba(15, 23, 42, 0.06)',
        'depth-lg': '0 14px 36px rgba(15, 23, 42, 0.08)',
        'accent-glow': '0 6px 18px rgba(79, 70, 229, 0.14)',
        'emerald-glow': '0 6px 18px rgba(15, 118, 110, 0.12)'
      },
      transitionTimingFunction: {
        'editorial': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'tactile': 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      }
    },
  },
  plugins: [],
}
