"use client";

import PriceItem from "./PriceItem";
import { Price } from "../../types/priceItem";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  isBilling: boolean;
}

const PaylinkBilling = ({ isBilling }: Props) => {
  const { data: session } = useSession();
  const [prices, setPrices] = useState<Price[]>([]);
  const [subscriptionPlan, setSubscriptionPlan] = useState<any>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get("/api/prices");
        setPrices(response.data);
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    fetchPrices();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-base font-semibold leading-7 text-blue-600">
          Pricing Plans
        </h1>
        <p className="mt-2 text-4xl font-bold tracking-tight text-black dark:text-white sm:text-5xl">
          Choose your subscription
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        Simple, transparent pricing that grows with you. Try any plan risk-free with our money-back guarantee.
      </p>

      <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
        {prices.map((plan) => (
          <PriceItem
            key={plan.priceId}
            plan={plan}
            isBilling={isBilling}
            subscriptionPlan={subscriptionPlan}
          />
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
        <p>Prices are in Saudi Riyal (SAR). VAT may apply.</p>
        <p className="mt-2">Need a custom plan? <a href="/contact" className="text-blue-600 hover:text-blue-700">Contact us</a></p>
      </div>
    </div>
  );
};

export default PaylinkBilling;
