import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../utils/translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('civiclens_lang') || 'en'
  })

  useEffect(() => {
    localStorage.setItem('civiclens_lang', lang)
  }, [lang])

  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'))
  }

  const t = (key) => {
    return translations[lang]?.[key] || translations.en[key] || key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
