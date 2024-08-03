import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const bids = await prisma.bid.findMany({
        where: { collectionId: parseInt(id) },
      });
      res.status(200).json(bids);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch bids' });
    }
  } else if (req.method === 'PUT') {
    const { name, description, stocks, price } = req.body;
    try {
      const collection = await prisma.collection.update({
        where: { id: parseInt(id) },
        data: { name, description, stocks, price },
      });
      res.status(200).json(collection);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update collection' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.bid.deleteMany({
        where: { collectionId: parseInt(id) },
      });

      await prisma.collection.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete collection' });
    }
  } else if (req.method === 'POST') {
    const { price, userName, userEmail } = req.body;
    if (!userName || !userEmail) {
      res.status(400).json({ error: 'User name and email are required' });
      return;
    }

    try {
      let user = await prisma.user.findUnique({
        where: { email: userEmail },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: userName,
            email: userEmail,
          },
        });
      }

      const bid = await prisma.bid.create({
        data: {
          price,
          userId: user.id,
          collectionId: parseInt(id),
          status: 'pending',
        },
      });
      res.status(201).json(bid);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create bid' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
