import React from 'react';
import Billing from '@/components/User/Billing';
import Breadcrumb from '@/components/Common/Dashboard/Breadcrumb';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'الفواتير',
	description: 'صفحة الفواتير',
	// other discriptions
};

const BillingPage = () => {
	return (
		<>
			<Breadcrumb pageTitle='الفواتير' />
			<Billing />
		</>
	);
};

export default BillingPage;
