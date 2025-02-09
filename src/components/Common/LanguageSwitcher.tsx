'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/useTranslation';

export function LanguageSwitcher() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const locale = (params?.locale as string) || 'en';

  const changeLanguage = (lang: string) => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Get the path segments
    const segments = pathname.split('/').filter(Boolean);
    
    // Check if the first segment is a locale
    const hasLocale = ['en', 'ar'].includes(segments[0]);
    
    if (!hasLocale) {
      // If no locale prefix exists, add it
      router.push(`/${lang}${pathname}`);
    } else {
      // Replace the existing locale with the new one
      segments[0] = lang;
      router.push(`/${segments.join('/')}`);
    }
  };

  return (
    <div className="relative inline-block">
      <div className="flex items-center space-x-1 rounded-lg border border-gray-200 p-1 dark:border-gray-700">
        <button
          onClick={() => changeLanguage('en')}
          className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
            locale === 'en'
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
          aria-label={t('common.switchToEnglish')}
        >
          EN
        </button>
        <button
          onClick={() => changeLanguage('ar')}
          className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
            locale === 'ar'
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
          aria-label={t('common.switchToArabic')}
        >
          ع
        </button>
      </div>
    </div>
  );
}
