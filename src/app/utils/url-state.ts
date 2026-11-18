import { Theme } from '../models/character';

export type AppTab = 'search' | 'compare' | 'rankings' | 'explore' | 'favorites';

export interface UrlState {
  tab: AppTab;
  theme: Theme;
  heroe: string | null;
}

const TAB_SLUGS: Record<AppTab, string> = {
  search: 'buscar',
  compare: 'comparar',
  rankings: 'rankings',
  explore: 'explorar',
  favorites: 'favoritos',
};

const SLUG_TO_TAB = Object.fromEntries(Object.entries(TAB_SLUGS).map(([tab, slug]) => [slug, tab])) as Record<
  string,
  AppTab
>;

// Los slugs del dataset tienen la forma "620-spider-man".
const HERO_SLUG = /^\d+-[a-z0-9-]+$/;

export function parseUrl(search: string): UrlState {
  const params = new URLSearchParams(search);
  const heroe = params.get('heroe')?.trim().toLowerCase() ?? '';
  return {
    tab: SLUG_TO_TAB[params.get('tab') ?? ''] ?? 'search',
    theme: params.get('editorial') === 'dc' ? 'dc' : 'marvel',
    heroe: HERO_SLUG.test(heroe) ? heroe : null,
  };
}

export function buildUrl(state: UrlState): string {
  const params = new URLSearchParams();
  if (state.tab !== 'search') params.set('tab', TAB_SLUGS[state.tab]);
  if (state.theme === 'dc') params.set('editorial', 'dc');
  if (state.heroe) params.set('heroe', state.heroe);
  const query = params.toString();
  return query ? `/?${query}` : '/';
}
