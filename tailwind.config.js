/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 1s ease-in',
        'fade-in-up': 'fadeInUp 1s ease-in',
        'gradient-move': 'gradientMove 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(40px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        gradientMove: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        'bolt-blue': '#5A8FFF',
        'bolt-purple': '#A259FF',
        'bolt-pink': '#FF6F91',
        'bolt-glass': 'rgba(255,255,255,0.6)',
        'bolt-dark-glass': 'rgba(30,41,59,0.7)',
      },
      backgroundImage: {
        'bolt-gradient': 'linear-gradient(135deg, #5A8FFF 0%, #A259FF 50%, #FF6F91 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        'glass-lg': '0 16px 48px 0 rgba(31, 38, 135, 0.22)',
      },
      blur: {
        'glass': '16px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
