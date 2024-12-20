import { NextApiRequest, NextApiResponse } from 'next';
import { pricingData } from '@/pricing/pricingData';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		// Return the pricing data
		return res.status(200).json(pricingData);
	} catch (error) {
		console.error('Error fetching prices:', error);
		return res.status(500).json({ error: 'Failed to fetch prices' });
	}
}
