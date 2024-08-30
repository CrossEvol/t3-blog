import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'

export const topicRouter = createTRPCRouter({
  statistics: publicProcedure
    .input(z.object({}))
    .query(async ({ ctx, input }) => {
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
      ).map((topic) => ({
        id: topic.id,
        name: topic.name,
        count: topic._count.posts,
      }))
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
  getByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.topic.findUnique({
        where: {
          name: input.name,
        },
        include: {
          posts: true,
        },
      })
    }),
})
