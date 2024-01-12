import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({ name: z.string().min(1), content: z.string().optional() }),
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.post.create({
        data: {
          name: input.name,
          title: input.name,
          content: input.content,
          author: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getOne: protectedProcedure
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

  getManyForAuthor: protectedProcedure.query(async ({ ctx }) => {
    const drafts = await ctx.db.post.findMany({
      where: {
        author: { email: ctx.session.user.email },
        published: false,
      },
      include: {
        author: {
          select: { name: true },
        },
      },
    });
    return drafts;
  }),

  getMany: protectedProcedure.query(async ({ ctx }) => {
    const drafts = await ctx.db.post.findMany({
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

  publish: protectedProcedure
    .input(z.object({ id: z.number().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.post.update({
        where: { id: input.id },
        data: { published: true },
      });
    }),
});
