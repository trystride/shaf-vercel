import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

type MatchWithDetails = {
	announcement: {
		id: string;
		annId: string;
		title: string;
		description: string;
		publishDate: Date;
		announcementUrl: string;
		createdAt: Date | null;
	};
	keyword: {
		term: string;
	};
};

export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			console.error('Unauthorized access attempt');
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Get user's keywords first
		const user = await db.user.findUnique({
			where: { email: session.user.email },
			select: {
				id: true,
				keywords: {
					where: { enabled: true },
					select: {
						id: true,
						term: true,
					},
				},
			},
		});

		if (!user) {
			console.error('User not found:', session.user.email);
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		// Get all matches for the user's keywords
		const matches = await db.match.findMany({
			where: {
				keyword: {
					userId: user.id,
					enabled: true,
				},
			},
			select: {
				announcement: {
					select: {
						id: true,
						annId: true,
						title: true,
						description: true,
						publishDate: true,
						announcementUrl: true,
						createdAt: true,
					},
				},
				keyword: {
					select: {
						term: true,
					},
				},
			},
			orderBy: [
				{
					announcement: {
						createdAt: 'desc',
					},
				},
			],
		});

		const announcements = matches.map((match: MatchWithDetails) => ({
			Id: match.announcement.id,
			AnnId: match.announcement.annId,
			Header: match.announcement.title,
			Comment: match.announcement.description,
			Body: match.announcement.description,
			PublishDate: match.announcement.publishDate.toISOString(),
			url: match.announcement.announcementUrl,
			AnnCreatedDate: match.announcement.createdAt?.toISOString() || null,
			matchedKeyword: match.keyword.term,
			// Set default values for missing fields
			ActionType: '',
			ActionTypeID: 0,
			ActionTypeEn: '',
			CourtType: '',
			AnnouncementType: '',
			Status: null,
			RequestId: match.announcement.id,
			StatusId: 0,
			debtorName: '',
			ActionDate: null,
			PageItems: null,
			debtorIdentifier: '',
		}));

		return NextResponse.json(announcements);
	} catch (error) {
		console.error('API Error:', error);
		return NextResponse.json(
			{
				error: error instanceof Error ? error.message : 'Internal server error',
			},
			{ status: 500 }
		);
	}
}
