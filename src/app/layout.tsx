import { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './(site)/providers';
import { generateMetadata as baseGenerateMetadata } from '@/utils/metadata';

const inter = Inter({ subsets: ['latin'] });

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

export const metadata: Metadata = {
	...baseGenerateMetadata(
		'Shaf - Business Intelligence',
		'A powerful Business Intelligence platform built with Next.js'
	),
	robots: {
		index: true,
		follow: true,
	},
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={inter.className}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
