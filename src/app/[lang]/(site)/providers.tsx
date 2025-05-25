'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { TranslationProvider } from '../../context/TranslationContext';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<ThemeProvider attribute="class">
				<TranslationProvider>
					{children}
				</TranslationProvider>
			</ThemeProvider>
		</SessionProvider>
	);
}
