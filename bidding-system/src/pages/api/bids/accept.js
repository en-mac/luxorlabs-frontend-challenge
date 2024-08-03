import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { collectionId, bidId } = req.body;

    if (!collectionId || !bidId) {
      res.status(400).json({ error: 'Collection ID and Bid ID are required' });
      return;
    }

    try {
      // Accept the selected bid
      const acceptedBid = await prisma.bid.update({
        where: { id: parseInt(bidId) },
        data: { status: 'accepted' },
      });

      // Reject all other bids for the same collection
      await prisma.bid.updateMany({
        where: {
          collectionId: parseInt(collectionId),
          id: { not: parseInt(bidId) },
        },
        data: { status: 'rejected' },
      });

      res.status(200).json(acceptedBid);
    } catch (error) {
      res.status(500).json({ error: 'Failed to accept bid' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
