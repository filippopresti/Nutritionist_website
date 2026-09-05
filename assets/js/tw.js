/* Design tokens condivisi — deve essere caricato SUBITO DOPO il CDN Tailwind. */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        verde: {
          50:  "#F2F7F4",
          100: "#DDEDE4",
          200: "#BBD9C9",
          300: "#8FC1AB",
          400: "#5CA286",
          500: "#3B8568",
          600: "#2A6B52",
          700: "#1F5541",
          800: "#173F31",
          900: "#0F2C23",
          950: "#081914",
        },
        crema:  "#FBF8F3",
        sabbia: "#F1E9DD",
        ocra: {
          light: "#EBD3A8",
          DEFAULT: "#C6913F",
          dark: "#A9762B",
        },
        inchiostro: "#26302C",
        grigio: "#5D6763",
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        sans: ["Montserrat", "system-ui", "-apple-system", "sans-serif"],
      },
      letterSpacing: { widest2: "0.22em" },
      maxWidth: { prose2: "68ch" },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(15, 44, 35, 0.18)",
        lift: "0 22px 60px -18px rgba(15, 44, 35, 0.28)",
      },
      keyframes: {
        rise: {
          "0%":   { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: { rise: "rise .7s cubic-bezier(.2,.7,.3,1) both" },
    },
  },
};
