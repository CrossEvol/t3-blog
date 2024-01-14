import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const commentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        text: z.string().min(0),
        postId: z.number().min(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;

      return ctx.db.comment.create({
        data: {
          userId: user.id,
          postId: input.postId,
          text: input.text,
        },
      });
    }),

  getMany: publicProcedure
    .input(z.object({ postId: z.number().min(0) }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.comment.findMany({
        where: {
          postId: input.postId,
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });
    }),

  deleteOne: protectedProcedure
    .input(z.object({ commentId: z.number().min(0) }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;

      // TODO: only the role ADMIN can delete comment

      return await ctx.db.comment.delete({
        where: {
          id: input.commentId,
        },
      });
    }),
});
