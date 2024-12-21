'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import InviteUserModal from '@/components/Common/Modals/InviteUserModal';

const filterData = [
	{
		id: 1,
		title: 'all users',
		value: 'all',
		icon: (
			<svg
				width='20'
				height='20'
				viewBox='0 0 20 20'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M10 1.04163C7.8139 1.04163 6.0417 2.81383 6.0417 4.99996C6.0417 7.18609 7.8139 8.95829 10 8.95829C12.1862 8.95829 13.9584 7.18609 13.9584 4.99996C13.9584 2.81383 12.1862 1.04163 10 1.04163ZM7.2917 4.99996C7.2917 3.50419 8.50426 2.29163 10 2.29163C11.4958 2.29163 12.7084 3.50419 12.7084 4.99996C12.7084 6.49573 11.4958 7.70829 10 7.70829C8.50426 7.70829 7.2917 6.49573 7.2917 4.99996Z'
					fill='currentColor'
				/>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M10 10.2083C8.07207 10.2083 6.2958 10.6465 4.97957 11.3869C3.68293 12.1163 2.70836 13.2217 2.70836 14.5833L2.70831 14.6683C2.70737 15.6365 2.70619 16.8516 3.77204 17.7196C4.2966 18.1467 5.03043 18.4505 6.02187 18.6512C7.01608 18.8524 8.31188 18.9583 10 18.9583C11.6882 18.9583 12.984 18.8524 13.9782 18.6512C14.9696 18.4505 15.7035 18.1467 16.228 17.7196C17.2939 16.8516 17.2927 15.6365 17.2917 14.6683L17.2917 14.5833C17.2917 13.2217 16.3171 12.1163 15.0205 11.3869C13.7043 10.6465 11.928 10.2083 10 10.2083ZM3.95836 14.5833C3.95836 13.8738 4.47618 13.1043 5.5924 12.4764C6.68903 11.8595 8.24609 11.4583 10 11.4583C11.754 11.4583 13.311 11.8595 14.4077 12.4764C15.5239 13.1043 16.0417 13.8738 16.0417 14.5833C16.0417 15.6731 16.0081 16.2866 15.4387 16.7503C15.1299 17.0018 14.6138 17.2472 13.7302 17.426C12.8494 17.6043 11.6452 17.7083 10 17.7083C8.35484 17.7083 7.15065 17.6043 6.26986 17.426C5.3863 17.2472 4.87013 17.0018 4.56135 16.7503C3.99196 16.2866 3.95836 15.6731 3.95836 14.5833Z'
					fill='currentColor'
				/>
			</svg>
		),
	},
	{
		id: 2,
		title: 'User',
		value: 'USER',
		icon: (
			<svg
				width='20'
				height='20'
				viewBox='0 0 20 20'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M9.95227 1.04163L11.2501 1.04163C11.5953 1.04163 11.8751 1.32145 11.8751 1.66663C11.8751 2.0118 11.5953 2.29163 11.2501 2.29163H10.0001C8.01823 2.29163 6.59471 2.29295 5.5114 2.4386C4.44606 2.58183 3.80379 2.85424 3.32908 3.32896C2.85436 3.80367 2.58195 4.44594 2.43872 5.51127C2.29308 6.59459 2.29175 8.01811 2.29175 9.99996C2.29175 11.9818 2.29308 13.4053 2.43872 14.4886C2.58195 15.554 2.85436 16.1962 3.32908 16.671C3.80379 17.1457 4.44606 17.4181 5.5114 17.5613C6.59471 17.707 8.01823 17.7083 10.0001 17.7083C11.9819 17.7083 13.4055 17.707 14.4888 17.5613C15.5541 17.4181 16.1964 17.1457 16.6711 16.671C17.1458 16.1962 17.4182 15.554 17.5614 14.4886C17.7071 13.4053 17.7084 11.9818 17.7084 9.99996V8.74996C17.7084 8.40478 17.9882 8.12496 18.3334 8.12496C18.6786 8.12496 18.9584 8.40478 18.9584 8.74996V10.0478C18.9584 11.9714 18.9584 13.479 18.8003 14.6552C18.6384 15.8592 18.3006 16.8092 17.555 17.5548C16.8093 18.3005 15.8593 18.6383 14.6553 18.8002C13.4791 18.9583 11.9716 18.9583 10.0479 18.9583H9.95227C8.02861 18.9583 6.52108 18.9583 5.34484 18.8002C4.14089 18.6383 3.19087 18.3005 2.4452 17.5548C1.69952 16.8092 1.36174 15.8592 1.19987 14.6552C1.04173 13.479 1.04174 11.9714 1.04175 10.0478V9.95214C1.04174 8.02848 1.04173 6.52095 1.19987 5.34471C1.36174 4.14077 1.69952 3.19075 2.4452 2.44507C3.19087 1.6994 4.14089 1.36161 5.34484 1.19975C6.52107 1.04161 8.0286 1.04162 9.95227 1.04163ZM13.9755 1.89656C15.1154 0.75665 16.9636 0.75665 18.1035 1.89656C19.2434 3.03646 19.2434 4.88461 18.1035 6.02452L12.5634 11.5646C12.254 11.874 12.0602 12.0679 11.8439 12.2366C11.5892 12.4353 11.3135 12.6056 11.0219 12.7446C10.7743 12.8626 10.5142 12.9493 10.0991 13.0876L7.67863 13.8945C7.23176 14.0434 6.73908 13.9271 6.40601 13.594C6.07293 13.261 5.95663 12.7683 6.10558 12.3214L6.91239 9.90098C7.05074 9.48584 7.1374 9.22579 7.25541 8.97817C7.3944 8.68652 7.56476 8.41089 7.76345 8.15614C7.93216 7.93985 8.126 7.74603 8.43545 7.43662L13.9755 1.89656ZM17.2196 2.78044C16.5679 2.12869 15.5112 2.12869 14.8594 2.78044L14.5456 3.09429C14.5645 3.17417 14.5909 3.26935 14.6278 3.37551C14.7472 3.71973 14.9732 4.17305 15.4001 4.59995C15.827 5.02685 16.2803 5.25285 16.6245 5.37227C16.7307 5.4091 16.8259 5.43557 16.9058 5.45448L17.2196 5.14063C17.8714 4.48888 17.8714 3.43219 17.2196 2.78044ZM15.921 6.4392C15.4911 6.25429 14.9902 5.95784 14.5162 5.48384C14.0422 5.00983 13.7458 4.50898 13.5608 4.07901L9.348 8.29184C9.00091 8.63894 8.86478 8.77659 8.74909 8.92492C8.60623 9.10808 8.48375 9.30625 8.38382 9.51594C8.30289 9.68576 8.24064 9.86907 8.08542 10.3347L7.72551 11.4145L8.58555 12.2745L9.66529 11.9146C10.131 11.7594 10.3143 11.6972 10.4841 11.6162C10.6938 11.5163 10.892 11.3938 11.0751 11.2509C11.2235 11.1353 11.3611 10.9991 11.7082 10.652L15.921 6.4392Z'
					fill='currentColor'
				/>
			</svg>
		),
	},
	{
		id: 3,
		title: 'Admin',
		value: 'ADMIN',
		icon: (
			<svg
				width='20'
				height='20'
				viewBox='0 0 20 20'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M8.82808 1.93232C9.56926 1.57806 10.4309 1.57806 11.1721 1.93232C11.4941 2.08622 11.7891 2.33789 12.1977 2.68635C12.2189 2.70444 12.2404 2.72279 12.2622 2.7414C12.4606 2.91048 12.5231 2.96246 12.5863 3.00484C12.7471 3.11262 12.9277 3.18742 13.1176 3.22492C13.1923 3.23966 13.2732 3.24708 13.5331 3.26782C13.5617 3.2701 13.5899 3.27233 13.6177 3.27454C14.1529 3.31701 14.5395 3.34769 14.876 3.46655C15.6506 3.74014 16.2599 4.34942 16.5335 5.124C16.6524 5.46051 16.683 5.8471 16.7255 6.38238C16.7277 6.41016 16.7299 6.43835 16.7322 6.46695C16.753 6.72679 16.7604 6.80774 16.7751 6.88241C16.8126 7.07233 16.8874 7.25292 16.9952 7.41372C17.0376 7.47695 17.0896 7.53943 17.2586 7.73783C17.2773 7.75968 17.2956 7.78119 17.3137 7.8024C17.6622 8.21093 17.9138 8.50597 18.0677 8.82796C18.422 9.56914 18.422 10.4308 18.0677 11.172C17.9138 11.4939 17.6622 11.789 17.3137 12.1975C17.2956 12.2187 17.2773 12.2402 17.2586 12.2621C17.0896 12.4605 17.0376 12.523 16.9952 12.5862C16.8874 12.747 16.8126 12.9276 16.7751 13.1175C16.7604 13.1922 16.753 13.2731 16.7322 13.533C16.7299 13.5616 16.7277 13.5898 16.7255 13.6175C16.683 14.1528 16.6524 14.5394 16.5335 14.8759C16.2599 15.6505 15.6506 16.2598 14.876 16.5334C14.5395 16.6522 14.1529 16.6829 13.6177 16.7254C13.5899 16.7276 13.5617 16.7298 13.5331 16.7321C13.2732 16.7528 13.1923 16.7603 13.1176 16.775C12.9277 16.8125 12.7471 16.8873 12.5863 16.9951C12.5231 17.0375 12.4606 17.0894 12.2622 17.2585C12.2404 17.2771 12.2189 17.2955 12.1976 17.3136C11.7891 17.662 11.4941 17.9137 11.1721 18.0676C10.4309 18.4219 9.56926 18.4219 8.82808 18.0676C8.50609 17.9137 8.21104 17.662 7.8025 17.3136C7.7813 17.2955 7.75979 17.2771 7.73795 17.2585C7.53955 17.0894 7.47707 17.0375 7.41385 16.9951C7.25304 16.8873 7.07245 16.8125 6.88253 16.775C6.80786 16.7603 6.72692 16.7528 6.46707 16.7321C6.43847 16.7298 6.41029 16.7276 6.3825 16.7254C5.84722 16.6829 5.46064 16.6522 5.12413 16.5334C4.34954 16.2598 3.74026 15.6505 3.46667 14.8759C3.34781 14.5394 3.31714 14.1528 3.27466 13.6175C3.27246 13.5898 3.27022 13.5616 3.26794 13.533C3.2472 13.2731 3.23978 13.1922 3.22504 13.1175C3.18754 12.9276 3.11274 12.747 3.00496 12.5862C2.96258 12.523 2.9106 12.4605 2.74152 12.2621C2.72291 12.2403 2.70456 12.2187 2.68648 12.1975C2.33801 11.789 2.08634 11.494 1.93244 11.172C1.57818 10.4308 1.57818 9.56914 1.93244 8.82796C2.08634 8.50597 2.33801 8.21092 2.68647 7.80239C2.70456 7.78118 2.72291 7.75967 2.74152 7.73783C2.9106 7.53943 2.96258 7.47695 3.00496 7.41372C3.11274 7.25292 3.18754 7.07233 3.22504 6.88241C3.23978 6.80774 3.2472 6.7268 3.26794 6.46695C3.27022 6.43835 3.27246 6.41016 3.27466 6.38238C3.31714 5.8471 3.34781 5.46051 3.46667 5.12401C3.74026 4.34942 4.34954 3.74014 5.12413 3.46655C5.46064 3.34769 5.84722 3.31701 6.3825 3.27454C6.41029 3.27233 6.43847 3.2701 6.46707 3.26782C6.72692 3.24708 6.80786 3.23966 6.88253 3.22492C7.07245 3.18742 7.25304 3.11262 7.41385 3.00484C7.47707 2.96246 7.53955 2.91048 7.73795 2.7414C7.75979 2.72279 7.7813 2.70444 7.80251 2.68635C8.21104 2.33789 8.50609 2.08622 8.82808 1.93232ZM10.6312 3.06404C10.2321 2.87328 9.7681 2.87328 9.36901 3.06404C9.21471 3.13779 9.05207 3.26956 8.55155 3.6961C8.54332 3.70311 8.53521 3.71002 8.52721 3.71684C8.36295 3.85688 8.24305 3.9591 8.11222 4.04679C7.81357 4.24695 7.47819 4.38588 7.12548 4.45551C6.97096 4.48602 6.81389 4.49852 6.59872 4.51565C6.58824 4.51648 6.57762 4.51733 6.56685 4.51819C5.91131 4.5705 5.70314 4.59233 5.54188 4.64928C5.1248 4.7966 4.79673 5.12467 4.64941 5.54176C4.59245 5.70301 4.57062 5.91119 4.51831 6.56673C4.51745 6.57749 4.5166 6.58812 4.51577 6.5986C4.49864 6.81377 4.48614 6.97084 4.45563 7.12536C4.386 7.47807 4.24708 7.81345 4.04691 8.11209C3.95922 8.24293 3.857 8.36283 3.71696 8.52709C3.71014 8.5351 3.70323 8.5432 3.69622 8.55142C3.26968 9.05195 3.13791 9.21459 3.06416 9.36888C2.87341 9.76798 2.87341 10.2319 3.06416 10.631C3.13791 10.7853 3.26968 10.948 3.69622 11.4485C3.70323 11.4567 3.71014 11.4648 3.71697 11.4728C3.857 11.6371 3.95922 11.757 4.04691 11.8878C4.24708 12.1865 4.386 12.5219 4.45563 12.8746C4.48614 13.0291 4.49864 13.1861 4.51577 13.4013C4.5166 13.4118 4.51745 13.4224 4.51831 13.4332C4.57062 14.0887 4.59245 14.2969 4.64941 14.4582C4.79673 14.8752 5.1248 15.2033 5.54188 15.3506C5.70314 15.4076 5.91131 15.4294 6.56685 15.4817L6.59872 15.4843C6.8139 15.5014 6.97096 15.5139 7.12548 15.5444C7.47819 15.614 7.81357 15.753 8.11221 15.9531C8.24305 16.0408 8.36295 16.143 8.52722 16.2831L8.55155 16.3038C9.05207 16.7304 9.21471 16.8621 9.36901 16.9359C9.7681 17.1266 10.2321 17.1266 10.6312 16.9359C10.7855 16.8621 10.9481 16.7304 11.4486 16.3038L11.473 16.2831C11.6372 16.143 11.7571 16.0408 11.888 15.9531C12.1866 15.753 12.522 15.614 12.8747 15.5444C13.0292 15.5139 13.1863 15.5014 13.4014 15.4843L13.4333 15.4817C14.0889 15.4294 14.297 15.4076 14.4583 15.3506C14.8754 15.2033 15.2034 14.8752 15.3508 14.4582C15.4077 14.2969 15.4295 14.0887 15.4819 13.4332L15.4844 13.4013C15.5015 13.1861 15.514 13.0291 15.5445 12.8746C15.6142 12.5219 15.7531 12.1865 15.9533 11.8878C16.0409 11.757 16.1432 11.6371 16.2832 11.4728L16.3039 11.4485C16.7305 10.948 16.8623 10.7853 16.936 10.631C17.1268 10.2319 17.1268 9.76798 16.936 9.36888C16.8623 9.21459 16.7305 9.05195 16.3039 8.55142L16.2832 8.52707C16.1432 8.36282 16.0409 8.24292 15.9533 8.11209C15.7531 7.81345 15.6142 7.47807 15.5445 7.12536C15.514 6.97084 15.5015 6.81377 15.4844 6.59859L15.4819 6.56673C15.4295 5.91119 15.4077 5.70301 15.3508 5.54176C15.2034 5.12467 14.8754 4.7966 14.4583 4.64928C14.297 4.59233 14.0889 4.5705 13.4333 4.51819C13.4225 4.51733 13.4119 4.51648 13.4014 4.51565C13.1863 4.49852 13.0292 4.48602 12.8747 4.45551C12.522 4.38588 12.1866 4.24695 11.8879 4.04679C11.7571 3.9591 11.6372 3.85688 11.4729 3.71684C11.4649 3.71002 11.4568 3.7031 11.4486 3.6961C10.9481 3.26956 10.7855 3.13779 10.6312 3.06404ZM13.3704 7.4659C13.6153 7.71083 13.6153 8.10793 13.3704 8.35286L9.18921 12.534C8.94429 12.7789 8.54718 12.7789 8.30226 12.534L6.62979 10.8616C6.38487 10.6166 6.38487 10.2195 6.62979 9.9746C6.87472 9.72967 7.27182 9.72967 7.51675 9.9746L8.74574 11.2036L12.4834 7.4659C12.7283 7.22098 13.1254 7.22098 13.3704 7.4659Z'
					fill='currentColor'
				/>
			</svg>
		),
	},
];

export default function UserTopbar() {
	const [filterValue, setFilterValue] = useState('all');
	const [search, setSearch] = useState('');
	const [showInviteUserModal, setShowInviteUserModal] = useState(false);
	const router = useRouter();

	// const handleInvite = () => {};

	return (
		<>
			<div className='items-center justify-between rounded-10 bg-white px-3.5 py-3 shadow-1 dark:bg-gray-dark md:flex'>
				<div className='mb-6 flex flex-wrap items-center gap-3 md:mb-0'>
					{filterData?.map((item) => (
						<button
							key={item?.id}
							onClick={() => {
								router.push(
									`/admin/manage-users?filter=${
										item?.value !== 'all' ? item?.value : undefined
									}`
								);
								setFilterValue(item?.value);
							}}
							className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border bg-gray-1 pl-3 pr-4 font-satoshi text-sm font-medium capitalize dark:bg-white/5 ${
								filterValue === item?.value
									? 'border-transparent text-primary shadow-input'
									: 'border-stroke text-body dark:border-stroke-dark dark:text-gray-5'
							}`}
						>
							{item?.icon}
							{item?.title}
						</button>
					))}
				</div>

				<div className='flex flex-wrap items-center gap-3'>
					<button
						onClick={() => setShowInviteUserModal(true)}
						className='flex  h-10 items-center justify-center gap-3 rounded-lg bg-primary p-3 text-white hover:bg-primary-dark'
					>
						<Image
							src='/images/icon/plus.svg'
							alt='plus'
							width={20}
							height={20}
						/>{' '}
						Add new user
					</button>

					{/* Search bar */}
					<form
						onSubmit={(e) => {
							e.preventDefault();
							router.push(`/admin/manage-users?search=${search}`);
						}}
					>
						<div className='relative'>
							<input
								type='search'
								placeholder='Search user'
								className='h-11 w-full rounded-lg border border-stroke bg-gray-1 pl-11 pr-4.5 outline-none ring-offset-1 duration-300 focus:shadow-input focus:ring-2 focus:ring-primary/20 dark:border-stroke-dark dark:bg-transparent dark:focus:border-transparent'
								onChange={(e: any) => setSearch(e.target.value)}
							/>

							<span className='absolute left-4.5 top-1/2 -translate-y-1/2 text-dark dark:text-white'>
								<svg
									width='18'
									height='18'
									viewBox='0 0 18 18'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<g clipPath='url(#clip0_2172_13260)'>
										<path
											fillRule='evenodd'
											clipRule='evenodd'
											d='M8.625 2.0625C5.00063 2.0625 2.0625 5.00063 2.0625 8.625C2.0625 12.2494 5.00063 15.1875 8.625 15.1875C12.2494 15.1875 15.1875 12.2494 15.1875 8.625C15.1875 5.00063 12.2494 2.0625 8.625 2.0625ZM0.9375 8.625C0.9375 4.37931 4.37931 0.9375 8.625 0.9375C12.8707 0.9375 16.3125 4.37931 16.3125 8.625C16.3125 10.5454 15.6083 12.3013 14.4441 13.6487L16.8977 16.1023C17.1174 16.3219 17.1174 16.6781 16.8977 16.8977C16.6781 17.1174 16.3219 17.1174 16.1023 16.8977L13.6487 14.4441C12.3013 15.6083 10.5454 16.3125 8.625 16.3125C4.37931 16.3125 0.9375 12.8707 0.9375 8.625Z'
											fill='currentColor'
										/>
									</g>
									<defs>
										<clipPath id='clip0_2172_13260'>
											<rect width='18' height='18' fill='white' />
										</clipPath>
									</defs>
								</svg>
							</span>
						</div>
					</form>
				</div>
			</div>

			{showInviteUserModal && (
				<InviteUserModal
					setShowModal={setShowInviteUserModal}
					showModal={showInviteUserModal}
					text={'Add User'}
					loading={false}
				/>
			)}
		</>
	);
}

// showModal, setShowModal, text, loading
