/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#070A12",
          900: "#0B0F19",
          850: "#101625",
          800: "#161F33",
          700: "#1E293B",
          600: "#334155",
        },
        indigo: {
          500: "#6366F1",
          600: "#4F46E5",
          400: "#818CF8",
        },
        purple: {
          500: "#8B5CF6",
          600: "#7C3AED",
          400: "#A78BFA",
        },
        amber: {
          400: "#FBBF24",
          500: "#F59E0B",
        },
        emerald: {
          400: "#34D399",
          500: "#10B981",
        },
        rose: {
          400: "#FB7185",
          500: "#F43F5E",
        },
        cyan: {
          400: "#22D3EE",
          500: "#06B6D4",
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
