import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      // Entry point in src folder
      entry: resolve(__dirname, 'src/zog-toast.js'),
      name: 'ZogToast',
      fileName: (format) => `zog-toast.${format}.js`,
    },
    // We removed 'rollupOptions.external' because your plugin 
    // does not import Zog directly. It receives it via the install() method.
    sourcemap: true,
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      format: {
        comments: 'all', // Preserves JSDoc
      },
    },
  }
});
