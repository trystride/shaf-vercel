import { User } from '@prisma/client';
import UserAction from './UserAction';
// import axios from "axios";

export default function UserListTable({ users }: { users: User[] }) {
	return (
		<>
			<div className='rounded-10 shadow-1 bg-white dark:bg-gray-dark'>
				<table className='w-full'>
					<thead>
						<tr className='lsm:table-row hidden border-b border-stroke dark:border-stroke-dark'>
							<th className='min-w-[150px] px-4 py-5 text-left font-satoshi text-base font-medium tracking-[-.2px] text-body dark:text-gray-5 sm:pl-7.5'>
								Name
							</th>
							<th className='hidden px-4 py-5 text-left font-satoshi text-base font-medium tracking-[-.2px] text-body dark:text-gray-5 xl:table-cell'>
								Email
							</th>
							<th className='hidden px-4 py-5 text-left font-satoshi text-base font-medium tracking-[-.2px] text-body dark:text-gray-5 xl:table-cell'>
								Role
							</th>
							<th className='hidden px-4 py-5 text-left font-satoshi text-base font-medium tracking-[-.2px] text-body dark:text-gray-5 md:table-cell'>
								Registered on
							</th>
							<th className='lsm:table-cell hidden px-4 py-5 text-right font-satoshi text-base font-medium tracking-[-.2px] text-body dark:text-gray-5 sm:pr-7.5'>
								Action
							</th>
						</tr>
					</thead>

					<tbody>
						{users?.map((user) => (
							<tr
								key={user?.id}
								className='border-b border-stroke last-of-type:border-b-0 dark:border-stroke-dark'
							>
								<td className='p-4 text-left text-base tracking-[-.16px] text-body dark:text-gray-5 sm:pl-7.5'>
									{user?.name}

									{/* <span className='block xl:hidden'>Name: {user?.name}</span> */}

									<span className='block xl:hidden'>Email: {user?.email}</span>

									<span className='block xl:hidden'>
										Role:{' '}
										{user?.role &&
											user.role.charAt(0).toUpperCase() +
												user.role.slice(1).toLowerCase()}
									</span>

									<span className='block md:hidden'>
										Register Date: {user?.createdAt?.toLocaleDateString()}
									</span>

									<span className='lsm:hidden block'>
										<UserAction user={user} />
									</span>
								</td>

								<td className='hidden p-4 text-left text-base tracking-[-.16px] text-body dark:text-gray-5 xl:table-cell'>
									{user?.email}
								</td>
								<td className='hidden p-4 text-left text-base tracking-[-.16px] text-body dark:text-gray-5 xl:table-cell'>
									{user?.role &&
										user.role.charAt(0).toUpperCase() +
											user.role.slice(1).toLowerCase()}
								</td>
								<td className='hidden p-4 text-left text-base tracking-[-.16px] text-body dark:text-gray-5 md:table-cell'>
									{user?.createdAt?.toLocaleDateString()}
								</td>
								<td className='lsm:table-cell hidden p-4 text-right text-base tracking-[-.16px] text-body dark:text-gray-5 sm:pr-7.5'>
									<UserAction user={user} />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
}
