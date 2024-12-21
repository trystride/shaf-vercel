import { Metadata } from 'next';

// Default values
const DEFAULT_URL = 'http://localhost:3000';
const DEFAULT_SITE_NAME = 'SaaS Bold';

// Ensure we have a valid URL during build time
const getBaseUrl = () => {
	try {
		const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;

		// If no environment URL is set, return default
		if (!envUrl || envUrl.trim() === '') {
			return DEFAULT_URL;
		}

		// Ensure the URL has a protocol
		if (!envUrl.startsWith('http://') && !envUrl.startsWith('https://')) {
			return `https://${envUrl}`;
		}

		return envUrl;
	} catch (error) {
		console.warn('Error getting base URL, falling back to default:', error);
		return DEFAULT_URL;
	}
};

const createMetadataBase = () => {
	try {
		const baseUrl = getBaseUrl();
		return new URL(baseUrl);
	} catch (error) {
		console.warn(
			'Error creating metadata base URL, falling back to default:',
			error
		);
		return new URL(DEFAULT_URL);
	}
};

export function generateMetadata(
	title: string,
	description?: string
): Metadata {
	const siteName = process.env.SITE_NAME || DEFAULT_SITE_NAME;

	// Base metadata that doesn't depend on URL
	const baseMetadata: Metadata = {
		title: {
			template: `%s | ${siteName}`,
			default: title,
		},
		description,
		openGraph: {
			title,
			description,
			siteName,
		},
	};

	try {
		const metadataBase = createMetadataBase();
		const url = metadataBase.toString();

		// Only add URL-dependent fields if we have a valid URL
		if (url && url !== '') {
			return {
				...baseMetadata,
				metadataBase,
				openGraph: {
					...baseMetadata.openGraph,
					url,
				},
			};
		}
	} catch (error) {
		console.warn(
			'Error generating metadata with URL, falling back to base metadata:',
			error
		);
	}

	// Return base metadata without URL-dependent fields if URL creation fails
	return baseMetadata;
}
