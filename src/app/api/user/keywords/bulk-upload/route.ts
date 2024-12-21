import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			console.error('[KEYWORDS_BULK_UPLOAD] No session or user email found');
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
				'[KEYWORDS_BULK_UPLOAD] User not found for email:',
				session.user.email
			);
			return new NextResponse('User not found', { status: 404 });
		}

		const formData = await req.formData();
		const file = formData.get('file') as File | null;

		if (!file) {
			console.error('[KEYWORDS_BULK_UPLOAD] No file provided');
			return new NextResponse('No file provided', { status: 400 });
		}

		if (file.size > MAX_FILE_SIZE) {
			console.error('[KEYWORDS_BULK_UPLOAD] File size too large:', file.size);
			return new NextResponse('File size too large', { status: 400 });
		}

		const text = await file.text();
		const lines = text
			.split(/[\n,]/)
			.map((line) => line.trim())
			.filter(Boolean);

		const keywordSchema = z.string().min(1).max(100);
		const results = {
			added: 0,
			skipped: 0,
		};

		// Process keywords in chunks to avoid overwhelming the database
		const chunkSize = 100;
		for (let i = 0; i < lines.length; i += chunkSize) {
			const chunk = lines.slice(i, i + chunkSize);

			// Validate keywords
			const validKeywords = chunk.filter((keyword) => {
				try {
					keywordSchema.parse(keyword);
					return true;
				} catch {
					results.skipped++;
					return false;
				}
			});

			// Insert valid keywords
			for (const term of validKeywords) {
				try {
					// Check for duplicate keywords
					const existingKeyword = await prisma.keyword.findFirst({
						where: {
							term: term.trim(),
							userId: user.id,
						},
					});

					if (existingKeyword) {
						results.skipped++;
						continue;
					}

					// Create new keyword
					await prisma.keyword.create({
						data: {
							userId: user.id,
							term: term.trim(),
							enabled: true, // Set default enabled state
						},
					});
					results.added++;
				} catch (error) {
					console.error(
						'[KEYWORDS_BULK_UPLOAD] Error creating keyword:',
						error
					);
					results.skipped++;
				}
			}
		}

		console.log('[KEYWORDS_BULK_UPLOAD] Upload complete:', results);
		return NextResponse.json(results);
	} catch (error) {
		console.error('[KEYWORDS_BULK_UPLOAD] Error:', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
