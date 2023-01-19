import { PrismaClient } from "@prisma/client";
import { postsData } from "./data";

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  //ONLY IN DEV MODE ==============
  await prisma.post.deleteMany();
  //==============

  // USERS AND ACCOUNT ========================================================================
  for (const post of postsData) {
    await prisma.post.create({
      data: post,
    });
  }

  //==============
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
