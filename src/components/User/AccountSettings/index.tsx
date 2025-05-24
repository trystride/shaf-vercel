'use client';
import React, { useState } from 'react';
import EditProfile from './EditProfile';
import PasswordChange from './PasswordChange';
import DeleteAccount from './DeleteAccount';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import DeleteModal from '@/components/Common/Modals/DeleteModal';
import { useTranslation } from '@/app/context/TranslationContext';

const AccountSettings = () => {
	const t = useTranslation();
	// Create a safer way to access accountSettings translations
	const accountSettingsT = t.accountSettings || {};
	// Create a safer way to access deleteAccount translations
	const deleteAccountT = accountSettingsT.deleteAccount || {};
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [loading, setLoading] = useState(false);
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

	const handleDelete = async () => {
		setLoading(true);
		try {
			await axios.delete('/api/user/delete', {
				data: {
					email: session?.user?.email,
				},
			});

			toast.success(getNestedTranslation(deleteAccountT.messages || {}, 'success', 'Account deleted successfully'));
			setLoading(false);
			window.location.href = '/';
		} catch (error: any) {
			setLoading(false);
			toast.error(getNestedTranslation(deleteAccountT.messages || {}, 'error', 'Failed to delete account'));
		}

		setShowDeleteModal(false);
	};

	return (
		<>
			<div className='flex flex-col gap-y-10 lg:gap-x-10 xl:flex-row'>
				<EditProfile />
				<PasswordChange />

				<DeleteModal
					showDeleteModal={showDeleteModal}
					setShowDeleteModal={setShowDeleteModal}
					deleteText={getNestedTranslation(deleteAccountT, 'deleteButton', 'Delete Account')}
					confirmText={getNestedTranslation(deleteAccountT, 'confirmDelete', 'Are you sure you want to delete your account?')}
					handleDelete={handleDelete}
					loading={loading}
					loadingText={getNestedTranslation(deleteAccountT, 'deleting', 'Deleting account...')}
				/>
			</div>
			<div className='mt-10'>
				<div className='rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark'>
					<div className='border-b border-stroke py-4 dark:border-strokedark'>
						<h3 className='font-medium text-black dark:text-white'>
							{getNestedTranslation(deleteAccountT, 'title', 'Delete Account')}
						</h3>
						<p className='mt-3 text-sm text-black dark:text-white'>
							{getNestedTranslation(deleteAccountT, 'description', 'Permanently delete your account')}
						</p>
						<p className='mt-3 text-sm text-meta-1'>
							{getNestedTranslation(deleteAccountT, 'warning', 'This action cannot be undone')}
						</p>
					</div>
					<div className='mt-5'>
						<button
							onClick={() => setShowDeleteModal(true)}
							className='flex justify-center rounded bg-danger py-2 px-6 font-medium text-white hover:shadow-1'
							type='submit'
						>
							{getNestedTranslation(deleteAccountT, 'deleteButton', 'Delete Account')}
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default AccountSettings;
