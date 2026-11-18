import {
  Component,
  signal,
  computed,
  effect,
  inject,
  untracked,
  DOCUMENT,
  DestroyRef,
  ChangeDetectionStrategy,
} from '@angular/core';

import { HeroBackgroundComponent } from './components/hero-background/hero-background.component';
import { SearchComponent } from './components/search/search.component';
import { CharacterListComponent } from './components/character-list/character-list.component';
import { CharacterDetailComponent } from './components/character-detail/character-detail.component';
import { ComparatorComponent } from './components/comparator/comparator.component';
import { TopRankingsComponent } from './components/top-rankings/top-rankings.component';
import { ExploreComponent } from './components/explore/explore.component';
import { RandomHeroComponent } from './components/random-hero/random-hero.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { FavoritesService } from './services/favorites.service';
import { HeroService } from './services/hero.service';
import { Character, Theme, Publisher } from './models/character';
import { AppTab, buildUrl, parseUrl } from './utils/url-state';

export type { AppTab } from './utils/url-state';

@Component({
  selector: 'app-root',
  imports: [
    HeroBackgroundComponent,
    SearchComponent,
    CharacterListComponent,
    CharacterDetailComponent,
    ComparatorComponent,
    TopRankingsComponent,
    ExploreComponent,
    RandomHeroComponent,
    FavoritesComponent,
  ],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.component.css',
})
export class AppComponent {
  private doc = inject(DOCUMENT);
  private heroService = inject(HeroService);
  favSvc = inject(FavoritesService);

  theme = signal<Theme>('marvel');
  activeTab = signal<AppTab>('search');
  characters = signal<Character[]>([]);
  selectedCharacter = signal<Character | null>(null);
  loading = signal(false);

  // Personaje pedido por la URL que todavía no se resolvió porque el dataset no terminó de cargar.
  private pendingSlug = signal<string | null>(null);

  publisher = computed<Publisher>(() => (this.theme() === 'marvel' ? 'Marvel Comics' : 'DC Comics'));
  isDC = computed(() => this.theme() === 'dc');

  private url = computed(() =>
    buildUrl({
      tab: this.activeTab(),
      theme: this.theme(),
      heroe: this.selectedCharacter()?.slug ?? this.pendingSlug(),
    }),
  );

  tabs: { id: AppTab; label: string; icon: string }[] = [
    { id: 'search', label: 'Buscar', icon: 'bi-search' },
    { id: 'compare', label: 'Comparar', icon: 'bi-subtract' },
    { id: 'rankings', label: 'Rankings', icon: 'bi-trophy-fill' },
    { id: 'explore', label: 'Explorar', icon: 'bi-grid-3x3-gap-fill' },
    { id: 'favorites', label: 'Favoritos', icon: 'bi-heart-fill' },
  ];

  constructor() {
    effect(() => {
      const dc = this.isDC();
      const root = this.doc.documentElement.style;
      root.setProperty('--primary', dc ? '#1a53a0' : '#B7000D');
      root.setProperty('--primary-dark', dc ? '#0d3370' : '#7a0009');
      root.setProperty('--accent', dc ? '#2a6dd9' : '#e8000f');
      root.setProperty('--bg', dc ? '#000d1a' : '#1a0003');
      root.setProperty('--card-bg', dc ? '#001229' : '#2a0005');
      root.setProperty('--navbar-bg', dc ? '#00080f' : '#0d0001');
      root.setProperty('--text', dc ? '#f0f4ff' : '#f5f5f5');
    });

    this.applyUrlState();
    const onPopState = () => this.applyUrlState();
    window.addEventListener('popstate', onPopState);
    inject(DestroyRef).onDestroy(() => window.removeEventListener('popstate', onPopState));

    effect(() => {
      const next = this.url();
      untracked(() => this.writeUrl(next));
    });
  }

  toggleTheme(): void {
    this.theme.set(this.theme() === 'marvel' ? 'dc' : 'marvel');
    this.characters.set([]);
    this.selectedCharacter.set(null);
  }

  setTab(tab: AppTab): void {
    this.activeTab.set(tab);
    this.selectedCharacter.set(null);
  }

  onResults(chars: Character[]): void {
    this.characters.set(chars);
    this.selectedCharacter.set(null);
  }

  onLoadingChange(val: boolean): void {
    this.loading.set(val);
  }
  onSelectCharacter(char: Character): void {
    this.selectedCharacter.set(char);
  }
  onCloseDetail(): void {
    this.selectedCharacter.set(null);
  }

  private applyUrlState(): void {
    const state = parseUrl(location.search);
    this.activeTab.set(state.tab);
    if (this.theme() !== state.theme) {
      this.theme.set(state.theme);
      this.characters.set([]);
    }
    if (!state.heroe) {
      this.selectedCharacter.set(null);
      this.pendingSlug.set(null);
      return;
    }
    if (this.selectedCharacter()?.slug === state.heroe) return;
    this.pendingSlug.set(state.heroe);
    this.heroService.getBySlug(state.heroe).subscribe((char) => {
      if (this.pendingSlug() !== state.heroe) return;
      this.selectedCharacter.set(char ?? null);
      this.pendingSlug.set(null);
    });
  }

  // Cambiar de tab o de editorial, o abrir un detalle, agrega una entrada al historial (así "atrás" lo deshace).
  // Cerrar un detalle abierto desde la app vuelve atrás en el historial en lugar de apilar otra entrada.
  private writeUrl(next: string): void {
    const current = location.pathname + location.search;
    if (next === current) return;

    const prev = parseUrl(location.search);
    const target = parseUrl(new URL(next, location.origin).search);
    const sameView = prev.tab === target.tab && prev.theme === target.theme;
    const closingOwnModal = prev.heroe && !target.heroe && sameView && history.state?.modal;

    if (closingOwnModal) {
      history.back();
    } else if (!sameView || (!prev.heroe && target.heroe)) {
      history.pushState({ modal: !!target.heroe }, '', next);
    } else {
      history.replaceState(history.state, '', next);
    }
  }
}
