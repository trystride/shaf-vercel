import { ReactNode } from "react";

export default function Card({ children }: { children: ReactNode }) {
	return (
		<div className='rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800'>
			{children}
		</div>
	);
}
