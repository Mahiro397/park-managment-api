import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.park.createMany({
    data: [
      {
        name: '墨田区立隅田公園',
        lon: 139.803,
        lat: 35.710,
        created_at: new Date(),
      },
      {
        name: '錦糸公園',
        lon: 139.816,
        lat: 35.696,
        created_at: new Date(),
      },
      {
        name: '大横川親水公園',
        lon: 139.799,
        lat: 35.683,
        created_at: new Date(),
      },
    ],
  });

  console.log('Seed data has been inserted');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
