'use client'

import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import i18next from './i18n'

export default function Home({ params: { lng } }: { params: { lng: string } }) {
  const { t } = useTranslation()

  useEffect(() => {
    i18next.changeLanguage(lng)
  }, [lng])

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-6xl mb-20">{t('hello')}</h1>
      <h1 className="text-6xl mb-20">{t('hello')}</h1>
      <h1 className="text-6xl mb-20">{t('hello')}</h1>
      <h1 className="text-6xl mb-20">{t('hello')}</h1>
      <h1 className="text-6xl mb-20">{t('hello')}</h1>
      <h1 className="text-6xl mb-20">{t('hello')}</h1>
      <h1 className="text-6xl mb-20">{t('hello')}</h1>
      <h1 className="text-6xl mb-20">{t('hello')}</h1>
      <h1 className="text-6xl mb-20">{t('hello')}</h1>
      <h1 className="text-6xl mb-20">{t('hello')}</h1>
      <h1 className="text-6xl mb-20">{t('hello')}</h1>
      <h1 className="text-6xl mb-20">{t('hello')}</h1>
      <h1 className="text-6xl mb-20">{t('hello')}</h1>
      <h1 className="text-6xl mb-20">{t('hello')}</h1>

      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-6xl mb-20">{t('hello')}</h1>
      <p className="text-2xl">This is left-to-right text. هذا نص من اليمين إلى اليسار.</p>
      <div className="flex justify-between w-full">
        <span>Left</span>
        <span>Right</span>
      </div>
    </div>
      {/* ... other elements ... */}
    </div>
  );
}