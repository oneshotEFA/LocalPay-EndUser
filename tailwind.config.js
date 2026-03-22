/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Blues
        blue: {
          50:  '#f0f8ff',
          100: '#e0f0fe',
          200: '#bae2fd',
          300: '#7dcefb',
          400: '#38b6f8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        // Grays / blacks / whites
        zinc: {
          50:  '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          850: '#1f1f22',
          900: '#18181b',
          950: '#09090b',
        },
      },
      animation: {
        'fade-up':  'fadeUp 0.4s ease forwards',
        'fade-in':  'fadeIn 0.3s ease forwards',
        'shimmer':  'shimmer 1.6s infinite',
        'spin-slow':'spin 1.2s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
