import Contact from '@/components/Contact';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Contact Us',
	description: 'Get in touch with us for any questions or support',
};

export default function ContactPage() {
	return (
		<main>
			<Contact />
		</main>
	);
}
