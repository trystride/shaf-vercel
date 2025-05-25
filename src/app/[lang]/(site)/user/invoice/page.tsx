'use client';

import React from 'react';
import PurchaseHistory from '@/components/User/PurchaseHistory';
import Breadcrumb from '@/components/Common/Dashboard/Breadcrumb';
import { useTranslation } from '@/app/context/TranslationContext';

const PurchaseHistoryPage = () => {
	const t = useTranslation();
	return (
		<>
			<Breadcrumb pageTitle={t.invoice.title} />
			<PurchaseHistory />
		</>
	);
};

export default PurchaseHistoryPage;
