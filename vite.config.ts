import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-wasm-static',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && (req.url.startsWith('/wasm/') || req.url.endsWith('.wasm'))) {
            const urlPath = req.url.split('?')[0];
            const cleanPath = urlPath.startsWith('/wasm/') ? urlPath : `/wasm/${urlPath.replace(/^\//, '')}`;
            const filePath = path.join(__dirname, 'public', cleanPath);
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              if (filePath.endsWith('.wasm')) {
                res.setHeader('Content-Type', 'application/wasm');
              } else if (filePath.endsWith('.mjs') || filePath.endsWith('.js')) {
                res.setHeader('Content-Type', 'application/javascript');
              }
              res.setHeader('Access-Control-Allow-Origin', '*');
              return fs.createReadStream(filePath).pipe(res);
            }
          }
          next();
        });
      },
    },
  ],
  server: {
    port: 5173,
    host: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
  },
  optimizeDeps: {
    exclude: ['onnxruntime-web'],
  },
});
