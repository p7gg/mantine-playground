import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("@mantine")) return "mantine-chunk";
          if (id.includes("modules/create-zod-form")) return "zod-form";

          return null;
        },
      },
    },
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});
