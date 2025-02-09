'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ClockIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/app/context/TranslationContext';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export type EmailFrequency = 'IMMEDIATE' | 'DAILY' | 'WEEKLY';

export type NotificationPreference = {
	id?: string;
	userId?: string;
	emailEnabled: boolean;
	emailFrequency: EmailFrequency;
	emailDigestDay: string | null;
	emailDigestTime: string | null;
	createdAt?: Date;
	updatedAt?: Date;
};

export interface NotificationSettingsFormProps {
	preferences: NotificationPreference | null;
}

const DAYS_OF_WEEK = [
	'MONDAY',
	'TUESDAY',
	'WEDNESDAY',
	'THURSDAY',
	'FRIDAY',
	'SATURDAY',
	'SUNDAY',
] as const;

const DEFAULT_PREFERENCES: NotificationPreference = {
	emailEnabled: true,
	emailFrequency: 'IMMEDIATE',
	emailDigestDay: null,
	emailDigestTime: null,
};

export default function NotificationSettingsForm({
	preferences,
}: NotificationSettingsFormProps) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState<NotificationPreference>(
		preferences || DEFAULT_PREFERENCES
	);
	const t = useTranslation();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const response = await fetch('/api/user/notification-preferences', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || t.notificationSettings.messages.error);
			}

			toast.success(t.notificationSettings.messages.success);
			router.refresh();
		} catch (error) {
			console.error('Error saving preferences:', error);
			toast.error(
				error instanceof Error ? error.message : t.notificationSettings.messages.error
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-8'>
			{/* Email Toggle Section */}
			<div className='rounded-lg bg-gray-50 p-6 dark:bg-gray-800/50'>
				<div className='flex items-center justify-between'>
					<div className='flex-grow'>
						<h3 className='text-base font-medium text-gray-900 dark:text-white'>
							{t.notificationSettings.emailNotifications.title}
						</h3>
						<p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
							{t.notificationSettings.emailNotifications.description}
						</p>
					</div>
					<Switch
						checked={formData.emailEnabled}
						onCheckedChange={(checked: boolean) =>
							setFormData({
								...formData,
								emailEnabled: checked,
							})
						}
						className={`${
							formData.emailEnabled
								? 'bg-primary'
								: 'bg-gray-200 dark:bg-gray-700'
						} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
					>
						<span
							className={`${
								formData.emailEnabled ? 'translate-x-6' : 'translate-x-1'
							} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
						/>
					</Switch>
				</div>
			</div>

			{formData.emailEnabled && (
				<div className='space-y-8'>
					{/* Frequency Selection */}
					<div className='rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800/30'>
						<label htmlFor='frequency' className='block'>
							<div className='mb-4 flex items-center space-x-2'>
								<ClockIcon
									className='h-5 w-5 text-gray-400'
									aria-hidden='true'
								/>
								<span className='text-base font-medium text-gray-900 dark:text-white'>
									{t.notificationSettings.frequency.title}
								</span>
							</div>
							<select
								id='frequency'
								value={formData.emailFrequency}
								onChange={(e) =>
									setFormData({
										...formData,
										emailFrequency: e.target.value as EmailFrequency,
										emailDigestDay:
											e.target.value === 'WEEKLY'
												? formData.emailDigestDay || 'MONDAY'
												: null,
										emailDigestTime:
											e.target.value !== 'IMMEDIATE'
												? formData.emailDigestTime || '09:00'
												: null,
									})
								}
								className='mt-1 block w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm'
							>
								<option value='IMMEDIATE'>{t.notificationSettings.frequency.immediate}</option>
								<option value='DAILY'>{t.notificationSettings.frequency.daily}</option>
								<option value='WEEKLY'>{t.notificationSettings.frequency.weekly}</option>
							</select>
						</label>

						{/* Digest Time Selection */}
						{formData.emailFrequency !== 'IMMEDIATE' && (
							<div className='mt-6'>
								<div className='mb-4 flex items-center space-x-2'>
									<CalendarDaysIcon
										className='h-5 w-5 text-gray-400'
										aria-hidden='true'
									/>
									<span className='text-base font-medium text-gray-900 dark:text-white'>
										{t.notificationSettings.deliveryTime.title}
									</span>
								</div>

								<div className='flex space-x-4'>
									{formData.emailFrequency === 'WEEKLY' && (
										<select
											value={formData.emailDigestDay || 'MONDAY'}
											onChange={(e) =>
												setFormData({
													...formData,
													emailDigestDay: e.target.value,
												})
											}
											className='block w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm'
										>
											{DAYS_OF_WEEK.map((day) => (
												<option key={day} value={day}>
													{t.notificationSettings.deliveryTime.days[day]}
												</option>
											))}
										</select>
									)}

									<input
										type='time'
										value={formData.emailDigestTime || '09:00'}
										onChange={(e) =>
											setFormData({
												...formData,
												emailDigestTime: e.target.value,
											})
										}
										className='block w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm'
									/>
								</div>
							</div>
						)}
					</div>
				</div>
			)}

			<Button type='submit' disabled={loading} className='w-full'>
				{loading ? t.notificationSettings.buttons.saving : t.notificationSettings.buttons.save}
			</Button>
		</form>
	);
}
