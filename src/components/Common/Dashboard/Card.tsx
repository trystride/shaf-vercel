import { ReactNode } from 'react';

export default function Card({ children }: { children: ReactNode }) {
	return (
		<div className='rounded-lg bg-gray-50/50 p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700/50'>
			{children}
		</div>
	);
}
