import Breadcrumb from '@/components/Common/Dashboard/Breadcrumb';
import EditProfile from '@/components/User/AccountSettings/EditProfile';
import PasswordChange from '@/components/User/AccountSettings/PasswordChange';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Account Settings - ${process.env.SITE_NAME}',
	description: 'Account Settings Description',
};

export default function AccountSettingsPage() {
	return (
		<>
			<Breadcrumb pageTitle='Account Settings' />

			<div className='grid grid-cols-1 gap-9 sm:grid-cols-2'>
				<EditProfile />
				<PasswordChange />
			</div>
		</>
	);
}
