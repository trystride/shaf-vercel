import { Price } from "@/types/priceItem";

export const pricingData: Price[] = [
  {
    priceId: "price_1ObHbkLtGdPVhGLem0CLA5iT",
    unit_amount: 9 * 100, // $9/month
    nickname: "Starter",
    description: "Perfect for individuals and small projects",
    subtitle: "For individuals",
    includes: [
      "2 Keywords monitoring",
      "Real-time notifications",
      "Basic analytics dashboard",
      "Email alerts",
      "7-day announcement history"
    ],
    icon: `/images/pricing/pricing-icon-01.svg`,
  },
  {
    priceId: "price_1ObHcJLtGdPVhGLeBp9hB4nv",
    unit_amount: 29 * 100, // $29/month
    nickname: "Pro",
    description: "Ideal for growing businesses and teams",
    subtitle: "Most Popular",
    includes: [
      "10 Keywords monitoring",
      "Advanced analytics & reports",
      "Priority notifications",
      "Slack integration",
      "30-day announcement history",
      "API access"
    ],
    icon: `/images/pricing/pricing-icon-02.svg`,
    icon2: `/images/pricing/pricing-icon-02-2.svg`,
    active: true,
  },
  {
    priceId: "price_1ObHcXLtGdPVhGLejTMpdiT8",
    unit_amount: 99 * 100, // $99/month
    nickname: "Enterprise",
    description: "For organizations needing maximum coverage",
    subtitle: "For large teams",
    includes: [
      "Unlimited keywords",
      "Custom analytics solutions",
      "Dedicated account manager",
      "Custom integrations",
      "Unlimited history",
      "Priority support",
      "Custom feature development"
    ],
    icon: `/images/pricing/pricing-icon-03.svg`,
  },
];
