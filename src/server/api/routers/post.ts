import { z } from 'zod'

import { CREATE_MARK } from '@/common/select-option'
import { createPostSchema } from '@/common/trpc-schema'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc'

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        // simulate a slow db call
        await new Promise((resolve) => setTimeout(resolve, 1))

        const insertedPost = await tx.post.create({
          data: {
            title: input.title,
            content: input.content,
            published: input.published,
            author: { connect: { id: ctx.session.user.id } },
          },
        })

        const { topic, tags } = input
        if (!!topic) {
          let topicIdToBeConnected = 0
          if (topic.value.startsWith(CREATE_MARK)) {
            // topic exists or not
            const count = await tx.topic.count({
              where: {
                name: topic.label,
              },
            })
            if (count === 0) {
              const insertedTopic = await tx.topic.create({
                data: {
                  name: topic.label,
                },
              })
              topicIdToBeConnected = insertedTopic.id
            }
          } else {
            topicIdToBeConnected = Number(topic.value)
          }
          await tx.post.update({
            where: {
              id: insertedPost.id,
            },
            data: {
              topic: {
                connect: {
                  id: topicIdToBeConnected,
                },
              },
            },
          })
        }

        if (!!tags) {
          const newTags = tags.filter((tag) =>
            tag.value.startsWith(CREATE_MARK),
          )
          for (const tag of newTags) {
            // tag exists or not
            let tagIdToBeConnected = 0
            const count = await tx.tag.count({
              where: {
                name: tag.label,
              },
            })
            if (count === 0) {
              const insertedTag = await tx.tag.create({
                data: { name: tag.label },
              })
              tagIdToBeConnected = insertedTag.id
            } else {
              tagIdToBeConnected = Number(tag.value)
            }
            await tx.tagsOnPosts.create({
              data: {
                tagId: tagIdToBeConnected,
                postId: insertedPost.id,
              },
            })
          }
          await tags
            .filter((tag) => !tag.value.startsWith(CREATE_MARK))
            .map(
              async (tag) =>
                await tx.tagsOnPosts.create({
                  data: {
                    tagId: Number(tag.value),
                    postId: insertedPost.id,
                  },
                }),
            )
        }

        return insertedPost
      })
    }),

  getOne: publicProcedure
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
      })
      return post
    }),

  getDrafts: protectedProcedure.query(async ({ ctx }) => {
    const drafts = await ctx.db.post.findMany({
      where: {
        author: { email: ctx.session.user.email },
        published: false,
      },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    })
    return drafts
  }),

  getMany: publicProcedure.query(async ({ ctx }) => {
    const drafts = await ctx.db.post.findMany({
      where: {
        published: true,
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
    return drafts
  }),

  getPage: publicProcedure
    .input(z.object({ current: z.number() }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.db.post.findMany({
        where: {
          published: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        include: {
          author: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        skip: 10 * (input.current - 1),
        take: 10,
      })
      const count = await ctx.db.post.count({})
      return { posts, count, current: input.current }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.post.delete({
        where: { id: input.id },
      })
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1),
        title: z.string().min(1),
        content: z.string().optional(),
        published: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.post.update({
        where: { id: input.id },
        data: {
          title: input.title,
          content: input.content,
          published: input.published,
        },
      })
    }),

  publish: protectedProcedure
    .input(z.object({ id: z.number().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.post.update({
        where: { id: input.id },
        data: { published: true },
      })
    }),
})
