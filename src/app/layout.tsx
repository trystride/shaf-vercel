import { Metadata, Viewport } from 'next';
import { Inter, IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';
import { Providers } from './[lang]/(site)/providers';
import { generateMetadata as baseGenerateMetadata } from '@/utils/metadata';
import { ar } from '@/translations/ar';
import { headers } from 'next/headers';

const inter = Inter({ subsets: ['latin'] });
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['arabic'],
});

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

export const metadata: Metadata = {
  ...baseGenerateMetadata(
    ar.metadata.title,
    ar.metadata.description
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

function getLocale(): string {
  const headersList = headers();
  // Get locale from Accept-Language header or default to 'en'
  const acceptLanguage = headersList.get('accept-language') || '';
  return acceptLanguage.includes('ar') ? 'ar' : 'en';
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getLocale();
  const isRTL = locale === 'ar';
  
  return (
    <html 
      lang={locale} 
      dir={isRTL ? 'rtl' : 'ltr'} 
      suppressHydrationWarning
      className={isRTL ? ibmPlexSansArabic.className : inter.className}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
