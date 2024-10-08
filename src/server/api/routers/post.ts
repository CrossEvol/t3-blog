import { z } from 'zod'

import { SearchTabEnum } from '@/app/search/constants'
import {
  CREATE_MARK,
  type ColorOption,
  type ColorOptions,
} from '@/common/select-option'
import {
  createPostSchema,
  searchPostSchema,
  updatePostSchema,
} from '@/common/trpc-schema'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc'
import { type PrismaTX } from '@/server/db'
import { Role, type Post } from '@prisma/client'

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
          await connectTopicToPost(topic, tx, insertedPost)
        }

        if (!!tags) {
          await connectTagsToPost(tags, tx, insertedPost)
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
          topic: true,
          tags: {
            select: {
              tag: true,
            },
          },
          author: {
            select: { name: true, email: true },
          },
        },
      })
      if (post === null) {
        throw new Error(`Not Found Post for #${input.id}`)
      }

      return {
        ...post,
        author: post.author,
        tags: post.tags.map((item) => item.tag) ?? [],
      }
    }),

  getDrafts: protectedProcedure.query(async ({ ctx }) => {
    const drafts = await ctx.db.post.findMany({
      where: {
        author: { id: ctx.session.user.id },
        published: false,
      },
      orderBy: [
        {
          updatedAt: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    })
    return drafts
  }),

  getMany: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      where: {
        published: true,
        author: {
          role: Role.ADMIN,
        },
      },
      orderBy: [
        {
          updatedAt: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })
    return posts
  }),

  getPage: publicProcedure
    .input(z.object({ current: z.number() }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.db.post.findMany({
        where: {
          published: true,
        },
        orderBy: [
          {
            updatedAt: 'desc',
          },
          {
            createdAt: 'desc',
          },
        ],
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
      return ctx.db.$transaction(async (tx) => {
        const disconnectTags = await tx.tagsOnPosts.deleteMany({
          where: {
            postId: input.id,
          },
        })
        const disconnectComments = await tx.comment.deleteMany({
          where: {
            postId: input.id,
          },
        })
        if (!disconnectTags || !disconnectComments) {
          throw new Error(
            `Failed to delete related record for Post#${input.id}`,
          )
        }

        const deletePost = await tx.post.delete({
          where: { id: input.id },
        })
        return deletePost
      })
    }),

  update: protectedProcedure
    .input(updatePostSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        const updatedPost = await ctx.db.post.update({
          where: { id: input.id },
          data: {
            title: input.title,
            content: input.content,
            published: input.published,
          },
        })

        const { topic, tags } = input
        const disconnectTopicResult = await tx.post.update({
          where: {
            id: updatedPost.id,
          },
          data: {
            topic: {
              disconnect: true,
            },
          },
          include: {
            topic: true,
          },
        })
        if (!!topic) {
          if (disconnectTopicResult.id) {
            await connectTopicToPost(topic, tx, updatedPost)
          }
        }

        const disconnectTagsResult = await tx.tagsOnPosts.deleteMany({
          where: {
            postId: updatedPost.id,
          },
        })
        if (!!tags) {
          if (!!disconnectTagsResult) {
            await connectTagsToPost(tags, tx, updatedPost)
          }
        }

        return updatedPost
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

  search: protectedProcedure
    .input(searchPostSchema)
    .query(async ({ ctx, input }) => {
      const posts = await ctx.db.post.findMany({
        where: {
          AND: [
            { published: true },
            {
              title:
                !!input.q && input.searchType === SearchTabEnum.Title
                  ? input.q
                  : undefined,
            },
            {
              content:
                !!input.q && input.searchType === SearchTabEnum.FullText
                  ? input.q
                  : undefined,
            },
            {
              topic:
                !!input.topics && input.topics.length > 0
                  ? {
                      name: {
                        in: input.topics,
                      },
                    }
                  : undefined,
            },
            {
              tags:
                !!input.tags && input.tags.length > 0
                  ? {
                      some: {
                        tag: {
                          name: {
                            in: input.tags,
                          },
                        },
                      },
                    }
                  : undefined,
            },
            {
              OR:
                !!input.startDay && !!input.endDay
                  ? [
                      {
                        createdAt: {
                          gt: input.startDay,
                          lt: input.endDay,
                        },
                      },
                      {
                        updatedAt: {
                          gt: input.startDay,
                          lt: input.endDay,
                        },
                      },
                    ]
                  : undefined,
            },
          ],
        },
        orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
        include: {
          author: {
            select: { name: true, email: true },
          },
          _count: {
            select: {
              comments: {},
            },
          },
          topic: {
            select: { id: true, name: true },
          },
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      })
      return posts.map((post) => ({
        ...post,
        comments: post._count.comments,
        tags: post.tags.map((t) => t.tag),
        _count: undefined,
      }))
    }),
})

async function connectTagsToPost(
  tags: ColorOptions,
  tx: PrismaTX,
  insertedPost: Post,
) {
  const newTags = tags.filter((tag) => tag.value.startsWith(CREATE_MARK))
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
  await Promise.all(
    tags
      .filter((tag) => !tag.value.startsWith(CREATE_MARK))
      .map(
        async (tag) =>
          await tx.tagsOnPosts.create({
            data: {
              tagId: Number(tag.value),
              postId: insertedPost.id,
            },
          }),
      ),
  )
}

async function connectTopicToPost(
  topic: ColorOption,
  tx: PrismaTX,
  insertedPost: Post,
) {
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
