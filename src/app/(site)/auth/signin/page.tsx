import React from 'react';
import Signin from '@/components/Auth/Signin';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: `Sign in - ${process.env.SITE_NAME || 'SaaS Bold'}`,
	description: `This is Sign in page for ${process.env.SITE_NAME || 'SaaS Bold'}`,
};

const SigninPage = () => {
	return (
		<main className='pt-[150px]'>
			<Signin />
		</main>
	);
};

export default SigninPage;
