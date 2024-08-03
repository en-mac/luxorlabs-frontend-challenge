const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const main = async () => {
  const users = await prisma.user.createMany({
    data: Array.from({ length: 10 }).map((_, i) => ({
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
    })),
  });

  const collections = await prisma.collection.createMany({
    data: Array.from({ length: 100 }).map((_, i) => ({
      name: `Collection ${i + 1}`,
      description: `Description for collection ${i + 1}`,
      stocks: Math.floor(Math.random() * 100),
      price: parseFloat((Math.random() * 100).toFixed(2)),
    })),
  });

  const bids = [];
  for (let i = 1; i <= 100; i++) {
    for (let j = 0; j < 10; j++) {
      bids.push({
        collectionId: i,
        price: parseFloat((Math.random() * 100).toFixed(2)),
        userId: Math.floor(Math.random() * 10) + 1,
      });
    }
  }

  await prisma.bid.createMany({
    data: bids,
  });
};

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
