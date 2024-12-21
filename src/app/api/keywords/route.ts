import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/keywords - Get all keywords for the current user
export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			console.error('[KEYWORDS_GET] No session or user email found');
			return new NextResponse('Unauthorized', { status: 401 });
		}

		// Get user from session
		const user = await prisma.user.findUnique({
			where: {
				email: session.user.email,
			},
			select: {
				id: true,
				email: true,
			},
		});

		if (!user) {
			console.error(
				'[KEYWORDS_GET] User not found for email:',
				session.user.email
			);
			return new NextResponse('User not found', { status: 404 });
		}

		// Then get keywords using userId
		const keywords = await prisma.keyword.findMany({
			where: {
				userId: user.id,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return NextResponse.json(keywords);
	} catch (error) {
		console.error('[KEYWORDS_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

// POST /api/keywords - Create a new keyword
export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			console.error('[KEYWORDS_POST] No session or user email found');
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const body = await req.json();
		const { term } = body;

		if (!term?.trim()) {
			return new NextResponse('Keyword is required', { status: 400 });
		}

		// Get user from session
		const user = await prisma.user.findUnique({
			where: {
				email: session.user.email,
			},
			select: {
				id: true,
				email: true,
			},
		});

		if (!user) {
			console.error(
				'[KEYWORDS_POST] User not found for email:',
				session.user.email
			);
			return new NextResponse('User not found', { status: 404 });
		}

		// Check for duplicate keywords
		const existingKeyword = await prisma.keyword.findFirst({
			where: {
				term: term.trim(),
				userId: user.id,
			},
		});

		if (existingKeyword) {
			return new NextResponse('Keyword already exists', { status: 400 });
		}

		// Get keyword count
		const keywordCount = await prisma.keyword.count({
			where: {
				userId: user.id,
			},
		});

		// Check if user has reached the keyword limit
		const KEYWORD_LIMIT = 50;
		if (keywordCount >= KEYWORD_LIMIT) {
			return new NextResponse('Keyword limit reached', { status: 400 });
		}

		const keyword = await prisma.keyword.create({
			data: {
				term: term.trim(),
				userId: user.id,
			},
		});

		return NextResponse.json(keyword);
	} catch (error) {
		console.error('[KEYWORDS_POST]', error);
		if (error instanceof Error) {
			return new NextResponse(error.message, { status: 500 });
		}
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			console.error('[KEYWORDS_DELETE] No session or user email found');
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const keywordId = req.nextUrl.searchParams.get('keywordId');

		if (!keywordId) {
			return new NextResponse('Keyword ID is required', { status: 400 });
		}

		const keyword = await prisma.keyword.findUnique({
			where: {
				id: keywordId,
			},
		});

		if (!keyword) {
			return NextResponse.json(
				{
					error: 'Keyword not found',
				},
				{ status: 404 }
			);
		}

		if (keyword.userId !== session.user.id) {
			return NextResponse.json(
				{
					error: 'Unauthorized',
				},
				{ status: 403 }
			);
		}

		try {
			// Delete the keyword
			await prisma.keyword.delete({
				where: {
					id: keywordId,
					userId: session.user.id,
				},
			});

			return NextResponse.json({ success: true });
		} catch (error) {
			console.error('Error deleting keyword:', error);
			return NextResponse.json(
				{
					error: 'Internal server error',
				},
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error('[KEYWORDS_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
