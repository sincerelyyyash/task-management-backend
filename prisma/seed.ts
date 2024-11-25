import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      { name: 'Yash', email: 'yash@mail.com', password: 'yashPassword' },
      { name: 'Aditya', email: 'aditya@mail.com', password: 'AdityaPassword' },
    ],
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
