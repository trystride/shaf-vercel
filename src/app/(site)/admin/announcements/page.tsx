import { db } from '@/libs/db';
import { formatDistanceToNow } from 'date-fns';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AnnouncementsAdminPage() {
	// Get total count and latest announcement
	const totalCount = await db.announcement.count();
	const latestAnnouncement = await db.announcement.findFirst({
		orderBy: { publishDate: 'desc' },
	});

	// Get count of announcements in the last 24 hours
	const last24HoursCount = await db.announcement.count({
		where: {
			publishDate: {
				gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
			},
		},
	});

	// Get total matches
	const totalMatches = await db.match.count();

	return (
		<div className='mx-auto max-w-4xl p-6'>
			<h1 className='mb-6 text-2xl font-bold'>Announcements Dashboard</h1>

			<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
				<div className='rounded-lg bg-white p-6 shadow'>
					<h2 className='mb-2 text-lg font-semibold'>Announcements Overview</h2>
					<dl className='space-y-2'>
						<div>
							<dt className='text-gray-600'>Total Announcements:</dt>
							<dd className='text-2xl font-bold'>{totalCount}</dd>
						</div>
						<div>
							<dt className='text-gray-600'>Last 24 Hours:</dt>
							<dd className='text-2xl font-bold'>{last24HoursCount}</dd>
						</div>
					</dl>
				</div>

				<div className='rounded-lg bg-white p-6 shadow'>
					<h2 className='mb-2 text-lg font-semibold'>Latest Activity</h2>
					<dl className='space-y-2'>
						<div>
							<dt className='text-gray-600'>Latest Announcement:</dt>
							<dd className='font-medium'>
								{latestAnnouncement ? (
									<>
										{formatDistanceToNow(latestAnnouncement.publishDate, {
											addSuffix: true,
										})}
										<p className='mt-1 text-sm text-gray-500'>
											{latestAnnouncement.title}
										</p>
									</>
								) : (
									'No announcements yet'
								)}
							</dd>
						</div>
						<div>
							<dt className='text-gray-600'>Total Matches:</dt>
							<dd className='text-2xl font-bold'>{totalMatches}</dd>
						</div>
					</dl>
				</div>
			</div>
		</div>
	);
}
