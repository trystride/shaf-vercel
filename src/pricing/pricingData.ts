import { Price } from "@/types/priceItem";

export const pricingData: Price[] = [
	{
		priceId: "price_1ObHbkLtGdPVhGLem0CLA5iT",
		// priceId: "pri_01hzmcag0dnd53x9kn78bs5vz0",
		// priceId: "375601",
		unit_amount: 99 * 100,
		nickname: "Basic",
		description:
			"Lorem ipsum dolor sit amet dolorol met conse ctetur adipiscing elit.",
		subtitle: "For individuals",
		includes: [
			"All basic features",
			"Up to 1,000,000 tracked visits",
			"Premium email support",
			"Up to 03 team members",
		],
		icon: `/images/pricing/pricing-icon-01.svg`,
	},
	{
		priceId: "price_1ObHcJLtGdPVhGLeBp9hB4nv",
		// priceId: "pri_01hzmkbh0ya1zaw2g8cyr3r90f",
		// priceId: "376599",
		unit_amount: 199 * 100,
		nickname: "Pro",
		description:
			"Lorem ipsum dolor sit amet dolorol met conse ctetur adipiscing elit.",
		subtitle: "For startups",
		includes: [
			"All basic features",
			"Up to 1,000,000 tracked visits",
			"Premium email support",
			"Up to 10 team members",
		],
		icon: `/images/pricing/pricing-icon-02.svg`,
		icon2: `/images/pricing/pricing-icon-02-2.svg`,
		active: true,
	},
	{
		priceId: "price_1ObHcXLtGdPVhGLejTMpdiT8",
		// priceId: "pri_01hzmkcdbb3kdvvqjgt259nds1",
		// priceId: "376601",
		unit_amount: 399 * 100,
		nickname: "Enterprise",
		description:
			"Lorem ipsum dolor sit amet dolorol met conse ctetur adipiscing elit.",
		subtitle: "For big companies",
		includes: [
			"All basic features",
			"Up to 1,000,000 tracked visits",
			"Premium email support",
			"Up to 50 team members",
		],
		icon: `/images/pricing/pricing-icon-03.svg`,
	},
];
