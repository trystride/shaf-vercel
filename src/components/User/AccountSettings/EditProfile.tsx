'use client';
import Card from '@/components/Common/Dashboard/Card';
import FormButton from '@/components/Common/Dashboard/FormButton';
import InputGroup from '@/components/Common/Dashboard/InputGroup';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

export default function EditProfile() {
	const { data: session, update } = useSession();
	const [data, setData] = useState({
		name: session?.user.name as string,
		email: '',
	});
	const [loading, setLoading] = useState(false);
	const isDemo = session?.user?.email?.includes('demo-');

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (isDemo) {
			toast.error('Demo user cannot update profile');
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
				throw new Error('Failed to update profile');
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

			toast.success('Profile updated successfully');
		} catch (error) {
			toast.error('Something went wrong');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	if (!session?.user) {
		return null;
	}

	return (
		<Card>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<InputGroup
					label='Name'
					name='name'
					value={data.name}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setData({ ...data, name: e.target.value })
					}
					disabled={loading || isDemo}
				/>
				<FormButton
					type='submit'
					disabled={loading || isDemo}
					className='w-full'
				>
					{loading ? 'Updating...' : 'Update Profile'}
				</FormButton>
			</form>
		</Card>
	);
}
