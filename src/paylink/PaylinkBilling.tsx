"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import { pricingData } from '@/pricing/pricingData';

interface Price {
  priceId: string;
  nickname: string;
  description: string;
  subtitle?: string;
  unit_amount: number;
  includes: string[];
  active?: boolean;
  icon?: string;
  icon2?: string;
}

interface PaylinkBillingProps {
  isBilling?: boolean;
}

const PaylinkBilling: React.FC<PaylinkBillingProps> = ({ isBilling = true }) => {
  const router = useRouter();
  const [prices] = useState<Price[]>(pricingData);

  const handlePayment = async (priceId: string, amount: number, isTrial: boolean = false) => {
    try {
      const callbackUrl = `${window.location.origin}/billing/success`;
      
      const response = await axios.post('/api/paylink/subscription', {
        priceId,
        amount,
        isTrial,
        callbackUrl,
      });

      const { paymentUrl } = response.data;
      
      if (paymentUrl) {
        router.push(paymentUrl);
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to create subscription. Please try again later.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Simple Affordable Pricing
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {isBilling 
            ? 'Start with a 14-day free trial. No credit card required.'
            : 'Choose the perfect plan for your needs. Start with a 14-day trial.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {prices.map((price, index) => {
          const isPro = price.nickname.toLowerCase().includes('pro');
          return (
            <div
              key={price.priceId}
              className={`relative rounded-2xl p-8 ${
                isPro ? 'bg-blue-600 text-white' : 'bg-white'
              } shadow-xl transition-all duration-300 hover:scale-105`}
            >
              {isPro && (
                <div className="absolute top-4 right-4">
                  <span className="px-4 py-1 text-sm font-medium text-blue-600 bg-white rounded-full">
                    Popular
                  </span>
                </div>
              )}

              <div className="flex items-center space-x-4 mb-6">
                <div className={`p-3 rounded-xl ${isPro ? 'bg-white/20' : 'bg-blue-50'}`}>
                  {price.icon && (
                    <img
                      src={price.icon}
                      alt={`${price.nickname} icon`}
                      className="w-8 h-8"
                    />
                  )}
                </div>
                <div>
                  <p className={`text-sm ${isPro ? 'text-blue-100' : 'text-blue-600'}`}>
                    {price.subtitle}
                  </p>
                  <h3 className={`text-xl font-bold ${isPro ? 'text-white' : 'text-gray-900'}`}>
                    {price.nickname}
                  </h3>
                </div>
              </div>

              <p className={`mb-6 ${isPro ? 'text-blue-100' : 'text-gray-600'}`}>
                {price.description}
              </p>

              <div className="flex items-baseline mb-8">
                <span className={`text-5xl font-bold ${isPro ? 'text-white' : 'text-gray-900'}`}>
                  ${price.unit_amount / 100}
                </span>
                <span className={`ml-2 ${isPro ? 'text-blue-100' : 'text-gray-500'}`}>
                  /monthly
                </span>
              </div>

              <div className="mb-8">
                <h4 className={`font-semibold mb-4 ${isPro ? 'text-white' : 'text-gray-900'}`}>
                  What's included
                </h4>
                <ul className="space-y-4">
                  {price.includes.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <svg
                        className={`w-5 h-5 mr-3 ${isPro ? 'text-white' : 'text-blue-600'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className={isPro ? 'text-blue-100' : 'text-gray-600'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => isBilling ? handlePayment(price.priceId, price.unit_amount) : undefined}
                disabled={!isBilling || !price.active}
                className={`w-full py-4 px-6 rounded-xl text-center font-semibold transition-colors ${
                  isPro
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } ${(!isBilling || !price.active) && 'opacity-50 cursor-not-allowed'}`}
              >
                {isBilling ? 'Get Started' : 'Available'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaylinkBilling;
