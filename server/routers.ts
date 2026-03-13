import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getBlogPosts, getBlogPostBySlug, getPortfolioProjects, getFeaturedProjects, getProjectBySlug } from "./db";

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
  }),

  portfolio: router({
    list: publicProcedure.query(() => getPortfolioProjects()),
    featured: publicProcedure.query(() => getFeaturedProjects()),
    bySlug: publicProcedure.input((val: any) => val as { slug: string }).query(({ input }) =>
      getProjectBySlug(input.slug)
    ),
  }),
});

export type AppRouter = typeof appRouter;
