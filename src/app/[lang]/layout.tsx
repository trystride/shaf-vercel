import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { Providers } from './(site)/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Shaf - Business Intelligence Monitor',
  description: 'Monitor important business announcements across trusted sources in Saudi Arabia.',
}

export default function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  return (
    <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
