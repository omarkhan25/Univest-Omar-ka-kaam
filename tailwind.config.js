/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2563EB',
          green: '#16A34A',
          navy: '#0F172A',
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          secondary: '#64748B',
          loss: '#EF4444',
          warning: '#F59E0B',
          info: '#0EA5E9',
        },
        primary: '#2563EB',
        success: '#16A34A',
        danger: '#EF4444',
        warning: '#F59E0B',
        info: '#0EA5E9',
        // Dark Mode Mappings
        dark: {
          bg: '#0B0F19',
          card: '#161F30',
          border: '#243249',
          text: '#F1F5F9',
          muted: '#94A3B8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1.15', fontWeight: '800' }],
        'h1': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['1.875rem', { lineHeight: '1.25', fontWeight: '700' }],
        'h3': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['0.875rem', { lineHeight: '1.4', fontWeight: '400' }],
      },
      spacing: {
        '0': '0px',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },
      borderRadius: {
        'card': '24px',
        'button': '16px',
        'input': '16px',
        'modal': '28px',
        'chart': '20px',
      },
      boxShadow: {
        'premium-sm': '0 2px 8px -1px rgba(15, 23, 42, 0.03), 0 1px 3px -1px rgba(15, 23, 42, 0.02)',
        'premium': '0 12px 34px -4px rgba(15, 23, 42, 0.04), 0 4px 12px -2px rgba(15, 23, 42, 0.02)',
        'premium-lg': '0 20px 48px -6px rgba(15, 23, 42, 0.06), 0 8px 24px -4px rgba(15, 23, 42, 0.03)',
        'premium-xl': '0 32px 64px -12px rgba(15, 23, 42, 0.08), 0 16px 32px -8px rgba(15, 23, 42, 0.04)',
        'glow-blue': '0 0 20px 2px rgba(37, 99, 235, 0.15)',
        'glow-green': '0 0 20px 2px rgba(22, 163, 74, 0.15)',
      },
    },
  },
  plugins: [],
}
