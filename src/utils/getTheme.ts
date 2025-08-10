import { THEMES } from '@constants/themes'

export const getDeviceSchema = () => {
  if (window.matchMedia('prefers-color-scheme: more').matches)
    return THEMES.HIGH_CONTRAST

  if (window.matchMedia('(prefers-color-scheme: dark)').matches)
    return THEMES.DARK

  return THEMES.LIGHT
}

export const getTheme = () => {
  const theme = localStorage.getItem('theme')

  if (theme) return theme

  return getDeviceSchema()
}
