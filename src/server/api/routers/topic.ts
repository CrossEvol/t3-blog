import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'

export const topicRouter = createTRPCRouter({
  statistics: publicProcedure.input(z.object({})).query(async ({ ctx }) => {
    return (
      await ctx.db.topic.findMany({
        orderBy: {
          posts: {
            _count: 'desc',
          },
        },
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
      return await ctx.db.post.findMany({
        where: {
          topic: {
            name: input.name,
          },
        },
        include: {
          author: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      })
    }),
})
