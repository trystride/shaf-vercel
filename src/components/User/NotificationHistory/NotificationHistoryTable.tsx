'use client';

import { format } from 'date-fns';
import { useState } from 'react';

interface NotificationHistoryProps {
	notifications: Array<{
		id: string;
		type: string;
		status: string;
		subject: string;
		content: string;
		sentAt: Date;
		error?: string | null;
		matches: Array<{
			announcement: {
				title: string;
				description: string;
			};
			keyword: {
				term: string;
			};
		}>;
	}>;
}

export default function NotificationHistoryTable({
	notifications,
}: NotificationHistoryProps) {
	const [selectedNotification, setSelectedNotification] = useState<
		string | null
	>(null);

	const toggleDetails = (id: string) => {
		setSelectedNotification(selectedNotification === id ? null : id);
	};

	return (
		<div className='relative overflow-x-auto'>
			<table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
				<thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
					<tr>
						<th scope='col' className='px-6 py-3'>
							Date
						</th>
						<th scope='col' className='px-6 py-3'>
							Type
						</th>
						<th scope='col' className='px-6 py-3'>
							Subject
						</th>
						<th scope='col' className='px-6 py-3'>
							Status
						</th>
						<th scope='col' className='px-6 py-3'>
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{notifications.map((notification) => (
						<>
							<tr
								key={notification.id}
								className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
							>
								<td className='px-6 py-4'>
									{format(new Date(notification.sentAt), 'PPp')}
								</td>
								<td className='px-6 py-4'>{notification.type}</td>
								<td className='px-6 py-4'>{notification.subject}</td>
								<td className='px-6 py-4'>
									<span
										className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
											notification.status === 'SENT'
												? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
												: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
										}`}
									>
										{notification.status}
									</span>
								</td>
								<td className='px-6 py-4'>
									<button
										onClick={() => toggleDetails(notification.id)}
										className='font-medium text-primary hover:underline'
									>
										{selectedNotification === notification.id
											? 'Hide Details'
											: 'View Details'}
									</button>
								</td>
							</tr>
							{selectedNotification === notification.id && (
								<tr className='border-b bg-gray-50 dark:border-gray-700 dark:bg-gray-900'>
									<td colSpan={5} className='px-6 py-4'>
										<div className='space-y-4'>
											<div>
												<h4 className='mb-2 text-sm font-medium text-gray-900 dark:text-white'>
													Matched Announcements
												</h4>
												<div className='space-y-2'>
													{notification.matches.map((match, index) => (
														<div
															key={index}
															className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800'
														>
															<p className='mb-1 text-sm font-medium text-gray-900 dark:text-white'>
																{match.announcement.title}
															</p>
															<p className='text-sm text-gray-600 dark:text-gray-400'>
																{match.announcement.description}
															</p>
															<p className='mt-2 text-xs text-gray-500 dark:text-gray-500'>
																Matched keyword: {match.keyword.term}
															</p>
														</div>
													))}
												</div>
											</div>
											{notification.error && (
												<div className='mt-2 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-700 dark:bg-red-900'>
													<h4 className='mb-2 text-sm font-medium text-red-800 dark:text-red-300'>
														Error Details
													</h4>
													<p className='text-sm text-red-600 dark:text-red-400'>
														{notification.error}
													</p>
												</div>
											)}
										</div>
									</td>
								</tr>
							)}
						</>
					))}
				</tbody>
			</table>
		</div>
	);
}
