'use client';
import Card from '@/components/Common/Dashboard/Card';
import FormButton from '@/components/Common/Dashboard/FormButton';
import InputGroup from '@/components/Common/Dashboard/InputGroup';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useTranslation } from '@/app/context/TranslationContext';

export default function EditProfile() {
	const { data: session, update } = useSession();
	const t = useTranslation();
	const [data, setData] = useState({
		name: session?.user.name as string,
		email: '',
	});
	const [loading, setLoading] = useState(false);
	const isDemo = session?.user?.email?.includes('demo-');

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (isDemo) {
			toast.error(t.accountSettings.editProfile.messages.demoError);
			return;
		}

		try {
			setLoading(true);
			const res = await fetch('/api/user/update', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: data.name,
				}),
			});

			if (!res.ok) {
				throw new Error(t.accountSettings.editProfile.messages.updateError);
			}

			const result = await res.json();
			if (result.error) {
				toast.error(result.error);
				return;
			}

			await update({
				...session,
				user: {
					...session?.user,
					name: data.name,
				},
			});

			toast.success(t.accountSettings.editProfile.messages.updateSuccess);
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: t.accountSettings.editProfile.messages.updateError
			);
		} finally {
			setLoading(false);
		}
	};

	if (!session?.user) {
		return null;
	}

	return (
		<Card className='w-full xl:w-1/3'>
			<div className='border-b border-stroke py-4 px-7'>
				<h3 className='font-medium text-black'>
					{t.accountSettings.editProfile.title}
				</h3>
			</div>
			<div className='p-7'>
				<form onSubmit={handleSubmit}>
					<div className='mb-5.5'>
						<InputGroup
							label={t.accountSettings.editProfile.name}
							type='text'
							name='name'
							value={data.name}
							onChange={(e) => setData({ ...data, name: e.target.value })}
							required
						/>
					</div>
					<div className='mb-5.5'>
						<InputGroup
							label={t.accountSettings.editProfile.email}
							type='email'
							name='email'
							value={session?.user?.email || ''}
							readOnly
							disabled
						/>
					</div>
					<FormButton
						loading={loading}
						text={t.accountSettings.editProfile.updateProfile}
						loadingText={t.accountSettings.editProfile.updating}
					/>
				</form>
			</div>
		</Card>
	);
}
