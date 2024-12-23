'use client';
import { useState } from 'react';
import Link from 'next/link';
import FormButton from '../Common/Dashboard/FormButton';
import InputGroup from '../Common/Dashboard/InputGroup';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loader from '../Common/Loader';
import { integrations, messages } from '../../../integrations.config';

export default function SigninWithPassword() {
	const [data, setData] = useState({
		email: '',
		password: '',
		remember: false,
	});

	const [loading, setLoading] = useState(false);

	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setData({
			...data,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!integrations.isAuthEnabled) {
			return toast.error(messages.auth);
		}

		if (!data.email) {
			return toast.error('Please enter your email address.');
		}

		setLoading(true);

		signIn('credentials', { ...data, redirect: false }).then((callback) => {
			if (callback?.error) {
				toast.error(callback.error);
				setLoading(false);
			}

			if (callback?.ok && !callback?.error) {
				// Get the user's role from the session
				fetch('/api/auth/session')
					.then((res) => res.json())
					.then((session) => {
						toast.success('Logged in successfully');
						setLoading(false);
						setData({ email: '', password: '', remember: false });

						// Redirect based on role
						if (session?.user?.role === 'ADMIN') {
							router.push('/admin');
						} else {
							router.push('/user/dashboard/announcements');
						}
					});
			}
		});
	};

	return (
		<form className='mb-5 space-y-4' onSubmit={handleSubmit}>
			<InputGroup
				label='Email'
				placeholder='Enter your email'
				type='email'
				name='email'
				required
				height='50px'
				handleChange={handleChange}
				value={data.email}
			/>

			<InputGroup
				label='Password'
				placeholder='Enter your password'
				type='password'
				name='password'
				required
				height='50px'
				handleChange={handleChange}
				value={data.password}
			/>

			<div className='flex items-center justify-between gap-2 py-2'>
				<label
					htmlFor='remember'
					className='flex cursor-pointer select-none items-center font-satoshi text-base font-medium text-dark dark:text-white'
				>
					<input
						type='checkbox'
						name='remember'
						id='remember'
						className='peer sr-only'
						onChange={(e) =>
							setData({
								...data,
								remember: e.target.checked,
							})
						}
					/>
					<span
						className={`mr-2.5 inline-flex h-5.5 w-5.5 items-center justify-center rounded-md border border-stroke bg-white text-white text-opacity-0 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-opacity-100 dark:border-stroke-dark dark:bg-white/5 ${
							data.remember ? 'bg-primary' : ''
						}`}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							role='img'
							aria-labelledby='emailTitle'
						>
							<title id='emailTitle'>Email Icon</title>
							<path
								d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
							/>
						</svg>
					</span>
					Remember me
				</label>

				<Link
					href='/auth/forgot-password'
					className='select-none font-satoshi text-base font-medium text-dark duration-300 hover:text-primary dark:text-white dark:hover:text-primary'
				>
					Forgot Password?
				</Link>
			</div>

			<FormButton height='50px'>
				Sign In {loading && <Loader style='dark:border-primary border-white' />}
			</FormButton>
		</form>
	);
}
