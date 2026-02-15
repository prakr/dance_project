import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Bandsintown-inspired brand colors
        brand: {
          primary: '#00D1C1',
          'primary-dark': '#00B8AA',
          'primary-light': '#00E8D6',
          dark: '#1A1A1A',
          'dark-light': '#2C2C2C',
        },
        // Legacy colors (keeping for backward compatibility)
        primary: {
          50: '#e6fffc',
          100: '#b3fff6',
          200: '#80fff0',
          300: '#4dffea',
          400: '#1affe4',
          500: '#00D1C1',
          600: '#00B8AA',
          700: '#009688',
          800: '#007566',
          900: '#005344',
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
      },
    },
  },
  plugins: [],
}
export default config
