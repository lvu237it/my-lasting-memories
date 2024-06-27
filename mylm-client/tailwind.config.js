const defaultTheme = require('tailwindcss/defaultTheme');
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,jsx}'],
  theme: {
    screens: {
      // xxxs: '431px',
      // xxs: '450px',
      // xs: '480px',
      // mxs: '500px',
      // xmd: '1023px',
      sm2: '675px',
      ...defaultTheme.screens,
    },
    extend: {
      // fontFamily: {
      //   Karla: ["Karla", "sans-serif"],
      // },
      // colors: {
      //   "coffee": {
      //     50: "E8D6D0",
      //     200: "#C89F76",
      //     400: "#A25F4B",
      //     600: "#744838"
      //   }
      // },
      // keyframes: {
      //   slideDown: {
      //     "0%": { transform: "translateY(-100%)" },
      //     "100%": { transform: "translateY(0)" },
      //   },
      //   fadeIn: {
      //     from: { opacity: 0},
      //     to: { opacity: 1},
      //   }
      // },
      animation: {
        slideDown: 'slideDown 0.5s ease-in-out',
        fadeIn: 'fadeIn 0.5s ease-in-out',
      },
      // backgroundImage: {
      //   'slider-bg': 'url("./img/slider-coffee-style.jpg")',
      // }
    },
  },
  plugins: [],
};
