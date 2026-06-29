import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 700,
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "react-vendor";
            }

            if (id.includes("recharts")) {
              return "charts-vendor";
            }

            if (id.includes("framer-motion")) {
              return "motion-vendor";
            }

            if (id.includes("lucide-react")) {
              return "icons-vendor";
            }

            if (id.includes("@tanstack")) {
              return "query-vendor";
            }

            return "vendor";
          }
        },
      },
    },
  },
});