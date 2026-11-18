import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { Character, Publisher } from '../models/character';

// Akabab API has a data corruption where some characters have an alias/alternate
// identity name in the publisher field instead of the real publisher.
// These sets include the corrupted values identified for each universe.
const DC_PUBLISHERS = new Set([
  'DC Comics', 'Wildstorm',
  // Corrupted entries (DC character alias used as publisher):
  'Aztar', 'Batman II', 'Batgirl', 'Batgirl III', 'Batgirl V',
  'Black Racer', 'Flash IV', 'Impulse', 'Nightwing',
  'Oracle', 'Red Hood', 'Red Robin', 'Robin II', 'Robin III',
  'Speed Demon', 'Spoiler', 'Superman Prime One-Million',
]);

const MARVEL_PUBLISHERS = new Set([
  'Marvel Comics',
  // Corrupted entries (Marvel character alias used as publisher):
  'Angel', 'Ant-Man', 'Anti-Venom', 'Anti-Vision', 'Archangel',
  'Binary', 'Boom-Boom', 'Deadpool', 'Evil Deadpool', 'Gemini V',
  'Giant-Man', 'Goliath', 'Iron Lad', 'Jean Grey', 'Meltdown',
  'Ms Marvel II', 'Phoenix', 'Power Man', 'Power Woman',
  'Rune King Thor', 'Scorpion', 'She-Thing', 'Spider-Carnage',
  'Tempest', 'Thunderbird II', 'Toxin', 'Venom III', 'Vindicator II',
]);

function matchesPublisher(char: Character, publisher: Publisher): boolean {
  const set = publisher === 'Marvel Comics' ? MARVEL_PUBLISHERS : DC_PUBLISHERS;
  return set.has(char.biography.publisher ?? '');
}

@Injectable({ providedIn: 'root' })
export class HeroService {
  private readonly http = inject(HttpClient);
  // Copia local del dataset (scripts/build-data.mjs) para no depender de un servidor externo.
  private readonly allUrl = 'assets/data/heroes.json';

  private all$: Observable<Character[]> = this.http.get<Character[]>(this.allUrl).pipe(
    shareReplay(1)
  );

  search(name: string, publisher: Publisher): Observable<Character[]> {
    const query = name.toLowerCase().trim();
    return this.all$.pipe(
      map(chars => chars.filter(c =>
        matchesPublisher(c, publisher) &&
        c.name.toLowerCase().includes(query)
      ))
    );
  }

  getByPublisher(publisher: Publisher): Observable<Character[]> {
    return this.all$.pipe(
      map(chars => chars.filter(c => matchesPublisher(c, publisher)))
    );
  }

  getRandom(publisher: Publisher): Observable<Character> {
    return this.getByPublisher(publisher).pipe(
      map(chars => chars[Math.floor(Math.random() * chars.length)])
    );
  }
}
