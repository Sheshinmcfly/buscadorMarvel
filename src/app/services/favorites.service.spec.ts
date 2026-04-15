import { TestBed } from '@angular/core/testing';
import { FavoritesService } from './favorites.service';
import { mockCharacter } from '../testing/mock-character';

const KEY = 'buscadorMarvel_favorites';

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesService);
  });

  afterEach(() => localStorage.clear());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start empty when localStorage is empty', () => {
    expect(service.count()).toBe(0);
    expect(service.all()).toEqual([]);
  });

  it('should load favorites from localStorage on init', () => {
    const char = mockCharacter();
    localStorage.setItem(KEY, JSON.stringify([char]));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const fresh = TestBed.inject(FavoritesService);
    expect(fresh.count()).toBe(1);
    expect(fresh.all()[0].id).toBe(char.id);
  });

  it('should return empty array if localStorage has invalid JSON', () => {
    localStorage.setItem(KEY, 'not-json{{{');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const fresh = TestBed.inject(FavoritesService);
    expect(fresh.count()).toBe(0);
  });

  describe('isFavorite', () => {
    it('should return false when character is not in favorites', () => {
      expect(service.isFavorite(1)).toBeFalse();
    });

    it('should return true after adding character', () => {
      service.toggle(mockCharacter({ id: 5 }));
      expect(service.isFavorite(5)).toBeTrue();
    });
  });

  describe('toggle', () => {
    it('should add character when not in favorites', () => {
      const char = mockCharacter({ id: 10 });
      service.toggle(char);
      expect(service.count()).toBe(1);
      expect(service.isFavorite(10)).toBeTrue();
    });

    it('should remove character when already in favorites', () => {
      const char = mockCharacter({ id: 10 });
      service.toggle(char);
      service.toggle(char);
      expect(service.count()).toBe(0);
      expect(service.isFavorite(10)).toBeFalse();
    });

    it('should persist to localStorage after toggle', () => {
      const char = mockCharacter({ id: 7 });
      service.toggle(char);
      const stored = JSON.parse(localStorage.getItem(KEY)!);
      expect(stored.length).toBe(1);
      expect(stored[0].id).toBe(7);
    });

    it('should remove from localStorage when toggled off', () => {
      const char = mockCharacter({ id: 7 });
      service.toggle(char);
      service.toggle(char);
      const stored = JSON.parse(localStorage.getItem(KEY)!);
      expect(stored.length).toBe(0);
    });

    it('should handle multiple characters independently', () => {
      const a = mockCharacter({ id: 1 });
      const b = mockCharacter({ id: 2 });
      service.toggle(a);
      service.toggle(b);
      expect(service.count()).toBe(2);
      service.toggle(a);
      expect(service.count()).toBe(1);
      expect(service.isFavorite(1)).toBeFalse();
      expect(service.isFavorite(2)).toBeTrue();
    });
  });
});
