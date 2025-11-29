import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const annonces = pgTable("annonces", {
  id: serial("id").primaryKey(),
  categorie: varchar("categorie", { length: 50 }).notNull(),
  titre: text("titre").notNull(),
  prix: text("prix").notNull(),
  adresse: text("adresse").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const demandes = pgTable("demandes", {
  id: serial("id").primaryKey(),
  titre: text("titre").notNull(),
  prix: text("prix").notNull(),
  nom: text("nom").notNull(),
  whatsapp: text("whatsapp").notNull(),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAnnonceSchema = createInsertSchema(annonces).omit({
  id: true,
  createdAt: true,
});

export const insertDemandeSchema = createInsertSchema(demandes).omit({
  id: true,
  createdAt: true,
});

export const insertSettingSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

export type Annonce = typeof annonces.$inferSelect;
export type InsertAnnonce = z.infer<typeof insertAnnonceSchema>;

export type Demande = typeof demandes.$inferSelect;
export type InsertDemande = z.infer<typeof insertDemandeSchema>;

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;

