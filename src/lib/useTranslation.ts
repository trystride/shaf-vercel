import { useParams } from 'next/navigation';
import { ar } from '@/translations/ar';
import { en } from '@/translations/en';

const translations = { en, ar } as const;
type Language = keyof typeof translations;

// Recursive type for nested translation objects
type NestedKeyOf<T> = T extends object
  ? { [K in keyof T]: K extends string
      ? T[K] extends object
        ? `${K}.${NestedKeyOf<T[K]>}`
        : K
      : never
  }[keyof T]
  : never;

type TranslationKey = NestedKeyOf<typeof en>;

const getNestedValue = (obj: any, path: string) => {
  const value = path.split('.').reduce((acc, part) => acc && acc[part], obj);
  if (value === undefined && process.env.NODE_ENV === 'development') {
    console.warn(`[Translation Warning] Missing translation key: "${path}"`);
  }
  return value;
};

export function useTranslation() {
  const params = useParams();
  const locale = (params?.locale as Language) || 'en';
  
  // Verify locale is supported, fallback to 'en' if not
  if (!translations[locale] && process.env.NODE_ENV === 'development') {
    console.warn(`[Translation Warning] Locale "${locale}" not supported, falling back to "en"`);
  }
  
  const dictionary = translations[locale] || translations.en;

  function t(key: TranslationKey, vars?: Record<string, string>): any {
    // Get the translation using nested key access
    let text = getNestedValue(dictionary, key);
    
    // Fallback to English if translation is missing
    if (text === undefined && locale !== 'en') {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[Translation Warning] Missing translation for key "${key}" in "${locale}" locale, falling back to "en"`
        );
      }
      text = getNestedValue(translations.en, key);
    }

    // If still undefined, return the key as fallback
    if (text === undefined) {
      return key;
    }

    // Handle objects (nested translations)
    if (typeof text === 'object') {
      return text;
    }

    // Replace variables in the text
    if (vars) {
      Object.entries(vars).forEach(([varKey, value]) => {
        text = (text as string).replace(`{${varKey}}`, value);
      });
    }

    return text;
  }

  return { t, locale };
}
