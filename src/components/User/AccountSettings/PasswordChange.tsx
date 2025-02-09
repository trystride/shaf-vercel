'use client';
import Card from '@/components/Common/Dashboard/Card';
import FormButton from '@/components/Common/Dashboard/FormButton';
import InputGroup from '@/components/Common/Dashboard/InputGroup';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useTranslation } from '@/app/context/TranslationContext';
import Loader from '@/components/Common/Loader';

export default function PasswordChange() {
	const t = useTranslation();
	const [data, setData] = useState({
		currentPassword: '',
		newPassword: '',
		reTypeNewPassword: '',
	});
	const [loading, setLoading] = useState(false);
	const { currentPassword, newPassword, reTypeNewPassword } = data;
	const { data: session } = useSession();

	const handleChange = (e: any) => {
		setData({
			...data,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		if (newPassword !== reTypeNewPassword) {
			toast.error(t.accountSettings.passwordChange.messages.passwordMismatch);
			return;
		}

		setLoading(true);

		if (!session?.user) {
			toast.error(t.accountSettings.passwordChange.messages.loginFirst);
			return;
		}

		try {
			await axios.post('/api/user/change-password', {
				password: newPassword,
				currentPassword: currentPassword,
				email: session?.user?.email,
			});

			toast.success(t.accountSettings.passwordChange.messages.success);
			setData({
				currentPassword: '',
				newPassword: '',
				reTypeNewPassword: '',
			});
		} catch (error: any) {
			toast.error(
				error.response?.data || t.accountSettings.passwordChange.messages.error
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className='w-full xl:w-1/3'>
			<div className='border-b border-stroke py-4 px-7'>
				<h3 className='font-medium text-black'>
					{t.accountSettings.passwordChange.title}
				</h3>
			</div>
			<div className='p-7'>
				<form onSubmit={handleSubmit}>
					<div className='mb-5.5'>
						<InputGroup
							label={t.accountSettings.passwordChange.currentPassword}
							type='password'
							name='currentPassword'
							value={currentPassword}
							onChange={handleChange}
							required
						/>
					</div>
					<div className='mb-5.5'>
						<InputGroup
							label={t.accountSettings.passwordChange.newPassword}
							type='password'
							name='newPassword'
							value={newPassword}
							onChange={handleChange}
							required
						/>
					</div>
					<div className='mb-5.5'>
						<InputGroup
							label={t.accountSettings.passwordChange.reTypeNewPassword}
							type='password'
							name='reTypeNewPassword'
							value={reTypeNewPassword}
							onChange={handleChange}
							required
						/>
					</div>
					<FormButton
						loading={loading}
						text={t.accountSettings.passwordChange.changePassword}
						loadingText={t.accountSettings.passwordChange.changing}
					/>
				</form>
			</div>
		</Card>
	);
}
