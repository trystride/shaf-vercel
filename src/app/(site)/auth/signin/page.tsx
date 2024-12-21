import React from 'react';
import Signin from '@/components/Auth/Signin';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: `Sign in - ${process.env.SITE_NAME || 'Shaf Business Intelligence'}`,
	description: `Sign in to access your Business Intelligence dashboard`,
};

const SigninPage = () => {
	return (
		<main className='pt-[150px]'>
			<Signin />
		</main>
	);
};

export default SigninPage;
