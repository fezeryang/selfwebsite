import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { 
  getBlogPosts, getBlogPostBySlug, createBlogPost, updateBlogPost, deleteBlogPost,
  getPortfolioProjects, getFeaturedProjects, getProjectBySlug, createPortfolioProject, updatePortfolioProject, deletePortfolioProject 
} from "./db";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  blog: router({
    list: publicProcedure.query(() => getBlogPosts()),
    bySlug: publicProcedure.input((val: any) => val as { slug: string }).query(({ input }) =>
      getBlogPostBySlug(input.slug)
    ),
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string(),
        excerpt: z.string().optional(),
        content: z.string(),
        category: z.string().optional(),
        date: z.string(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        return createBlogPost(input as any);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        category: z.string().optional(),
        date: z.string().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        const { id, ...data } = input;
        return updateBlogPost(id, data as any);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        return deleteBlogPost(input.id);
      }),
  }),

  portfolio: router({
    list: publicProcedure.query(() => getPortfolioProjects()),
    featured: publicProcedure.query(() => getFeaturedProjects()),
    bySlug: publicProcedure.input((val: any) => val as { slug: string }).query(({ input }) =>
      getProjectBySlug(input.slug)
    ),
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string(),
        description: z.string(),
        technologies: z.string().optional(),
        link: z.string().optional(),
        imageUrl: z.string().optional(),
        featured: z.number().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        return createPortfolioProject(input as any);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
        technologies: z.string().optional(),
        link: z.string().optional(),
        imageUrl: z.string().optional(),
        featured: z.number().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        const { id, ...data } = input;
        return updatePortfolioProject(id, data as any);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        return deletePortfolioProject(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
