import type { Express } from "express";
import { storage } from "./storage";
import { insertAnnonceSchema, insertDemandeSchema, insertSettingSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export function registerRoutes(app: Express) {
  
  // === ANNONCES ROUTES ===
  app.get("/api/annonces", async (req, res) => {
    try {
      const annonces = await storage.getAnnonces();
      res.json(annonces);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/annonces/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const annonce = await storage.getAnnonceById(id);
      
      if (!annonce) {
        return res.status(404).json({ error: "Annonce not found" });
      }
      
      res.json(annonce);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/annonces", async (req, res) => {
    try {
      const result = insertAnnonceSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: fromZodError(result.error).message });
      }
      
      const annonce = await storage.createAnnonce(result.data);
      res.status(201).json(annonce);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/annonces/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAnnonce(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // === DEMANDES ROUTES ===
  app.get("/api/demandes", async (req, res) => {
    try {
      const demandes = await storage.getDemandes();
      res.json(demandes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/demandes", async (req, res) => {
    try {
      const result = insertDemandeSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: fromZodError(result.error).message });
      }
      
      const demande = await storage.createDemande(result.data);
      res.status(201).json(demande);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/demandes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteDemande(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // === SETTINGS ROUTES ===
  app.get("/api/settings/:key", async (req, res) => {
    try {
      const setting = await storage.getSetting(req.params.key);
      
      if (!setting) {
        return res.status(404).json({ error: "Setting not found" });
      }
      
      res.json(setting);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const result = insertSettingSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: fromZodError(result.error).message });
      }
      
      const setting = await storage.setSetting(result.data);
      res.json(setting);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}
