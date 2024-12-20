import { db } from '../libs/db';
import { matchAnnouncementsWithKeywords } from '../libs/matchAnnouncements';
import { createLogger } from '@/utils/logger';

const logger = createLogger('TestNotifications');

async function testNotifications() {
	try {
		logger.info('Starting notification test...');

		// Get test user
		const testUser = await db.user.findFirst();
		if (!testUser) {
			throw new Error('No test user found. Please create a user first.');
		}
		logger.info('Test user found', { email: testUser.email });

		// Create test keyword
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
		logger.info('Test keyword created', { term: testKeyword.term });

		// Create test announcement
		const testAnnouncement = await db.announcement.create({
			data: {
				id: 'test-announcement',
				annId: 'TEST-' + Date.now(),
				title: 'إعلان إفلاس شركة الاختبار للتجارة',
				description:
					'تعلن لجنة الإفلاس عن إفلاس شركة الاختبار للتجارة المحدودة',
				announcementUrl: 'https://bankruptcy.gov.sa/test-announcement',
				publishDate: new Date(),
			},
		});
		logger.info('Test announcement created', { title: testAnnouncement.title });

		// Run matching process
		logger.info('Running keyword matching...');
		const matches = await matchAnnouncementsWithKeywords();
		logger.info('Matches found', { count: matches.length });

		logger.info('Test completed successfully!');
		process.exit(0);
	} catch (error) {
		logger.error('Test failed', error);
		process.exit(1);
	}
}

testNotifications();
