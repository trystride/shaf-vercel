'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import logoLight from '@/../public/images/logo/logo-light.svg';
import logo from '@/../public/images/logo/logo.svg';
import { menuData } from './menuData';
import ThemeSwitcher from './ThemeSwitcher';
import Account from './Account';

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const { data: session } = useSession();
	const pathname = usePathname();

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const handleLinkClick = (
		e: React.MouseEvent<HTMLAnchorElement>,
		path: string
	) => {
		if (path?.startsWith('#')) {
			e.preventDefault();
			const element = document.querySelector(path);
			if (element) {
				const offsetTop =
					element.getBoundingClientRect().top + window.pageYOffset - 80;
				window.scrollTo({
					top: offsetTop,
					behavior: 'smooth',
				});
			}
			setIsOpen(false);
		}
	};

	return (
		<nav
			className={`fixed top-0 z-50 w-full transition-all duration-300 ${
				isScrolled
					? 'bg-white/80 shadow-sm backdrop-blur-lg dark:bg-gray-900/80'
					: 'bg-transparent'
			}`}
		>
			<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
				<div className='flex h-20 items-center justify-between'>
					{/* Logo */}
					<div className='flex-shrink-0'>
						<Link href='/' className='flex items-center'>
							<Image
								src={logo}
								alt='Logo'
								className='block h-10 w-auto dark:hidden'
								width={180}
								height={40}
								priority
							/>
							<Image
								src={logoLight}
								alt='Logo'
								className='hidden h-10 w-auto dark:block'
								width={180}
								height={40}
								priority
							/>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<div className='hidden md:flex md:items-center md:space-x-6'>
						{menuData.map((item) => (
							<Link
								key={item.id}
								href={item.path || '#'}
								onClick={(e) => handleLinkClick(e, item.path || '#')}
								className={`relative text-sm font-medium transition-colors hover:text-primary ${
									pathname === item.path
										? "text-primary after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-primary after:content-[''] dark:text-white"
										: 'text-gray-700 dark:text-gray-200'
								}`}
							>
								{item.title}
							</Link>
						))}
					</div>

					{/* Right side items */}
					<div className='hidden md:flex md:items-center md:space-x-4'>
						<ThemeSwitcher />
						{session?.user ? (
							<Account navbarOpen={isOpen} />
						) : (
							<div className='flex items-center space-x-4'>
								<Link
									href='/auth/signin'
									className='text-sm font-medium text-gray-700 transition-colors hover:text-primary dark:text-gray-200'
								>
									Sign in
								</Link>
								<Link
									href='/auth/signup'
									className='rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25'
								>
									Get Started
								</Link>
							</div>
						)}
					</div>

					{/* Mobile menu button */}
					<div className='flex md:hidden'>
						<button
							onClick={() => setIsOpen(!isOpen)}
							className='inline-flex items-center justify-center rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:text-gray-200 dark:hover:bg-gray-800'
						>
							<span className='sr-only'>Open main menu</span>
							{isOpen ? (
								<X className='block h-5 w-5' aria-hidden='true' />
							) : (
								<Menu className='block h-5 w-5' aria-hidden='true' />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			<div
				className={`transform overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
					isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
				}`}
			>
				<div className='space-y-1 bg-white px-4 pb-3 pt-2 shadow-lg dark:bg-gray-900'>
					{menuData.map((item) => (
						<Link
							key={item.id}
							href={item.path || '#'}
							onClick={(e) => {
								handleLinkClick(e, item.path || '#');
								setIsOpen(false);
							}}
							className={`block rounded-lg px-3 py-2 text-base font-medium transition-colors hover:bg-gray-50 hover:text-primary dark:hover:bg-gray-800 ${
								pathname === item.path
									? 'text-primary dark:text-white'
									: 'text-gray-700 dark:text-gray-200'
							}`}
						>
							{item.title}
						</Link>
					))}
					{!session?.user && (
						<div className='mt-4 space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700'>
							<Link
								href='/auth/signin'
								className='block rounded-lg px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-primary dark:text-gray-200 dark:hover:bg-gray-800'
								onClick={() => setIsOpen(false)}
							>
								Sign in
							</Link>
							<Link
								href='/auth/signup'
								className='block rounded-lg bg-primary px-3 py-2 text-base font-medium text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25'
								onClick={() => setIsOpen(false)}
							>
								Get Started
							</Link>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
