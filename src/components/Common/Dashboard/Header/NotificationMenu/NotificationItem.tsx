import Link from 'next/link';

export default function Notification({ link }: any) {
	return (
		<div className='mb-3 flex cursor-pointer gap-5 rounded-md bg-white px-2 py-2 hover:bg-gray dark:bg-gray-dark dark:hover:bg-dark '>
			<div className='hidden h-10.5 w-10.5 items-center justify-center rounded-full bg-primary text-white md:flex'>
				<svg
					width='18'
					height='18'
					viewBox='0 0 20 20'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						d='M6.95983 16.8682C7.66073 17.7592 8.76182 18.3333 10 18.3333C11.2382 18.3333 12.3393 17.7592 13.0402 16.8682C11.022 17.1417 8.97798 17.1417 6.95983 16.8682Z'
						fill='currentColor'
					/>
					<path
						d='M15.6243 7.5V8.08675C15.6243 8.79091 15.8252 9.47931 16.2018 10.0652L17.1247 11.501C17.9676 12.8124 17.3241 14.5949 15.858 15.0096C12.0227 16.0945 7.97728 16.0945 4.14197 15.0096C2.67587 14.5949 2.03235 12.8124 2.8753 11.501L3.79816 10.0652C4.17476 9.47931 4.37573 8.79091 4.37573 8.08675V7.5C4.37573 4.27834 6.8938 1.66667 10 1.66667C13.1062 1.66667 15.6243 4.27834 15.6243 7.5Z'
						fill='currentColor'
					/>
				</svg>
			</div>
			<Link href={link} className=''>
				<h5 className='font-satoshi text-lg text-dark dark:text-white'>
					You just download latest version 2.20...
				</h5>
				<span className='text-sm font-medium text-body dark:text-gray-4'>
					5 min ago
				</span>
			</Link>
		</div>
	);
}
