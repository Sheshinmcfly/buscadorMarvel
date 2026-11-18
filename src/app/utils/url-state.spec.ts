import { buildUrl, parseUrl } from './url-state';

describe('url-state', () => {
  it('sin parámetros abre Buscar en Marvel sin héroe', () => {
    expect(parseUrl('')).toEqual({ tab: 'search', theme: 'marvel', heroe: null });
    expect(buildUrl({ tab: 'search', theme: 'marvel', heroe: null })).toBe('/');
  });

  it('lee tab, editorial y héroe', () => {
    expect(parseUrl('?tab=rankings&editorial=dc&heroe=70-batman')).toEqual({
      tab: 'rankings',
      theme: 'dc',
      heroe: '70-batman',
    });
  });

  it('descarta valores inválidos', () => {
    expect(parseUrl('?tab=inventada&editorial=image&heroe=<script>')).toEqual({
      tab: 'search',
      theme: 'marvel',
      heroe: null,
    });
    expect(parseUrl('?heroe=spider-man').heroe).toBeNull();
  });

  it('normaliza mayúsculas del héroe', () => {
    expect(parseUrl('?heroe=620-Spider-Man').heroe).toBe('620-spider-man');
  });

  it('ida y vuelta consistente', () => {
    const state = { tab: 'explore' as const, theme: 'dc' as const, heroe: '644-superman' };
    const url = buildUrl(state);
    expect(url).toBe('/?tab=explorar&editorial=dc&heroe=644-superman');
    expect(parseUrl(url.slice(1))).toEqual(state);
  });
});
