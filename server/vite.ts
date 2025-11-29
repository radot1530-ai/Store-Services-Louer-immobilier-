import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const log = console.log;

export function serveStatic(app: Express) {
  const publicPath = path.resolve(__dirname, "..");

  app.use(express.static(publicPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(publicPath, "index.html"));
  });
}

export async function setupVite(app: Express, server: any) {
  // In development, serve static files directly
  const publicPath = path.resolve(__dirname, "..");
  
  app.use(express.static(publicPath));
  
  app.get("*", (req, res, next) => {
    const url = req.originalUrl;

    if (url.startsWith("/api")) {
      return next();
    }

    try {
      const htmlPath = path.resolve(__dirname, "../index.html");
      const html = fs.readFileSync(htmlPath, "utf-8");
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e: any) {
      console.error(e);
      next(e);
    }
  });
}
