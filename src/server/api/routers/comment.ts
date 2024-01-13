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
          created_at: Date.now(),
          userId: user.id,
          postId: input.postId,
          text: input.text,
        },
      });
    }),
});
