import AccountButton from './AccountButton';
import Notifications from './NotificationMenu/Notifications';
import ThemeToggler from './ThemeToggler';
import { useSession } from 'next-auth/react';
import { useTranslation } from '@/lib/useTranslation';
import { LanguageSwitcher } from '@/components/Common/LanguageSwitcher';

export default function Header({ openSidebar, setOpenSidebar }: any) {
	const { data: session } = useSession();
	const { t } = useTranslation();

	return (
		<div className='sticky top-0 z-50 flex items-center justify-between border-b border-stroke bg-white/95 px-5 py-5 backdrop-blur-sm dark:border-stroke-dark dark:bg-gray-dark/95 md:px-10'>
			<div onClick={() => setOpenSidebar(!openSidebar)} className='lg:hidden '>
				<span className='relative block h-5.5 w-5.5 cursor-pointer'>
					<span className='du-block absolute right-0 h-full w-full'>
						<span className='relative left-0 top-0 my-1 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white'></span>
						<span className='relative left-0 top-0 my-1 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white'></span>
						<span className='relative left-0 top-0 my-1 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white'></span>
					</span>
				</span>
			</div>
			<p className='hidden whitespace-nowrap font-satoshi text-xl font-medium capitalize text-dark dark:text-white lg:block'>
				{t('common.welcome', { name: session?.user?.name || '' })}
			</p>

			<div className='flex w-full items-center justify-end gap-4'>
				<LanguageSwitcher />
				<ThemeToggler />
				<Notifications role={session?.user?.role as string} />
				<AccountButton user={session?.user} />
			</div>
		</div>
	);
}
