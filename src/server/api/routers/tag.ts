import { z } from 'zod'

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc'

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

  getManyForAdmin: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      return (
        await ctx.db.tag.findMany({
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
      ).map((tag) => ({ ...tag, count: tag._count.posts, _count: undefined }))
    }),

  getManyOrderByName: protectedProcedure.query(async ({ ctx }) => {
    const tags = await ctx.db.tag.findMany({
      orderBy: {
        name: 'asc',
      },
    })
    return tags
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

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input: { id, name, description } }) => {
      const updateTagResult = await ctx.db.tag.update({
        where: { id },
        data: {
          name,
          description,
        },
      })
      return updateTagResult
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.$transaction(async (tx) => {
        const disconnectPosts = await tx.tagsOnPosts.deleteMany({
          where: {
            tagId: input.id,
          },
        })
        if (!disconnectPosts) {
          throw new Error('Disconnect Tags on Posts failed.')
        }
        const deleteTopic = await tx.tag.delete({
          where: {
            id: input.id,
          },
        })
        return deleteTopic
      })
    }),
})
