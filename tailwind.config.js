/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0B3D91',
        accent: '#2F66D6',
        success: '#28A745',
        danger: '#E02424',
        bg: '#F6F7FB',
        surface: '#FFFFFF',
        muted: '#E9EDF6',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        md: '10px',
      },
      boxShadow: {
        card: '0 1px 4px rgba(11,61,145,0.08)',
      },
    },
  },
  plugins: [],
};
