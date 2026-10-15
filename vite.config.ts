import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import url from 'url';

function apiDevPlugin(): Plugin {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next();

        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname || '';
        const query = parsedUrl.query;

        let body: any = {};
        if (req.method === 'POST') {
          const buffers: Buffer[] = [];
          for await (const chunk of req) {
            buffers.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
          }
          const raw = Buffer.concat(buffers).toString();
          try {
            body = JSON.parse(raw);
          } catch {
            body = {};
          }
        }

        const mockRes = {
          statusCode: 200,
          setHeader: (k: string, v: any) => res.setHeader(k, v),
          status(code: number) {
            this.statusCode = code;
            res.statusCode = code;
            return this;
          },
          json(data: any) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = this.statusCode;
            res.end(JSON.stringify(data));
          },
        };

        const mockReq = {
          method: req.method,
          query,
          body,
          headers: req.headers,
          socket: req.socket,
        };

        try {
          if (pathname === '/api/quotes') {
            const mod = await import('./api/quotes.ts');
            return await mod.default(mockReq, mockRes);
          }
          if (pathname === '/api/candles') {
            const mod = await import('./api/candles.ts');
            return await mod.default(mockReq, mockRes);
          }
          if (pathname === '/api/fx') {
            const mod = await import('./api/fx.ts');
            return await mod.default(mockReq, mockRes);
          }
          if (pathname === '/api/ai-summary') {
            const mod = await import('./api/ai-summary.ts');
            return await mod.default(mockReq, mockRes);
          }
          if (pathname === '/api/send-alert-email') {
            const mod = await import('./api/send-alert-email.ts');
            return await mod.default(mockReq, mockRes);
          }
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: { code: 'SERVER_ERROR', message: err.message } }));
          return;
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiDevPlugin()],
});
