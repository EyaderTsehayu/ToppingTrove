/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "rgba(255, 137, 15, 1)",
        mainbg: "rgba(255, 248, 241, 1)",
        sectiontitles: "rgba(0, 0, 0, 0.5)",
        topcardbg: "rgba(0, 128, 0, 0.05)",
        footerbg: "rgba(204, 182, 145, 1)",
        successtext: "rgba(5, 198, 5, 1)",
      },
    },
  },
  plugins: [],
};
