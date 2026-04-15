import { Component, signal, computed, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
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
import { Character, Theme, Publisher } from './models/character';

export type AppTab = 'search' | 'compare' | 'rankings' | 'explore' | 'favorites';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeroBackgroundComponent, SearchComponent, CharacterListComponent,
    CharacterDetailComponent, ComparatorComponent, TopRankingsComponent,
    ExploreComponent, RandomHeroComponent, FavoritesComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private doc = inject(DOCUMENT);
  favSvc = inject(FavoritesService);

  theme = signal<Theme>('marvel');
  activeTab = signal<AppTab>('search');
  characters = signal<Character[]>([]);
  selectedCharacter = signal<Character | null>(null);
  loading = signal(false);

  constructor() {
    effect(() => {
      const dc = this.isDC();
      const root = this.doc.documentElement.style;
      root.setProperty('--primary',      dc ? '#1a53a0' : '#B7000D');
      root.setProperty('--primary-dark', dc ? '#0d3370' : '#7a0009');
      root.setProperty('--accent',       dc ? '#2a6dd9' : '#e8000f');
      root.setProperty('--bg',           dc ? '#000d1a' : '#1a0003');
      root.setProperty('--card-bg',      dc ? '#001229' : '#2a0005');
      root.setProperty('--navbar-bg',    dc ? '#00080f' : '#0d0001');
      root.setProperty('--text',         dc ? '#f0f4ff' : '#f5f5f5');
    });
  }

  publisher = computed<Publisher>(() =>
    this.theme() === 'marvel' ? 'Marvel Comics' : 'DC Comics'
  );
  isDC = computed(() => this.theme() === 'dc');

  tabs: { id: AppTab; label: string; icon: string }[] = [
    { id: 'search',    label: 'Buscar',    icon: 'bi-search' },
    { id: 'compare',   label: 'Comparar',  icon: 'bi-subtract' },
    { id: 'rankings',  label: 'Rankings',  icon: 'bi-trophy-fill' },
    { id: 'explore',   label: 'Explorar',  icon: 'bi-grid-3x3-gap-fill' },
    { id: 'favorites', label: 'Favoritos', icon: 'bi-heart-fill' },
  ];

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

  onLoadingChange(val: boolean): void { this.loading.set(val); }
  onSelectCharacter(char: Character): void { this.selectedCharacter.set(char); }
  onCloseDetail(): void { this.selectedCharacter.set(null); }
}
