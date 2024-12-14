import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/libs/db';
import { matchAnnouncementsWithKeywords } from '@/libs/matchAnnouncements';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');
    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    // Find the user by email
    const user = await db.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create or update test keyword for this user
    const testKeyword = await db.keyword.upsert({
      where: {
        id: `test-keyword-${user.id}`
      },
      update: {
        term: 'شركة الاختبار',
        userId: user.id,
        enabled: true
      },
      create: {
        id: `test-keyword-${user.id}`,
        term: 'شركة الاختبار',
        userId: user.id,
        enabled: true
      }
    });

    // Create a test announcement
    const testAnnouncement = await db.announcement.create({
      data: {
        id: `test-announcement-${Date.now()}`,
        annId: `TEST-${Date.now()}`,
        title: 'إعلان إفلاس شركة الاختبار للتجارة',
        description: 'تعلن لجنة الإفلاس عن إفلاس شركة الاختبار للتجارة المحدودة',
        announcementUrl: 'https://bankruptcy.gov.sa/test-announcement',
        publishDate: new Date()
      }
    });

    // Run the matching process
    const matches = await matchAnnouncementsWithKeywords();

    return NextResponse.json({
      success: true,
      message: 'Test completed successfully',
      matches: matches,
      user: {
        id: user.id,
        email: user.email
      },
      testKeyword: {
        id: testKeyword.id,
        term: testKeyword.term
      },
      testAnnouncement: {
        id: testAnnouncement.id,
        title: testAnnouncement.title
      }
    });
  } catch (error) {
    console.error('Test failed:', error);
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
