import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

function devApiPlugin() {
  return {
    name: 'dev-api-middleware',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = new URL(req.url, 'http://localhost:3000');
        if (url.pathname === '/api/cheats') {
          try {
            const cheatsHandler = (await import('./api/cheats.ts')).default;
            const query = Object.fromEntries(url.searchParams.entries());
            let body: any = {};
            if (req.method === 'POST') {
              const buffers: any[] = [];
              for await (const chunk of req) {
                buffers.push(chunk);
              }
              const data = Buffer.concat(buffers).toString();
              try { body = JSON.parse(data); } catch {}
            }

            const vercelReq = {
              method: req.method,
              query,
              body,
              headers: req.headers
            };

            const vercelRes = {
              status(code: number) {
                res.statusCode = code;
                return this;
              },
              setHeader(name: string, value: string) {
                res.setHeader(name, value);
                return this;
              },
              json(data: any) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              },
              end() {
                res.end();
              }
            };

            await cheatsHandler(vercelReq, vercelRes);
            return;
          } catch (err: any) {
            console.error('Error in dev /api/cheats middleware:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
            return;
          }
        }

        if (url.pathname === '/api/scan-source') {
          try {
            const scanHandler = (await import('./api/scan-source.ts')).default;
            const query = Object.fromEntries(url.searchParams.entries());
            let body: any = {};
            if (req.method === 'POST') {
              const buffers: any[] = [];
              for await (const chunk of req) {
                buffers.push(chunk);
              }
              const data = Buffer.concat(buffers).toString();
              try { body = JSON.parse(data); } catch {}
            }

            const vercelReq = {
              method: req.method,
              query,
              body,
              headers: req.headers
            };

            const vercelRes = {
              status(code: number) {
                res.statusCode = code;
                return this;
              },
              setHeader(name: string, value: string) {
                res.setHeader(name, value);
                return this;
              },
              json(data: any) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              },
              end() {
                res.end();
              }
            };

            await scanHandler(vercelReq, vercelRes);
            return;
          } catch (err: any) {
            console.error('Error in dev /api/scan-source middleware:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
            return;
          }
        }
        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), devApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
