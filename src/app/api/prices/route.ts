import { NextResponse } from 'next/server';
import { Price } from '@/types/priceItem';

const prices: Price[] = [
	{
		priceId: 'monthly',
		nickname: 'Monthly Plan',
		description: 'Perfect for individuals and small teams',
		subtitle: 'Most Popular',
		unit_amount: 180,
		includes: [
			'All features included',
			'Priority support',
			'Monthly billing',
			'Cancel anytime',
		],
		active: true,
		icon: '⭐️',
	},
	{
		priceId: 'yearly',
		nickname: 'Yearly Plan',
		description: 'Best value for long-term commitment',
		subtitle: 'Save 20%',
		unit_amount: 1728,
		includes: [
			'All features included',
			'Priority support',
			'Yearly billing',
			'2 months free',
			'Cancel anytime',
		],
		active: true,
		icon: '🌟',
	},
];

export async function GET() {
	return NextResponse.json(prices);
}
