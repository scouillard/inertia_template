export type Theme = 'light' | 'dark'

export function getTheme(): Theme {
  return (localStorage.getItem('theme') as Theme) || 'dark'
}

export function setTheme(theme: Theme) {
  localStorage.setItem('theme', theme)
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
