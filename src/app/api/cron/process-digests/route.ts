import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import type { DigestQueue, Match, Keyword, Announcement } from '@prisma/client';

type DigestWithRelations = DigestQueue & {
	matches: (Match & {
		keyword: Keyword;
		announcement: Announcement;
	})[];
	user: {
		email: string | null;
	};
};

class ProcessDigestError extends Error {
	constructor(
		public digestId: string,
		message: string
	) {
		super(message);
		this.name = 'ProcessDigestError';
	}
}

export const dynamic = 'force-dynamic';

export async function POST(_req: Request) {
	const headersList = headers();
	const cronSecret = headersList.get('x-cron-secret');

	if (cronSecret !== process.env.CRON_SECRET) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		// Get all pending digests
		const pendingDigests = await db.digestQueue.findMany({
			where: {
				scheduledFor: {
					lte: new Date(),
				},
				sent: false,
			},
			include: {
				matches: {
					include: {
						keyword: true,
						announcement: true,
					},
				},
				user: {
					select: {
						email: true,
					},
				},
			},
		});

		const errors: ProcessDigestError[] = [];

		// Process each digest
		for (const digest of pendingDigests as DigestWithRelations[]) {
			try {
				// Check if user has email before sending
				const userEmail = digest.user.email;
				if (!userEmail) {
					errors.push(
						new ProcessDigestError(
							digest.id,
							'User does not have an email address'
						)
					);
					continue;
				}

				const emailContent = generateDigestEmailContent(digest);

				await sendEmail({
					to: userEmail,
					subject: 'تنبيهات جديدة - إعلانات الإفلاس',
					html: emailContent,
				});

				// Mark digest as sent
				await db.digestQueue.update({
					where: { id: digest.id },
					data: { sent: true },
				});
			} catch (error) {
				errors.push(
					new ProcessDigestError(
						digest.id,
						error instanceof Error ? error.message : String(error)
					)
				);
			}
		}

		if (errors.length > 0) {
			return NextResponse.json(
				{
					success: false,
					errors: errors.map((e) => ({
						digestId: e.digestId,
						error: e.message,
					})),
				},
				{ status: 207 }
			);
		}

		return NextResponse.json({
			success: true,
			processedCount: pendingDigests.length,
		});
	} catch (error) {
		console.error('Error processing digests:', error);
		return NextResponse.json(
			{ error: 'Failed to process digests' },
			{ status: 500 }
		);
	}
}

// Support both GET (for Vercel cron) and POST (for internal calls)
export const GET = POST;

function generateDigestEmailContent(digest: DigestWithRelations): string {
	const matches = digest.matches.map((match) => ({
		keyword: match.keyword.term,
		announcement: {
			title: match.announcement.title,
			description: match.announcement.description,
			url: match.announcement.announcementUrl,
			date: new Date(match.announcement.publishDate).toLocaleDateString(
				'ar-SA'
			),
		},
	}));

	return `
    <div dir="rtl" style="font-family: Arial, sans-serif;">
      <h2>تنبيهات جديدة - إعلانات الإفلاس</h2>
      <p>تم العثور على إعلانات جديدة تطابق كلماتك المفتاحية:</p>
      ${matches
				.map(
					(match) => `
        <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
          <h3>الكلمة المفتاحية: ${match.keyword}</h3>
          <div style="margin-right: 20px;">
            <h4 style="margin: 10px 0;">${match.announcement.title}</h4>
            <p style="margin: 5px 0;">${match.announcement.description}</p>
            <p style="margin: 5px 0;">التاريخ: ${match.announcement.date}</p>
            <a href="${
							match.announcement.url
						}" style="color: #0066cc;">عرض الإعلان الكامل</a>
          </div>
        </div>
      `
				)
				.join('')}
      <p style="margin-top: 30px; color: #666;">
        تم إرسال هذا البريد تلقائياً من نظام مراقبة إعلانات الإفلاس.
      </p>
    </div>
  `;
}
