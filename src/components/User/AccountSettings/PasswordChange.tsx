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
	// Create a safer way to access accountSettings translations
	const accountSettingsT = t.accountSettings || {};
	// Create a safer way to access passwordChange translations
	const passwordChangeT = accountSettingsT.passwordChange || {};
	// Create a safer way to access messages translations
	const messagesT = passwordChangeT.messages || {};
	
	const [data, setData] = useState({
		currentPassword: '',
		newPassword: '',
		reTypeNewPassword: '',
	});
	const [loading, setLoading] = useState(false);
	const { currentPassword, newPassword, reTypeNewPassword } = data;
	const { data: session } = useSession();
	
	// Helper function to safely access nested translation objects
	const getNestedTranslation = (obj: any, key: string, fallback: string): string => {
		if (obj && typeof obj === 'object' && key in obj) {
			const value = obj[key];
			if (typeof value === 'string') {
				return value;
			}
		}
		return fallback;
	};

	const handleChange = (e: any) => {
		setData({
			...data,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		if (newPassword !== reTypeNewPassword) {
			toast.error(getNestedTranslation(messagesT, 'passwordMismatch', 'Passwords do not match'));
			return;
		}

		setLoading(true);

		if (!session?.user) {
			toast.error(getNestedTranslation(messagesT, 'loginFirst', 'Please login first!'));
			return;
		}

		try {
			await axios.post('/api/user/change-password', {
				password: newPassword,
				currentPassword: currentPassword,
				email: session?.user?.email,
			});

			toast.success(getNestedTranslation(messagesT, 'success', 'Password changed successfully'));
			setData({
				currentPassword: '',
				newPassword: '',
				reTypeNewPassword: '',
			});
		} catch (error: any) {
			toast.error(
				error.response?.data || getNestedTranslation(messagesT, 'error', 'Failed to change password')
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className='w-full xl:w-1/3'>
			<div className='border-b border-stroke py-4 px-7'>
				<h3 className='font-medium text-black'>
					{getNestedTranslation(passwordChangeT, 'title', 'Change Password')}
				</h3>
			</div>
			<div className='p-7'>
				<form onSubmit={handleSubmit}>
					<div className='mb-5.5'>
						<InputGroup
							label={getNestedTranslation(passwordChangeT, 'currentPassword', 'Current Password')}
							type='password'
							name='currentPassword'
							value={currentPassword}
							onChange={handleChange}
							required
						/>
					</div>
					<div className='mb-5.5'>
						<InputGroup
							label={getNestedTranslation(passwordChangeT, 'newPassword', 'New Password')}
							type='password'
							name='newPassword'
							value={newPassword}
							onChange={handleChange}
							required
						/>
					</div>
					<div className='mb-5.5'>
						<InputGroup
							label={getNestedTranslation(passwordChangeT, 'reTypeNewPassword', 'Re-type New Password')}
							type='password'
							name='reTypeNewPassword'
							value={reTypeNewPassword}
							onChange={handleChange}
							required
						/>
					</div>
					<FormButton
						loading={loading}
						text={getNestedTranslation(passwordChangeT, 'changePassword', 'Change Password')}
						loadingText={getNestedTranslation(passwordChangeT, 'changing', 'Changing password...')}
					/>
				</form>
			</div>
		</Card>
	);
}
