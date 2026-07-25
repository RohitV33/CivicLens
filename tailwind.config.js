/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Newsreader"', '"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        bg: { DEFAULT: '#FAF8F5', dark: '#0C0D0E' },
        surface: { DEFAULT: '#FFFFFF', dark: '#161719' },
        card: { DEFAULT: '#FFFFFF', dark: '#1F2023' },
        primary: { DEFAULT: '#0F0F0F', dark: '#FFFFFF' },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        ink: '#0F0F0F',
        craft: {
          bg: '#FAF8F5',
          dark: '#111111',
          amber: '#E25C05',
          blue: '#D9E8FC',
          blueDark: '#1E2C3D',
          mint: '#C2ECD8',
          mintDark: '#183B2B',
          yellow: '#FDE8B3',
          pink: '#FCE5E6',
          purple: '#E9D8FD',
        },
        text: {
          primary: '#0F0F0F',
          secondary: '#666666',
          dark: '#F3F4F6',
        },
        border: { DEFAULT: '#EBE8E1', dark: 'rgba(255,255,255,0.1)' },
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
        '5xl': '40px',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        card: '0 8px 30px rgba(0,0,0,0.04), 0 2px 6px rgba(0,0,0,0.02)',
        lift: '0 20px 40px rgba(0,0,0,0.08), 0 6px 12px rgba(0,0,0,0.04)',
        craft: '0 20px 60px -15px rgba(0,0,0,0.12), 0 8px 20px -6px rgba(0,0,0,0.06)',
        'soft-dark': '0 4px 20px rgba(0,0,0,0.4)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite linear',
        pulseSoft: 'pulseSoft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
