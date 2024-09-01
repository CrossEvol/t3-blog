import { z } from 'zod'

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc'

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

  getManyForAdmin: protectedProcedure.query(async ({ ctx }) => {
    return (
      await ctx.db.topic.findMany({
        orderBy: {
          posts: {
            _count: 'desc',
          },
        },
        include: {
          _count: {
            select: {
              posts: {},
            },
          },
        },
      })
    ).map((topic) => ({
      ...topic,
      count: topic._count.posts,
      _count: undefined,
    }))
  }),

  getManyOrderByName: publicProcedure.query(async ({ ctx }) => {
    const topics = await ctx.db.topic.findMany({
      orderBy: {
        name: 'asc',
      },
    })
    return topics
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

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input: { id, name, description } }) => {
      const updateTopicResult = await ctx.db.topic.update({
        where: { id },
        data: {
          name,
          description,
        },
      })
      return updateTopicResult
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.$transaction(async (tx) => {
        const disconnectPosts = await tx.topic.update({
          where: {
            id: input.id,
          },
          data: {
            posts: {
              set: [],
            },
          },
          include: {
            posts: true,
          },
        })
        if (!disconnectPosts.id) {
          throw new Error('Disconnect Topic on Posts Failed.')
        }
        const deleteTopic = await tx.topic.delete({
          where: {
            id: input.id,
          },
        })
        return deleteTopic
      })
    }),
})
