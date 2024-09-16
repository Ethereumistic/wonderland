'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'bg', name: 'Bulgarian', flag: '🇧🇬' },
]

export function LanguageSelector() {
  const router = useRouter()
  const { i18n } = useTranslation()

  return (
    <div className="relative inline-block text-left">
      <select
        className="appearance-none bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-3 pr-8 text-sm leading-5 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        value={i18n.language}
        onChange={(e) => {
          i18n.changeLanguage(e.target.value)
          router.refresh()
        }}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  )
}