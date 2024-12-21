import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Card from '@/components/Common/Dashboard/Card';
import NotificationSettingsForm from '@/components/User/NotificationSettings/NotificationSettingsForm';
import { BellIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Notification Settings',
};

export default async function NotificationSettingsPage() {
	const session = await getServerSession(authOptions);

	if (!session?.user?.email) {
		return null;
	}

	const preferences = await prisma.notificationPreference.findFirst({
		where: {
			user: {
				email: session.user.email,
			},
		},
	});

	return (
		<div className='space-y-4'>
			<div className='flex items-center gap-2'>
				<BellIcon className='h-6 w-6' />
				<h1 className='text-2xl font-bold'>Notification Settings</h1>
			</div>
			<Card>
				<NotificationSettingsForm preferences={preferences} />
			</Card>
		</div>
	);
}
