/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#1a5fdb', dark: '#1450b8', soft: '#e6eefc' },
        navy: { DEFAULT: '#0b1424', light: '#131d31', line: '#1d2940' },
        canvas: '#f4f6fa',
        ink: '#0e1626',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: { card: '0 1px 2px rgba(14,22,38,0.04), 0 1px 3px rgba(14,22,38,0.04)' },
    },
  },
  plugins: [],
}
