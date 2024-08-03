import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const collections = await prisma.collection.findMany();
    res.status(200).json(collections);
  } else if (req.method === 'POST') {
    const { name, description, stocks, price } = req.body;
    const collection = await prisma.collection.create({
      data: { name, description, stocks, price },
    });
    res.status(201).json(collection);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
