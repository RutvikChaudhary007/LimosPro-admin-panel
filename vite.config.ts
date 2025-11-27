import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  appType: "spa",
  server: {
    port: 8080,
    hmr: {
      overlay: true,
    },
  },
  preview: {
    port: 8080,
  },
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
    svgr({
      svgrOptions: {
        icon: true, // scales SVG to 1em size
      },
    }),
    visualizer({
      open: false,
      filename: "dist/stats.html",
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "axios"],
  },
  build: {
    target: "es2020",
    sourcemap: false, // Disable sourcemaps in production for smaller bundle
    minify: "esbuild",
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separate node_modules into logical chunks
          if (id.includes("node_modules")) {
            // React core - most critical, cache separately
            if (id.includes("react") || id.includes("react-dom")) {
              return "react-vendor";
            }

            // Router - changes less frequently
            if (id.includes("react-router")) {
              return "router";
            }

            // Radix UI components - large but stable
            if (id.includes("@radix-ui")) {
              return "radix-ui";
            }

            // Charts - heavy, lazy load if possible
            if (
              id.includes("chart.js") ||
              id.includes("recharts") ||
              id.includes("react-chartjs")
            ) {
              return "charts";
            }

            // Maps - very heavy, definitely lazy load
            if (
              id.includes("leaflet") ||
              id.includes("react-leaflet") ||
              id.includes("@react-google-maps") ||
              id.includes("react-geocode") ||
              id.includes("react-simple-maps") ||
              id.includes("d3-geo")
            ) {
              return "maps";
            }

            // Rich text editors - heavy
            if (id.includes("quill") || id.includes("react-quill")) {
              return "editor";
            }

            // Tanstack (React Query, React Table)
            if (id.includes("@tanstack")) {
              return "tanstack";
            }

            // Form libraries
            if (
              id.includes("react-hook-form") ||
              id.includes("@hookform") ||
              id.includes("zod")
            ) {
              return "forms";
            }

            // Icons
            if (id.includes("lucide-react") || id.includes("@tabler/icons")) {
              return "icons";
            }

            // Animation libraries
            if (id.includes("framer-motion") || id.includes("motion")) {
              return "animations";
            }

            // DnD Kit
            if (id.includes("@dnd-kit")) {
              return "dnd-kit";
            }

            // Date utilities
            if (
              id.includes("date-fns") ||
              id.includes("@internationalized/date")
            ) {
              return "date-utils";
            }

            // Everything else goes to vendor
            return "vendor";
          }
        },
        // Optimize chunk naming for better caching
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
    chunkSizeWarningLimit: 1000, // Increase limit since we're splitting properly
    reportCompressedSize: true,
  },
});
