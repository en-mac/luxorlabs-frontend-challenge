import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { price, status } = req.body;
    try {
      const bid = await prisma.bid.update({
        where: { id: parseInt(id) },
        data: { price, status },
      });
      res.status(200).json(bid);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update bid' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.bid.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status500().json({ error: 'Failed to delete bid' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
