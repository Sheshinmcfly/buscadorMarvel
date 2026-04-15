import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { HeroService } from './hero.service';
import { mockCharacter, mockDCCharacter } from '../testing/mock-character';
import { Character } from '../models/character';

const API_URL = 'https://akabab.github.io/superhero-api/api/all.json';

describe('HeroService', () => {
  let service: HeroService;
  let http: HttpTestingController;

  const marvelChars: Character[] = [
    mockCharacter({ id: 1, name: 'Spider-Man', biography: { ...mockCharacter().biography, publisher: 'Marvel Comics', alignment: 'good' } }),
    mockCharacter({ id: 2, name: 'Iron Man',   biography: { ...mockCharacter().biography, publisher: 'Marvel Comics', alignment: 'good' } }),
    mockCharacter({ id: 3, name: 'Venom',       biography: { ...mockCharacter().biography, publisher: 'Marvel Comics', alignment: 'bad' } }),
    // Corrupted Marvel publisher
    mockCharacter({ id: 4, name: 'Angel',       biography: { ...mockCharacter().biography, publisher: 'Archangel',     alignment: 'good' } }),
  ];

  const dcChars: Character[] = [
    mockDCCharacter({ id: 10, name: 'Batman',    biography: { ...mockDCCharacter().biography, publisher: 'DC Comics',                  alignment: 'good' } }),
    mockDCCharacter({ id: 11, name: 'Nightwing', biography: { ...mockDCCharacter().biography, publisher: 'Batman II',                  alignment: 'good' } }),
    mockDCCharacter({ id: 12, name: 'Superman',  biography: { ...mockDCCharacter().biography, publisher: 'Superman Prime One-Million', alignment: 'good' } }),
    mockDCCharacter({ id: 13, name: 'Joker',     biography: { ...mockDCCharacter().biography, publisher: 'DC Comics',                  alignment: 'bad' } }),
  ];

  // Character with null publisher (should be excluded from all publishers)
  const nullPublisherChar = mockCharacter({ id: 99, biography: { ...mockCharacter().biography, publisher: null as any } });

  const allChars = [...marvelChars, ...dcChars, nullPublisherChar];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(HeroService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  function flushAll(): void {
    http.expectOne(API_URL).flush(allChars);
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getByPublisher', () => {
    it('should return Marvel characters (including corrupted publishers)', (done) => {
      service.getByPublisher('Marvel Comics').subscribe(chars => {
        expect(chars.length).toBe(4);
        expect(chars.map(c => c.name)).toContain('Angel');
        done();
      });
      flushAll();
    });

    it('should return DC characters (including corrupted publishers)', (done) => {
      service.getByPublisher('DC Comics').subscribe(chars => {
        expect(chars.length).toBe(4);
        expect(chars.map(c => c.name)).toContain('Nightwing');
        expect(chars.map(c => c.name)).toContain('Superman');
        done();
      });
      flushAll();
    });

    it('should exclude characters with null publisher', (done) => {
      service.getByPublisher('Marvel Comics').subscribe(chars => {
        expect(chars.every(c => c.biography.publisher !== null)).toBeTrue();
        done();
      });
      flushAll();
    });

    it('should cache the HTTP request (only one call)', (done) => {
      let calls = 0;
      service.getByPublisher('Marvel Comics').subscribe(() => calls++);
      service.getByPublisher('DC Comics').subscribe(() => {
        expect(calls).toBe(1);
        done();
      });
      flushAll();
    });
  });

  describe('search', () => {
    it('should filter by name (case-insensitive)', (done) => {
      service.search('spider', 'Marvel Comics').subscribe(chars => {
        expect(chars.length).toBe(1);
        expect(chars[0].name).toBe('Spider-Man');
        done();
      });
      flushAll();
    });

    it('should return empty array when no match', (done) => {
      service.search('xyz123', 'Marvel Comics').subscribe(chars => {
        expect(chars.length).toBe(0);
        done();
      });
      flushAll();
    });

    it('should only return characters of the requested publisher', (done) => {
      service.search('man', 'Marvel Comics').subscribe(chars => {
        chars.forEach(c => expect(['Marvel Comics','Archangel']).toContain(c.biography.publisher));
        done();
      });
      flushAll();
    });

    it('should match partial names', (done) => {
      service.search('iron', 'Marvel Comics').subscribe(chars => {
        expect(chars[0].name).toBe('Iron Man');
        done();
      });
      flushAll();
    });
  });

  describe('getRandom', () => {
    it('should return a Marvel character', (done) => {
      service.getRandom('Marvel Comics').subscribe(char => {
        expect(['Spider-Man','Iron Man','Venom','Angel']).toContain(char.name);
        done();
      });
      flushAll();
    });

    it('should return a DC character', (done) => {
      service.getRandom('DC Comics').subscribe(char => {
        expect(['Batman','Nightwing','Superman','Joker']).toContain(char.name);
        done();
      });
      flushAll();
    });
  });
});
