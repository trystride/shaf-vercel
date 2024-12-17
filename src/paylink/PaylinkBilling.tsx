"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Helper function
const getCallbackUrl = (path: string) => {
  return `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}${path}`;
};

interface Price {
  priceId: string;
  nickname: string;
  description: string;
  subtitle: string;
  unit_amount: number;
  includes: string[];
  active: boolean;
}

interface PaylinkBillingProps {
  isBilling: boolean;
}

const PaylinkBilling: React.FC<PaylinkBillingProps> = ({ isBilling }) => {
  const router = useRouter();
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('/api/prices');
        if (!response.ok) {
          throw new Error('Failed to fetch prices');
        }
        const data = await response.json();
        setPrices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load prices');
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const handlePayment = async (priceId: string, amount: number) => {
    try {
      const response = await fetch('/api/paylink/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          amount,
          callBackUrl: getCallbackUrl(isBilling ? '/user/billing' : '/thank-you'),
        }),
      });

      const data = await response.json();
      console.log('Payment response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment');
      }

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to create payment. Please try again later.');
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading pricing plans...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 p-8">{error}</div>;
  }

  if (!prices.length) {
    return <div className="text-center p-8">No pricing plans available.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
      {prices.map((price) => (
        <div 
          key={price.priceId}
          className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold">{price.nickname}</h3>
              {price.subtitle && (
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded mt-1">
                  {price.subtitle}
                </span>
              )}
            </div>
            <span className="text-3xl" role="img" aria-label={price.priceId === 'monthly' ? 'Monthly Plan' : 'Yearly Plan'}>
              {price.priceId === 'monthly' ? '📅' : '📆'}
            </span>
          </div>
          
          <p className="text-gray-600 mb-4">{price.description}</p>
          
          <div className="mb-6">
            <span className="text-3xl font-bold">{price.unit_amount} SAR</span>
            <span className="text-gray-600">
              {price.priceId === 'monthly' ? '/month' : '/year'}
            </span>
          </div>

          <ul className="mb-6 space-y-2">
            {price.includes.map((feature, index) => (
              <li key={index} className="flex items-center text-gray-700">
                <span className="text-green-500 mr-2" role="img" aria-label="check">✓</span>
                {feature}
              </li>
            ))}
          </ul>

          <button
            onClick={() => handlePayment(price.priceId, price.unit_amount)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Subscribe Now
          </button>
        </div>
      ))}
    </div>
  );
};

export default PaylinkBilling;
