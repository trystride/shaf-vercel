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
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const { data: session } = useSession();

	const handleDelete = async () => {
		setLoading(true);
		try {
			await axios.delete('/api/user/delete', {
				data: {
					email: session?.user?.email,
				},
			});

			toast.success(t.accountSettings.deleteAccount.messages.success);
			setLoading(false);
			window.location.href = '/';
		} catch (error: any) {
			setLoading(false);
			toast.error(t.accountSettings.deleteAccount.messages.error);
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
					deleteText={t.accountSettings.deleteAccount.deleteButton}
					confirmText={t.accountSettings.deleteAccount.confirmDelete}
					handleDelete={handleDelete}
					loading={loading}
					loadingText={t.accountSettings.deleteAccount.deleting}
				/>
			</div>
			<div className='mt-10'>
				<div className='rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark'>
					<div className='border-b border-stroke py-4 dark:border-strokedark'>
						<h3 className='font-medium text-black dark:text-white'>
							{t.accountSettings.deleteAccount.title}
						</h3>
						<p className='mt-3 text-sm text-black dark:text-white'>
							{t.accountSettings.deleteAccount.description}
						</p>
						<p className='mt-3 text-sm text-meta-1'>
							{t.accountSettings.deleteAccount.warning}
						</p>
					</div>
					<div className='mt-5'>
						<button
							onClick={() => setShowDeleteModal(true)}
							className='flex justify-center rounded bg-danger py-2 px-6 font-medium text-white hover:shadow-1'
							type='submit'
						>
							{t.accountSettings.deleteAccount.deleteButton}
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default AccountSettings;
