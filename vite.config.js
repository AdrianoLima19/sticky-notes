import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  root: "./src",
  publicDir: false,
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    manifest: true,
  },
});
