'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import type { FC } from 'react';
import Image from 'next/image';
import { pricingData } from '@/pricing/pricingData';

interface PaylinkBillingProps {
	isBilling?: boolean;
}

const PaylinkBilling: FC<PaylinkBillingProps> = ({ isBilling = true }) => {
	const router = useRouter();
	const [prices] = useState(pricingData);

	const handlePayment = async (
		priceId: string,
		amount: number,
		isTrial: boolean = false
	) => {
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
		<div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
			<div className='mb-16 text-center'>
				<h2 className='mb-4 text-4xl font-bold text-gray-900'>
					Simple Affordable Pricing
				</h2>
				{isBilling ? (
					<p className='mx-auto max-w-3xl text-xl text-gray-600'>
						Start with a 14-day free trial. No credit card required.
					</p>
				) : (
					<h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
						We&apos;ll help you choose
					</h2>
				)}
			</div>

			<div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
				{prices.map((price) => {
					const isPro = price.nickname.toLowerCase().includes('pro');
					return (
						<div
							key={price.priceId}
							className={`relative rounded-2xl p-8 ${
								isPro ? 'bg-blue-600 text-white' : 'bg-white text-black'
							} shadow-xl transition-all duration-300 hover:scale-105`}
						>
							{isPro && (
								<div className='absolute right-4 top-4'>
									<span className='rounded-full bg-white px-4 py-1 text-sm font-medium text-blue-600'>
										Popular
									</span>
								</div>
							)}

							<div className='mb-6 flex items-center space-x-4'>
								<div
									className={`rounded-xl p-3 ${isPro ? 'bg-white/20' : 'bg-blue-50'}`}
								>
									{price.icon && (
										<Image
											src={price.icon}
											alt={`${price.nickname} icon`}
											width={120}
											height={120}
											className='w-full object-contain filter dark:invert'
										/>
									)}
								</div>
							</div>

							<h3
								className={`mb-4 text-2xl font-bold ${
									isPro ? 'text-white' : 'text-gray-900'
								}`}
							>
								{price.nickname}
							</h3>

							<p
								className={`mb-6 ${isPro ? 'text-white/80' : 'text-gray-500'}`}
							>
								{price.description}
							</p>

							<div className='mb-8 flex items-baseline'>
								<span
									className={`text-5xl font-bold ${
										isPro ? 'text-white' : 'text-gray-900'
									}`}
								>
									${price.unit_amount / 100}
								</span>
								<span className={isPro ? 'text-white/80' : 'text-gray-500'}>
									/month
								</span>
							</div>

							<div className='mb-8'>
								<h4
									className={`mb-4 font-semibold ${
										isPro ? 'text-white' : 'text-gray-900'
									}`}
								>
									What&apos;s included
								</h4>
								<ul className='space-y-4'>
									{price.includes.map((feature) => (
										<li
											key={`${price.priceId}-${feature}`}
											className='flex items-center'
										>
											<svg
												className={`mr-3 h-5 w-5 ${
													isPro ? 'text-white' : 'text-blue-600'
												}`}
												fill='currentColor'
												viewBox='0 0 20 20'
											>
												<title>Checkmark</title>
												<path
													fillRule='evenodd'
													d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
													clipRule='evenodd'
												/>
											</svg>
											<span
												className={isPro ? 'text-white/80' : 'text-gray-500'}
											>
												{feature}
											</span>
										</li>
									))}
								</ul>
							</div>

							<button
								type='button'
								onClick={() =>
									isBilling && price.priceId
										? handlePayment(price.priceId, price.unit_amount)
										: undefined
								}
								disabled={!isBilling || !price.active}
								className={`w-full rounded-lg px-4 py-2 text-center font-medium ${
									isPro
										? 'bg-white text-blue-600 hover:bg-gray-100'
										: 'bg-blue-600 text-white hover:bg-blue-700'
								} ${(!isBilling || !price.active) && 'cursor-not-allowed opacity-50'}`}
							>
								{isBilling ? 'Get Started' : 'Available'}
							</button>
							{!isBilling && (
								<span className='text-sm text-gray-500'>
									We&apos;ll help you find the best plan for your needs.
								</span>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default PaylinkBilling;
