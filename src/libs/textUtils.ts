/**
 * Normalizes Arabic text by:
 * 1. Removing diacritics (tashkeel)
 * 2. Normalizing different forms of Alef
 * 3. Normalizing different forms of Ya and Alef Maksura
 * 4. Normalizing Hamza forms
 * 5. Removing non-Arabic characters and extra spaces
 */
export function normalizeArabicText(text: string): string {
	if (!text) return '';

	return (
		text
			// Remove diacritics (tashkeel)
			.replace(/[\u064B-\u065F]/g, '')

			// Normalize Alef forms to plain Alef
			.replace(/[آأإٱ]/g, 'ا')

			// Normalize Ya forms
			.replace(/[ىي]/g, 'ي')

			// Normalize Hamza forms
			.replace(/[ؤئ]/g, 'ء')

			// Remove non-Arabic characters except spaces and numbers
			.replace(/[^\u0600-\u06FF\s0-9]/g, ' ')

			// Replace multiple spaces with a single space
			.replace(/\s+/g, ' ')

			// Trim spaces from start and end
			.trim()
	);
}
