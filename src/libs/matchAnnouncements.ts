import { db } from './db';

export async function matchAnnouncementsWithKeywords() {
  try {
    // Get all enabled keywords
    const keywords = await db.keyword.findMany({
      where: { enabled: true },
      include: { user: true }
    });

    // Get announcements from the last 24 hours that haven't been matched yet
    const recentAnnouncements = await db.announcement.findMany({
      where: {
        publishDate: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    });

    const matches = [];

    // Check each announcement against each keyword
    for (const announcement of recentAnnouncements) {
      const announcementText = `${announcement.title} ${announcement.description}`.toLowerCase();

      for (const keyword of keywords) {
        const term = keyword.term.toLowerCase();
        
        if (announcementText.includes(term)) {
          // Check if this match already exists
          const existingMatch = await db.match.findFirst({
            where: {
              keywordId: keyword.id,
              announcementId: announcement.id
            }
          });

          if (!existingMatch) {
            // Create new match
            const match = await db.match.create({
              data: {
                keywordId: keyword.id,
                announcementId: announcement.id
              }
            });
            matches.push({
              match,
              keyword,
              announcement
            });
          }
        }
      }
    }

    return matches;
  } catch (error) {
    console.error('Error matching announcements:', error);
    throw error;
  }
}
