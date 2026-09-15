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
          canvas: "#060911",
          surface1: "#0B101E",
          surface2: "#11182B",
          surface3: "#18223C",
          border: "rgba(255, 255, 255, 0.08)",
          borderLight: "rgba(0, 0, 0, 0.08)",
          accent: "#2563EB",
          accentHover: "#1D4ED8",
          cobalt: "#3B82F6",
          emerald: "#059669",
          emeraldGlow: "rgba(16, 185, 129, 0.2)",
          amber: "#D97706",
          rose: "#DC2626",
          textPrimary: "#F8FAFC",
          textSecondary: "#94A3B8",
          textMuted: "#64748B"
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Plus Jakarta Sans', 'sans-serif']
      },
      boxShadow: {
        'depth-sm': '0 2px 8px -2px rgba(0, 0, 0, 0.4), 0 1px 3px -1px rgba(0, 0, 0, 0.2)',
        'depth-md': '0 8px 24px -4px rgba(0, 0, 0, 0.5), 0 4px 12px -2px rgba(0, 0, 0, 0.3)',
        'depth-lg': '0 16px 40px -8px rgba(0, 0, 0, 0.6), 0 8px 20px -4px rgba(0, 0, 0, 0.4)',
        'accent-glow': '0 0 25px -5px rgba(37, 99, 235, 0.35)',
        'emerald-glow': '0 0 25px -5px rgba(16, 185, 129, 0.3)'
      },
      transitionTimingFunction: {
        'editorial': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'tactile': 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      }
    },
  },
  plugins: [],
}
