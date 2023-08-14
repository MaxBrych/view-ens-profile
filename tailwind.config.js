/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "mona-sans": ["Mona-Sans", "sans-serif"],
      },
      backgroundImage: {
        "profil-pfp":
          "url('https://cdn.discordapp.com/attachments/911669935363752026/1139256377118830662/ETH_Pand.png')",
        "hero-bg-desktop":
          "url('https://cdn.discordapp.com/attachments/911669935363752026/1122603145969807491/bg-desktop.png')",
        "hero-bg-mobile":
          "url('https://cdn.discordapp.com/attachments/911669935363752026/1123847046210781284/mobile_bg02.png')",

        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      primary: {
        500: "#1FD25A",
        600: "#006522",
      },
      gray: {
        100: "#F5F6F7",
        200: "#E3E5E8",
        300: "#D5D9DD",
        400: "#BEC4CA",
        500: "#AAB2BB",
        600: "#8D979F",
        700: "#6E7A83",
        800: "#454D55",
        900: "#22272B",
      },
      white: "#FFFFFF",
      black: "#000000",
    },
  },
  plugins: [],
};
