import { Injectable, signal, computed } from '@angular/core';
import { Character } from '../models/character';

const STORAGE_KEY = 'buscadorMarvel_favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private _favorites = signal<Character[]>(this.load());

  count = computed(() => this._favorites().length);
  all = computed(() => this._favorites());

  isFavorite(id: number): boolean {
    return this._favorites().some(c => c.id === id);
  }

  toggle(char: Character): void {
    const current = this._favorites();
    const exists = current.some(c => c.id === char.id);
    const updated = exists ? current.filter(c => c.id !== char.id) : [...current, char];
    this._favorites.set(updated);
    this.save(updated);
  }

  private load(): Character[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  private save(chars: Character[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chars));
  }
}
