'use client';

import axios from 'axios';
import { Price } from '../../types/priceItem';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { integrations, messages } from '../../../integrations.config';
import toast from 'react-hot-toast';
import { FC } from 'react';

interface PriceItemProps {
	plan: Price;
	_isBilling: boolean;
	_subscriptionPlan?: string;
}

const PriceItem: FC<PriceItemProps> = ({
	plan,
	_isBilling,
	_subscriptionPlan,
}) => {
	const { data: session } = useSession();
	const _user = session?.user;

	// paylink payment
	const handleSubscription = async () => {
		if (!integrations?.isPaymentsEnabled) {
			toast.error(messages?.payment);
			return;
		}

		try {
			const res = await axios.post('/api/paylink/payment', {
				priceId: plan.priceId,
				amount: plan.unit_amount,
				userId: session?.user?.id,
			});

			const paymentData = res.data;

			if (paymentData?.paymentUrl) {
				window.location.href = paymentData.paymentUrl;
			}
		} catch (err) {
			console.error((err as Error).message);
			toast.error('Payment initialization failed. Please try again.');
		}
	};

	const active = plan?.active;
	const isSubscribed = Boolean(
		session && session?.user?.priceId === plan?.priceId
	);

	const activeStyle = active
		? 'relative flex flex-col p-6 bg-white shadow-lg rounded-lg dark:bg-zinc-850 justify-between border-2 border-blue-600'
		: 'relative flex flex-col p-6 bg-white shadow-lg rounded-lg dark:bg-zinc-850 justify-between border border-zinc-200 dark:border-zinc-700';

	return (
		<div className={activeStyle}>
			{active && (
				<div className='absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-2 text-center text-sm font-medium text-white'>
					Most Popular
				</div>
			)}

			<div>
				<div className='flex items-center justify-between'>
					<div>
						<h3 className='text-2xl font-bold text-black dark:text-white'>
							{plan.nickname}
						</h3>
						{plan.subtitle && (
							<p className='mt-1 text-sm font-medium text-blue-600'>
								{plan.subtitle}
							</p>
						)}
					</div>
					{plan.icon && (
						<Image
							src={plan.icon}
							width={100}
							height={100}
							alt='Plan icon'
							className='h-12 w-12'
						/>
					)}
				</div>

				<p className='mt-4 text-zinc-600 dark:text-zinc-400'>
					{plan.description}
				</p>
				<p className='mt-4'>
					<span className='text-4xl font-bold text-black dark:text-white'>
						{plan.unit_amount} SAR
					</span>
					<span className='text-base font-normal text-zinc-600 dark:text-zinc-400'>
						/{plan.priceId === 'monthly' ? 'month' : 'year'}
					</span>
				</p>

				<ul className='mt-8 space-y-4'>
					{plan.includes.map((feature: string) => (
						<li key={feature} className='flex items-center'>
							<svg
								className='h-5 w-5 text-blue-600'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M5 13l4 4L19 7'
								/>
							</svg>
							<span className='ml-3 text-zinc-600 dark:text-zinc-400'>
								{feature}
							</span>
						</li>
					))}
				</ul>
			</div>

			<button
				onClick={handleSubscription}
				className={`${
					isSubscribed
						? 'cursor-not-allowed bg-zinc-300'
						: active
							? 'bg-blue-600 hover:bg-blue-700'
							: 'bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100'
				} mt-8 block w-full rounded-lg px-4 py-3 text-center font-semibold text-white transition-colors duration-200`}
				disabled={isSubscribed}
			>
				{isSubscribed ? 'Current Plan' : 'Get Started'}
			</button>
		</div>
	);
};

export default PriceItem;
