import React from 'react';
import Breadcrumb from '@/components/Common/Dashboard/Breadcrumb';
import AccountSettings from '@/components/User/AccountSettings';
import { Metadata } from 'next';
import { ar } from '@/translations/ar';

export const metadata: Metadata = {
	title: `${ar.accountSettings.title} - ${process.env.SITE_NAME}`,
	description: ar.accountSettings.description,
};

const AccountSettingsPage = () => {
	return (
		<>
			<Breadcrumb pageTitle={ar.accountSettings.title} />
			<AccountSettings />
		</>
	);
};

export default AccountSettingsPage;
