import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  const adminRole = await prisma.role.create({
    data: {
      name: "admin",
    },
  });

  const userRole = await prisma.role.create({
    data: {
      name: "user",
    },
  });

  const guestRole = await prisma.role.create({
    data: {
      name: "guest",
    },
  });

  const user = await prisma.user.create({
    data: {
      name: faker.internet.userName(),
      password: faker.string.alphanumeric(10),
      email: faker.internet.email(),
      image: faker.internet.avatar(),
      role: {
        connect: {
          id: userRole.id,
        },
      },
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "admin",
      password: "admin",
      email: "admin@admin.admin",
      image: faker.internet.avatar(),
      role: {
        connect: {
          id: adminRole.id,
        },
      },
    },
  });

  for (let i = 0; i < 10; i++) {
    await prisma.post.create({
      data: {
        title: faker.string.alpha({ length: { min: 10, max: 20 } }),
        content: faker.string.alpha({ length: { min: 20, max: 50 } }),
        published: true,
        author: {
          connect: {
            id: user.id,
          },
        },
        comments: {
          create: {
            created_at: Date.now(),
            url: faker.internet.url(),
            text: faker.string.alpha({ length: { min: 10, max: 20 } }),
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        },
      },
    });
  }
};

main()
  .then((res) => {
    console.log("Init Data finished.");
  })
  .catch((err) => {
    console.error(err);
  });
