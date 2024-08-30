import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'

export const tagRouter = createTRPCRouter({
  statistics: publicProcedure.input(z.object({})).query(async ({ ctx }) => {
    return (
      await ctx.db.tag.findMany({
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
    ).map((tag) => ({ id: tag.id, name: tag.name, count: tag._count.posts }))
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
  getByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.post.findMany({
        where: {
          tags: {
            some: {
              tag: {
                name: input.name,
              },
            },
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
