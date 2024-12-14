import { db } from '../libs/db';
import { matchAnnouncementsWithKeywords } from '../libs/matchAnnouncements';

async function testNotifications() {
  try {
    console.log('Starting notification test...');

    // Get test user
    const testUser = await db.user.findFirst();
    if (!testUser) {
      throw new Error('No test user found. Please create a user first.');
    }
    console.log('Test user found:', testUser.email);

    // Create test keyword
    const testKeyword = await db.keyword.upsert({
      where: {
        id: 'test-keyword',
      },
      update: {
        term: 'شركة الاختبار',
        userId: testUser.id,
        enabled: true
      },
      create: {
        id: 'test-keyword',
        term: 'شركة الاختبار',
        userId: testUser.id,
        enabled: true
      }
    });
    console.log('Test keyword created:', testKeyword.term);

    // Create test announcement
    const testAnnouncement = await db.announcement.create({
      data: {
        id: 'test-announcement',
        annId: 'TEST-' + Date.now(),
        title: 'إعلان إفلاس شركة الاختبار للتجارة',
        description: 'تعلن لجنة الإفلاس عن إفلاس شركة الاختبار للتجارة المحدودة',
        announcementUrl: 'https://bankruptcy.gov.sa/test-announcement',
        publishDate: new Date(),
      }
    });
    console.log('Test announcement created:', testAnnouncement.title);

    // Run matching process
    console.log('Running keyword matching...');
    const matches = await matchAnnouncementsWithKeywords();
    console.log('Matches found:', matches.length);

    console.log('Test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

testNotifications();
