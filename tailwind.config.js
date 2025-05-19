// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  // darkMode 옵션 추가
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // src 폴더 내의 모든 js, ts, jsx, tsx 파일을 대상으로 함
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
