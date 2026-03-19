import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, BlogPost, blogPosts, PortfolioProject, portfolioProjects } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Blog Posts
export async function getBlogPosts(): Promise<BlogPost[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(blogPosts).orderBy(blogPosts.createdAt);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Portfolio Projects
export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(portfolioProjects).orderBy(portfolioProjects.createdAt);
}

export async function getFeaturedProjects(): Promise<PortfolioProject[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(portfolioProjects).where(eq(portfolioProjects.featured, 1));
}

export async function getProjectBySlug(slug: string): Promise<PortfolioProject | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(portfolioProjects).where(eq(portfolioProjects.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Blog CRUD Operations
export async function createBlogPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(blogPosts).values({
    ...post,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  
  const id = result[0]?.insertId as number;
  return getBlogPostById(id);
}

export async function getBlogPostById(id: number): Promise<BlogPost | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateBlogPost(id: number, post: Partial<BlogPost>): Promise<BlogPost | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(blogPosts).set({ ...post, updatedAt: new Date() }).where(eq(blogPosts.id, id));
  return getBlogPostById(id);
}

export async function deleteBlogPost(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  return true;
}

// Portfolio CRUD Operations
export async function createPortfolioProject(project: Omit<PortfolioProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<PortfolioProject | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(portfolioProjects).values({
    ...project,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  
  const id = result[0]?.insertId as number;
  return getProjectById(id);
}

export async function getProjectById(id: number): Promise<PortfolioProject | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(portfolioProjects).where(eq(portfolioProjects.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updatePortfolioProject(id: number, project: Partial<PortfolioProject>): Promise<PortfolioProject | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(portfolioProjects).set({ ...project, updatedAt: new Date() }).where(eq(portfolioProjects.id, id));
  return getProjectById(id);
}

export async function deletePortfolioProject(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  await db.delete(portfolioProjects).where(eq(portfolioProjects.id, id));
  return true;
}
