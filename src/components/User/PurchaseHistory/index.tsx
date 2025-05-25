'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import PurchaseEmptyState from './PurchaseEmptyState';
import PurchaseTable from './PurchaseTable';
import { pricingData } from '@/pricing/pricingData';

const PurchaseHistory = () => {
	const { data: session, status } = useSession();
	const user = session?.user;

	// If session is loading or user is not authenticated, show loading or null
	if (status === 'loading') return <div>Loading...</div>;
	if (!user) return null;

	const purchasedPlan = pricingData.find(
		(plan) => plan.priceId === user?.priceId
	);

	const isSubscribed =
		user.priceId &&
		user.currentPeriodEnd &&
		new Date(user.currentPeriodEnd as Date).getTime() + 86_400_000 > Date.now();

	const data = {
		unit_amount: purchasedPlan?.unit_amount,
		currentPeriodEnd: user?.currentPeriodEnd,
		subscriptionId: user?.subscriptionId,
		nickname: purchasedPlan?.nickname,
	};

	return (
		<>{isSubscribed ? <PurchaseTable data={data} /> : <PurchaseEmptyState />}</>
	);
};

export default PurchaseHistory;
