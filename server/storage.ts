import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@shared/schema";
import type { Annonce, Demande, Setting, InsertAnnonce, InsertDemande, InsertSetting } from "@shared/schema";
import { eq } from "drizzle-orm";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle({ client: sql, schema });

export interface IStorage {
  getAnnonces(): Promise<Annonce[]>;
  getAnnonceById(id: number): Promise<Annonce | undefined>;
  createAnnonce(data: InsertAnnonce): Promise<Annonce>;
  deleteAnnonce(id: number): Promise<void>;
  
  getDemandes(): Promise<Demande[]>;
  createDemande(data: InsertDemande): Promise<Demande>;
  deleteDemande(id: number): Promise<void>;
  
  getSetting(key: string): Promise<Setting | undefined>;
  setSetting(data: InsertSetting): Promise<Setting>;
}

export class Storage implements IStorage {
  async getAnnonces(): Promise<Annonce[]> {
    return await db.select().from(schema.annonces).orderBy(schema.annonces.createdAt);
  }

  async getAnnonceById(id: number): Promise<Annonce | undefined> {
    const results = await db.select().from(schema.annonces).where(eq(schema.annonces.id, id));
    return results[0];
  }

  async createAnnonce(data: InsertAnnonce): Promise<Annonce> {
    const results = await db.insert(schema.annonces).values(data).returning();
    return results[0];
  }

  async deleteAnnonce(id: number): Promise<void> {
    await db.delete(schema.annonces).where(eq(schema.annonces.id, id));
  }

  async getDemandes(): Promise<Demande[]> {
    return await db.select().from(schema.demandes).orderBy(schema.demandes.createdAt);
  }

  async createDemande(data: InsertDemande): Promise<Demande> {
    const results = await db.insert(schema.demandes).values(data).returning();
    return results[0];
  }

  async deleteDemande(id: number): Promise<void> {
    await db.delete(schema.demandes).where(eq(schema.demandes.id, id));
  }

  async getSetting(key: string): Promise<Setting | undefined> {
    const results = await db.select().from(schema.settings).where(eq(schema.settings.key, key));
    return results[0];
  }

  async setSetting(data: InsertSetting): Promise<Setting> {
    const existing = await this.getSetting(data.key);
    
    if (existing) {
      const results = await db
        .update(schema.settings)
        .set({ value: data.value, updatedAt: new Date() })
        .where(eq(schema.settings.key, data.key))
        .returning();
      return results[0];
    } else {
      const results = await db.insert(schema.settings).values(data).returning();
      return results[0];
    }
  }
}

export const storage = new Storage();
