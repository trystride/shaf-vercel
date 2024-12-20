import { useEffect, useRef, useState } from 'react';
import ModalCloseButton from './ModalCloseButton';
import Loader from '../Loader';
import InputGroup from '../Dashboard/InputGroup';
import InputSelect from '../InputSelect';
import FormButton from '../Dashboard/FormButton';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function InviteUserModal(props: any) {
	const { showModal, setShowModal, text } = props;
	const [data, setData] = useState({
		email: '',
		role: '',
	});

	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setLoading(true);
		if (!data.email || !data.role) {
			setLoading(false);
			return toast.error('Please fill in all fields!');
		}

		try {
			const invite = await axios.post('/api/user/invite/send', data);
			toast.success(invite.data);
			setLoading(false);
		} catch (error: any) {
			toast.error(error?.response.data);
			setLoading(false);
		}

		setShowModal(false);
	};

	// ===== click outside of dropdown =====
	const divRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const handleClickOutside = (event: MouseEvent) => {
				if (divRef.current && !divRef.current.contains(event.target as Node)) {
					setShowModal(false);
				}
			};

			document.addEventListener('mousedown', handleClickOutside);
			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
			};
		}
	});
	return (
		<>
			{showModal && (
				<div
					className={`fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-black/50 px-4 backdrop-blur-sm dark:bg-dark/50 sm:px-6`}
				>
					<div
						ref={divRef}
						className='relative w-full max-w-[480px] scale-100 transform overflow-hidden rounded-xl bg-white shadow-lg transition-all dark:bg-black'
					>
						<ModalCloseButton closeModal={setShowModal} />

						<div className='p-6 sm:p-8'>
							<h3 className='mb-6 font-satoshi text-2xl font-bold tracking-tight text-dark dark:text-white'>
								Add New User
							</h3>

							<form className='flex flex-col gap-6' onSubmit={handleSubmit}>
								<InputGroup
									label='User Email'
									type='email'
									name='email'
									value={data.email}
									placeholder={'jhon@gmail.com'}
									required={true}
									handleChange={(e: any) =>
										setData({ ...data, email: e.target.value })
									}
								/>
								<InputSelect
									name='role'
									label='Select User Role'
									options={[
										{
											label: 'User',
											value: 'USER',
										},
										{
											label: 'Admin',
											value: 'ADMIN',
										},
									]}
									placeholder='Select Role'
									value={data.role}
									required={true}
									onChange={(e: any) =>
										setData({ ...data, role: e.target.value })
									}
								/>
								<FormButton>
									{!loading ? (
										<>{text}</>
									) : (
										<>
											{text}
											<Loader style='border-white dark:border-white' />
										</>
									)}
								</FormButton>
							</form>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
