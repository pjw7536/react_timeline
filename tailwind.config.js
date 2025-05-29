// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  // darkMode: class 기반으로(수동 전환 지원)
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // src 내부의 모든 js/ts/jsx/tsx 파일 적용
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
