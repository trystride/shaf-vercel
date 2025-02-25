import { signIn } from 'next-auth/react';
import { integrations, messages } from '../../../integrations.config';
import toast from 'react-hot-toast';

export default function GithubSigninButton({ text }: { text: string }) {
	const handleSignin = () => {
		if (!integrations.isAuthEnabled) {
			return toast.error(messages.auth);
		}

		// Default to user dashboard, role will be assigned during OAuth callback
		signIn('github', { callbackUrl: '/user/dashboard/announcements' });
	};

	return (
		<button
			onClick={handleSignin}
			type='button'
			className='flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-stroke font-satoshi text-base font-medium text-dark duration-300 hover:bg-gray-1 dark:border-stroke-dark dark:text-white dark:hover:bg-white/5'
		>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				width='24'
				height='24'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				role='img'
				aria-labelledby='githubTitle'
			>
				<title id='githubTitle'>GitHub Logo</title>
				<path d='M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22' />
			</svg>
			{text} with Github
		</button>
	);
}
