import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const initData = async () => {
  await prisma.$transaction(async (prisma) => {
    // create users
    const user = await prisma.user.create({
      data: {
        name: faker.internet.userName(),
        password: faker.string.alphanumeric(10),
        email: faker.internet.email(),
        image: faker.image.avatar(),
        role: 'USER',
      },
    })

    const admin = await prisma.user.create({
      data: {
        name: 'admin',
        password: 'admin',
        email: 'admin@admin.admin',
        image: faker.image.avatar(),
        role: 'ADMIN',
      },
    })

    // create topics
    for (let i = 0; i < 20; i++) {
      await prisma.topic.create({
        data: {
          name: faker.word.noun(),
        },
      })
    }

    // create posts
    for (let i = 0; i < 1000; i++) {
      await prisma.post.create({
        data: {
          title: faker.string.alpha({ length: { min: 10, max: 20 } }),
          content: faker.string.alpha({ length: { min: 20, max: 50 } }),
          published: true,
          author: {
            connect: {
              id: admin.id,
            },
          },
          comments: {
            create: {
              url: faker.internet.url(),
              text: faker.string.alpha({ length: { min: 10, max: 20 } }),
              user: {
                connect: {
                  id: admin.id,
                },
              },
            },
          },
        },
      })
    }

    // create tags
    for (let i = 0; i < 40; i++) {
      await prisma.tag.create({
        data: {
          name: faker.word.adjective(),
        },
      })
    }
  })
}

const connectData = async () => {
  for (let i = 1; i <= 1000; i++) {
    const post = await prisma.post.findUnique({
      where: {
        id: i,
      },
    })
    await prisma.post.update({
      where: {
        id: i,
      },
      data: {
        ...post,
        topicId: faker.number.int({ min: 1, max: 20 }),
      },
    })
    await prisma.tagsOnPosts.create({
      data: {
        postId: i,
        tagId: faker.number.int({ min: 1, max: 40 }),
      },
    })
  }
}

const main = () => {
  initData()
    .then((res) => {
      console.log('Init Data finished.')
      connectData()
        .then((res) => console.log('Connect Data finished'))
        .catch((err) => console.error(err))
    })
    .catch((err) => {
      console.error(err)
    })
}

main()
