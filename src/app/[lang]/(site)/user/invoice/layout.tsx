import { Metadata } from 'next';
import { ar } from '@/translations/ar';

export const metadata: Metadata = {
	title: `${ar.invoice.title} - ${process.env.SITE_NAME}`,
	description: ar.invoice.description,
};

export default function InvoiceLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
