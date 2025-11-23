import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Register routes and prepare server/app for either local run or serverless environments.
let serverPromise: Promise<import("http").Server> | undefined;
export async function getApp() {
  // ensure routes are registered once
  if (!serverPromise) {
    serverPromise = registerRoutes(app);
  }
  // registerRoutes attaches routes to `app`; return the express app instance
  await serverPromise;
  return app;
}

// Attach a global error handler after routes are registered.
async function attachErrorHandler() {
  await getApp();
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });
}

attachErrorHandler().catch((e) => {
  console.error("Failed to register routes/error handler:", e);
});

// If not running in a serverless environment (like Vercel) start the HTTP server.
if (!process.env.VERCEL) {
  (async () => {
    const server = await serverPromise!;

    // only setup vite in development (local) and after setting up routes
    if (app.get("env") === "development") {
      await setupVite(app, server as any);
    } else {
      serveStatic(app);
    }

    const port = parseInt(process.env.PORT || '5000', 10);
    server.listen({
      port,
      host: "0.0.0.0",
    }, () => {
      log(`serving on port ${port}`);
    });
  })();
}
