import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  const role = await prisma.role.findFirst({
    where: {
      User: {
        some: {
          id: {
            equals: "clrd1z1ly0000kbtpox88g8uw",
          },
        },
      },
    },
  });

  console.log(role);
};

main()
  .then((res) => {
    console.log("Test Data finished.");
  })
  .catch((err) => {
    console.error(err);
  });
