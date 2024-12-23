import { NextResponse } from 'next/server';

// Function to normalize Arabic text (same as in create-matches)
function normalizeArabicText(text: string): string {
	return (
		text
			.toLowerCase()
			// Normalize alef variations
			.replace(/[أإآا]/g, 'ا')
			// Normalize teh marbuta and heh
			.replace(/[ةه]/g, 'ه')
			// Normalize yeh and alef maksura
			.replace(/[ىي]/g, 'ي')
			// Remove Arabic diacritics (tashkeel)
			.replace(/[\u064B-\u065F]/g, '')
			// Normalize spaces and remove extra whitespace
			.replace(/\s+/g, ' ')
			.trim()
	);
}

export async function GET() {
	try {
		// Test cases with different Arabic text variations
		const testCases = [
			{
				keyword: 'شركة',
				announcements: [
					{ title: 'شركه للتجارة', description: 'وصف الشركة' },
					{ title: 'مؤسسة', description: 'شركة للخدمات' },
				],
			},
			{
				keyword: 'مؤسسة',
				announcements: [
					{ title: 'مؤسسه تجارية', description: 'خدمات المؤسسة' },
					{ title: 'شركة', description: 'مؤسسه جديدة' },
				],
			},
			{
				keyword: 'أحمد',
				announcements: [
					{ title: 'احمد للتجارة', description: 'شركة احمد' },
					{ title: 'محمد', description: 'مؤسسة أحمد' },
				],
			},
		];

		const results = testCases.map((testCase) => {
			const matches = testCase.announcements.filter((ann) => {
				const title = normalizeArabicText(ann.title);
				const description = normalizeArabicText(ann.description);
				const term = normalizeArabicText(testCase.keyword);

				const isMatch = title.includes(term) || description.includes(term);

				return isMatch;
			});

			return {
				keyword: testCase.keyword,
				normalizedKeyword: normalizeArabicText(testCase.keyword),
				matches: matches.map((match) => ({
					title: match.title,
					normalizedTitle: normalizeArabicText(match.title),
					description: match.description,
					normalizedDescription: normalizeArabicText(match.description),
				})),
			};
		});

		return NextResponse.json({
			message: 'Test results',
			results,
		});
	} catch (error) {
		console.error('Test Error:', error);
		return NextResponse.json(
			{
				error: error instanceof Error ? error.message : 'Internal server error',
			},
			{ status: 500 }
		);
	}
}
