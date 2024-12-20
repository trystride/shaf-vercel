import { NextResponse } from 'next/server';
import { db } from '@/libs/db';
import { matchAnnouncementsWithKeywords } from '@/libs/matchAnnouncements';

export const dynamic = 'force-dynamic';

export async function GET() {
	try {
		// Create a test keyword if none exists
		const testUser = await db.user.findFirst();
		if (!testUser) {
			return NextResponse.json(
				{ error: 'No test user found' },
				{ status: 404 }
			);
		}

		// Create or update test keyword
		const testKeyword = await db.keyword.upsert({
			where: {
				id: 'test-keyword',
			},
			update: {
				term: 'شركة الاختبار',
				userId: testUser.id,
				enabled: true,
			},
			create: {
				id: 'test-keyword',
				term: 'شركة الاختبار',
				userId: testUser.id,
				enabled: true,
			},
		});

		// Create a test announcement
		const testAnnouncement = await db.announcement.create({
			data: {
				id: `test-announcement-${Date.now()}`,
				annId: `TEST-${Date.now()}`,
				title: 'إعلان إفلاس شركة الاختبار للتجارة',
				description:
					'تعلن لجنة الإفلاس عن إفلاس شركة الاختبار للتجارة المحدودة',
				announcementUrl: 'https://bankruptcy.gov.sa/test-announcement',
				publishDate: new Date(),
			},
		});

		// Run the matching process
		const matches = await matchAnnouncementsWithKeywords();

		return NextResponse.json({
			success: true,
			message: 'Test completed successfully',
			matches: matches,
			testKeyword,
			testAnnouncement,
		});
	} catch (error) {
		console.error('Test failed:', error);
		const errorMessage =
			error instanceof Error ? error.message : 'Unknown error occurred';
		return NextResponse.json(
			{ error: 'Test failed', details: errorMessage },
			{ status: 500 }
		);
	}
}
