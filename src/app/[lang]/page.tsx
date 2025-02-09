import { redirect } from 'next/navigation'
import Home from '@/components/landing/Home'

export default function RootPage({
  params: { lang },
}: {
  params: { lang: string }
}) {
  return (
    <main className='flex min-h-screen flex-col'>
      <Home />
    </main>
  )
}
