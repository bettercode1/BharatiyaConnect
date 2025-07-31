import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });

  next();
});

  // Mock API routes for development
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "BJP Connect API is running" });
  });

  app.get("/api/dashboard/stats", (req, res) => {
    res.json({
      totalMembers: 24567,
      verifiedMembers: 22000,
      activeEvents: 15,
      upcomingEvents: 8,
      totalNotices: 45,
      urgentNotices: 3,
      totalConstituencies: 288,
      totalDistricts: 36
    });
  });

  // Handle client-side routing - serve index.html for all non-API routes
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    // Let Vite handle the routing in development
    next();
  });

(async () => {
  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    console.error(err);
  });

  // Create HTTP server
  const server = createServer(app);

  // Setup Vite in development mode
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Start server
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen(port, "0.0.0.0", () => {
    log(`BJP Connect server running on port ${port}`);
    log(`Development mode: ${process.env.NODE_ENV === "development" ? "enabled" : "disabled"}`);
  });
})();
