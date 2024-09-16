export const fallbackLng = 'en'
export const languages = [fallbackLng, 'fr', 'es', 'ar', 'bg']
export const defaultNS = 'common'

export function getOptions (lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns
  }
}