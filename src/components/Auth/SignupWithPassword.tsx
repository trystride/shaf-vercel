import React, { useState } from 'react';
import FormButton from '@/components/Common/Dashboard/FormButton';
import InputGroup from '@/components/Common/Dashboard/InputGroup';
import toast from 'react-hot-toast';
import Loader from '../Common/Loader';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { integrations, messages } from '../../../integrations.config';
import logger from '@/lib/logger';

const SignupWithPassword = () => {
	const [data, setData] = useState({
		name: '',
		email: '',
		password: '',
	});

	const [loading, setLoading] = useState(false);
	const { name, email, password } = data;

	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setData({
			...data,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!integrations.isAuthEnabled) {
			return toast.error(messages.auth);
		}

		if (!name.trim() || !email || !password) {
			return toast.error('Please fill in all fields!');
		}

		setLoading(true);

		try {
			logger.info('Starting registration process for:', { name, email });

			const registrationUrl = '/api/user/register';
			logger.info('Making registration request to:', registrationUrl);

			const res = await fetch(registrationUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name,
					email,
					password,
				}),
			});

			const data = await res.json();

			logger.info('Registration API response:', {
				status: res.status,
				success: data.success,
				message: data.message,
				user: data.user,
			});

			if (data.success) {
				toast.success(data.message || 'Registration successful');

				// Wait a moment to ensure the user is created in the database
				await new Promise((resolve) => setTimeout(resolve, 1000));

				logger.info('Attempting signin for:', { email });

				const signInResult = await signIn('credentials', {
					email: email,
					password: password,
					redirect: false,
				});

				logger.info('SignIn result:', signInResult);

				if (signInResult?.error) {
					logger.error('SignIn error:', signInResult.error);
					toast.error(signInResult.error);
					setLoading(false);
				} else if (signInResult?.ok) {
					logger.info('SignIn successful, redirecting...');
					setData({
						name: '',
						email: '',
						password: '',
					});
					setLoading(false);

					// Get the user's role from the registration response
					const userRole = data.user.role;
					logger.info('User role:', userRole);

					// Redirect based on role
					if (userRole === 'ADMIN') {
						router.push('/admin');
					} else {
						router.push('/user/dashboard/announcements');
					}
				}
			} else {
				logger.error('Registration failed:', data);
				toast.error(data.error || 'Registration failed');
				setLoading(false);
			}
		} catch (error: any) {
			logger.error('Registration error:', {
				message: error.message,
				response: error.response,
				stack: error.stack,
			});

			const errorMessage =
				error.message || 'An error occurred during registration';
			toast.error(errorMessage);
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className='mb-5 space-y-4'>
				<InputGroup
					label='Name'
					placeholder='Enter your username'
					maxlength='10'
					type='text'
					name='name'
					required
					height='50px'
					handleChange={handleChange}
					value={name}
				/>

				<InputGroup
					label='Email'
					placeholder='Enter your email'
					type='email'
					name='email'
					required
					height='50px'
					handleChange={handleChange}
					value={email}
				/>

				<InputGroup
					label='Password'
					placeholder='Enter your password'
					type='password'
					name='password'
					required
					height='50px'
					handleChange={handleChange}
					value={password}
				/>

				<FormButton height='50px'>
					Sign Up {loading && <Loader style='border-white dark:border-dark' />}
				</FormButton>
			</div>
		</form>
	);
};

export default SignupWithPassword;
