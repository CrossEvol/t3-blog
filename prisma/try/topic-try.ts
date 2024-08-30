import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const main = async () => {
  const res = await prisma.topic.findMany({
    select: {
      name: true,
      _count: {
        select: {
          posts: {},
        },
      },
    },
  })
  console.log(res)

  const posts = await prisma.topic.findUnique({
    where: {
      id: 1,
    },
    include: {
      posts: true,
    },
  })
  console.log(JSON.stringify(posts))
}

main()
  .then((_) => console.log())
  .catch((err) => console.error(err))
