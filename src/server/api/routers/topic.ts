import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'

export const topicRouter = createTRPCRouter({
  statistics: publicProcedure
    .input(z.object({}))
    .mutation(async ({ ctx, input }) => {
      return (
        await ctx.db.topic.findMany({
          select: {
            id: true,
            name: true,
            _count: {
              select: {
                posts: {},
              },
            },
          },
        })
      ).map((topic) => ({ ...topic, count: topic._count.posts }))
    }),
  getOne: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.topic.findUnique({
        where: {
          id: input.id,
        },
        include: {
          posts: true,
        },
      })
    }),
})
