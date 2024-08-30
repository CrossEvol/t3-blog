import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'

export const tagRouter = createTRPCRouter({
  statistics: publicProcedure
    .input(z.object({}))
    .mutation(async ({ ctx, input }) => {
      return (
        await ctx.db.tag.findMany({
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
      ).map((tag) => ({ ...tag, count: tag._count.posts }))
    }),
  getOne: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.tag.findUnique({
        where: {
          id: input.id,
        },
        include: {
          posts: {
            select: {
              post: true,
            },
          },
        },
      })
    }),
})
