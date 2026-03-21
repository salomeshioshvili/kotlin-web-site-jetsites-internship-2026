import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [reactRouter(), react()],
  resolve: {
    // @rescui packages may point to .ts instead of .js in their module fields 
    // So force Vite to use the main entry instead
    mainFields: ["main", "module", "src:main"],
  },
  ssr: {
    // Bundle @rescui components for SSR so their CSS imports work on the server
    noExternal: [
      "@rescui/button",
      "@rescui/card",
      "@rescui/icons",
      "@rescui/colors",
      "@rescui/tab-list",
      "@rescui/typography",
      "@rescui/ui-contexts",
      "@jetbrains/kotlin-web-site-ui",
    ],
  },
});

