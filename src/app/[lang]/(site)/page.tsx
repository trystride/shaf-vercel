import Home from '@/components/landing/Home';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: `Business Intelligence Monitoring - Stay Ahead with Real-Time Updates`,
	description: `Transform the way you track important business announcements across Saudi Arabia's trusted sources. Get real-time updates on bankruptcy notices, media updates, and market movements that matter to your business.`,
	openGraph: {
		type: 'website',
		title: `Business Intelligence Monitoring - Stay Ahead with Real-Time Updates`,
		description: `Transform the way you track important business announcements across Saudi Arabia's trusted sources. Get real-time updates on bankruptcy notices, media updates, and market movements that matter to your business.`,
		locale: 'en_US',
		siteName: 'Business Intelligence Monitor',
	},
	twitter: {
		card: 'summary_large_image',
		title: `Business Intelligence Monitoring - Stay Ahead with Real-Time Updates`,
		description: `Transform the way you track important business announcements across Saudi Arabia's trusted sources. Get real-time updates on bankruptcy notices, media updates, and market movements that matter to your business.`,
	},
};

export default function HomePage() {
	return (
		<main className='flex min-h-screen flex-col'>
			<Home />
		</main>
	);
}
