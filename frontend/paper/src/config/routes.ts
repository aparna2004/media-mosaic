export const ROUTES = {
  TOP_NEWS: '/',
  SPORTS: '/sports',
  FINANCE: '/finance',
  ENTERTAINMENT: '/entertainment',
  TECH: '/tech',
  AJAY: '/ajay',
  APARNA: '/aparna'
} as const;

export const navItems = [
  { id: 'top-news', label: 'Top News', path: ROUTES.TOP_NEWS },
  { id: 'sports', label: 'Sports', path: ROUTES.SPORTS },
  { id: 'finance', label: 'Finance', path: ROUTES.FINANCE },
  { id: 'entertainment', label: 'Entertainment', path: ROUTES.ENTERTAINMENT },
  { id: 'tech', label: 'Tech', path: ROUTES.TECH },
  { id: 'ajay', label: 'Ajay', path: ROUTES.AJAY },
  { id: 'aparna', label: 'Aparna', path: ROUTES.APARNA }
] as const;