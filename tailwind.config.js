/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        Roboto: ["Roboto"],
        Pacifico: ["Pacifico"],
        Erica: ["Erica One"],
        Luckiest: ["Luckiest Guy"],
        Permanent: ["Permanent Marker"],
        GothamBlack: ["GothamBlack"],
        GothamBook: ["GothamBook"],
      },
      animation: {
        shine: "shine 1s",
      },
      keyframes: {
        shine: {
          "100%": { left: "25%" },
        },
      },
      colors: {
        "dark-charcoal": "#8E8E8E",
        "tangerine-yellow": "#63C3A7",
      },
      boxShadow: {
        "4xl": "rgb(0, 0, 0, 0.2) 0px 0px 10px 10px",
        "5xl": "0 0 2px 3px #63C3A7;",
      },
    },
  },
  plugins: [],
};
