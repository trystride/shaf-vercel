'use client';
import { useState } from 'react';
import Sidebar from '@/components/Common/Dashboard/Sidebar';
import Header from '@/components/Common/Dashboard/Header';
import { userSidebarData } from '@/staticData/sidebarData';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
	const [openSidebar, setOpenSidebar] = useState(false);

	return (
		<>
			<main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
				<aside
					className={`fixed left-0 top-0 z-50 h-screen w-[290px] overflow-y-auto bg-white duration-300 dark:bg-gray-800 ${
						openSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
					}`}
				>
					<Sidebar sidebarData={userSidebarData} />
				</aside>
				<div
					onClick={() => setOpenSidebar(false)}
					className={`fixed inset-0 z-40 h-screen w-full bg-dark/80 lg:hidden ${
						openSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
					}`}
				></div>
				<section className='relative lg:ml-[290px]'>
					<Header openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
					<div className='p-5 pt-8 md:p-10'>{children}</div>
				</section>
			</main>
		</>
	);
};

export default AdminLayout;
