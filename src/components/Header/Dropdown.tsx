import { Menu } from '@/types/menu';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const Dropdown = ({
	_stickyMenu,
	item,
	setNavbarOpen,
}: {
	_stickyMenu: boolean;
	item: Menu;
	setNavbarOpen: any;
}) => {
	const [dropdown, setDropdown] = useState(false);
	const pathname = usePathname();

	return (
		<div className='relative'>
			<button
				onClick={() => setDropdown(!dropdown)}
				className='flex w-full items-center justify-between gap-1.5 rounded-full px-[14px] py-[3px] font-satoshi font-medium text-dark group-hover:bg-primary/5 group-hover:text-primary dark:text-gray-5 dark:group-hover:bg-white/5 dark:group-hover:text-white'
			>
				Pages
				<svg
					className='group-hover:rotate-180'
					width='19'
					height='18'
					viewBox='0 0 19 18'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						fillRule='evenodd'
						clipRule='evenodd'
						d='M4.29314 6.38394C4.49532 6.14807 4.85042 6.12075 5.0863 6.32293L9.97022 10.5092L14.8542 6.32293C15.09 6.12075 15.4451 6.14807 15.6473 6.38394C15.8495 6.61981 15.8222 6.97492 15.5863 7.17709L10.3363 11.6771C10.1256 11.8576 9.8148 11.8576 9.60415 11.6771L4.35415 7.17709C4.11828 6.97492 4.09097 6.61981 4.29314 6.38394Z'
						fill='currentColor'
					/>
				</svg>
			</button>

			{/* <!-- Dropdown Start --> */}
			<div
				className={`absolute left-0 top-[120%] z-50 w-[200px] rounded-lg bg-white p-2 shadow-lg dark:bg-gray-dark ${
					dropdown ? 'block' : 'hidden'
				}`}
			>
				<ul className='flex flex-col gap-2'>
					{item?.submenu &&
						item?.submenu.map((item, i) => (
							<li key={i}>
								<Link
									onClick={() => {
										setDropdown(false);
										setNavbarOpen(false);
									}}
									href={item?.path}
									className={`block w-full rounded-[5px] px-4 py-2 text-dark transition-colors duration-200 hover:bg-primary hover:text-white dark:text-gray-5 dark:hover:text-white ${
										pathname === item?.path
											? 'bg-primary text-white dark:text-white'
											: ''
									}`}
								>
									{item?.title}
								</Link>
							</li>
						))}
				</ul>
			</div>
			{/* <!-- Dropdown End --> */}
		</div>
	);
};

export default Dropdown;
