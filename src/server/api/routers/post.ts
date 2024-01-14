import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({ title: z.string().min(1), content: z.string().optional() }),
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.post.create({
        data: {
          title: input.title,
          content: input.content,
          published: false,
          author: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getOne: publicProcedure
    .input(z.object({ id: z.number().min(1) }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: {
          id: input.id,
        },
        include: {
          author: {
            select: { name: true, email: true },
          },
        },
      });
      return post;
    }),

  getDrafts: protectedProcedure.query(async ({ ctx }) => {
    const drafts = await ctx.db.post.findMany({
      where: {
        author: { email: ctx.session.user.email },
      },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });
    return drafts;
  }),

  getMany: publicProcedure.query(async ({ ctx }) => {
    const drafts = await ctx.db.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    return drafts;
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.number().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.post.delete({
        where: { id: input.id },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1),
        title: z.string().min(1),
        content: z.string().optional(),
        published: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.post.update({
        where: { id: input.id },
        data: {
          title: input.title,
          content: input.content,
          published: input.published,
        },
      });
    }),

  publish: protectedProcedure
    .input(z.object({ id: z.number().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.post.update({
        where: { id: input.id },
        data: { published: true },
      });
    }),
});
