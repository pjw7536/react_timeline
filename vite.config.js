import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Vite 개발 서버 및 플러그인 설정 파일
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0", // 네트워크 내 다른 기기에서 접속 허용
  },
});
