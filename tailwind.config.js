/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#FFFFFF',
          warm: '#FFF9F4',
          secondary: '#F7F5F3',
        },
        foreground: {
          DEFAULT: '#171717',
          secondary: '#626262',
          muted: '#888888',
        },
        border: '#E9E5E2',
        darkAccent: '#111111',
        phoenix: {
          orange: '#FF6A00',
          red: '#E51B23',
          gold: '#FFC21A',
          magenta: '#E0008A',
          purple: '#6A00FF',
          deepPurple: '#3A087A',
        }
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        'phoenix-glow': '0 10px 40px -10px rgba(255, 106, 0, 0.15)',
        'phoenix-subtle': '0 4px 20px -2px rgba(229, 27, 35, 0.08)',
        'phoenix-active': '0 12px 32px -4px rgba(224, 0, 138, 0.16)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
