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
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "axios",
      "react-quill",
      "quill",
      "@tiptap/react",
      "@tiptap/starter-kit",
      "@tiptap/extension-link",
      "@tiptap/extension-image",
      "@dnd-kit/core",
      "@dnd-kit/sortable",
      "@dnd-kit/utilities",
      "@hookform/resolvers",
      "zod",
      "react-hook-form",
    ],
  },
  build: {
    target: "es2020",
    sourcemap: false, // Disable sourcemaps in production for smaller bundle
    minify: "esbuild",
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-checkbox"],
          chart: ["chart.js"],
          vendor: ["lodash", "axios"],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase limit since we're splitting properly
    reportCompressedSize: true,
  },
});
