import '@/styles/satoshi.css';
import 'react-quill/dist/quill.snow.css';
import '@/styles/globals.css';
import { Providers } from './providers';
import ToastContext from '@/app/context/ToastContext';
import NextTopLoader from 'nextjs-toploader';
import dynamic from 'next/dynamic';
import FooterWrapper from '@/components/Footer/FooterWrapper';
import { HeaderWrapper } from '@/components/Header/HeaderWrapper';

const Loader = dynamic(() => import('@/components/Common/PreLoader'), {
	ssr: false,
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Loader />
			<>
				<ToastContext />
				<Providers>
					<NextTopLoader
						color='#635BFF'
						crawlSpeed={300}
						showSpinner={false}
						shadow='none'
					/>
					<HeaderWrapper />
					{children}
					<FooterWrapper />
				</Providers>
			</>
		</>
	);
}
