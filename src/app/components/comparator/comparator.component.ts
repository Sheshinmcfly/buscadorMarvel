import { Component, Input, Output, EventEmitter, inject, signal, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { HeroService } from '../../services/hero.service';
import { Character, Publisher } from '../../models/character';
import { STATS, statVal } from '../../utils/hero-utils';

import { ClickableDirective } from '../../directives/clickable.directive';

@Component({
    selector: 'app-comparator',
    imports: [FormsModule, ClickableDirective],
    templateUrl: './comparator.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './comparator.component.css'
})
export class ComparatorComponent implements OnInit, OnDestroy {
  @Input() publisher: Publisher = 'Marvel Comics';
  @Input() isDC = false;
  @Output() selectCharacter = new EventEmitter<Character>();

  private readonly heroService = inject(HeroService);

  queryA = signal('');
  queryB = signal('');
  resultsA = signal<Character[]>([]);
  resultsB = signal<Character[]>([]);
  heroA = signal<Character | null>(null);
  heroB = signal<Character | null>(null);

  stats = STATS;
  statVal = statVal;

  private queryA$ = new Subject<string>();
  private queryB$ = new Subject<string>();
  private subs = new Subscription();

  ngOnInit(): void {
    this.subs.add(
      this.queryA$.pipe(
        debounceTime(300),
        switchMap(q => this.heroService.search(q, this.publisher))
      ).subscribe(r => this.resultsA.set(r.slice(0, 6)))
    );
    this.subs.add(
      this.queryB$.pipe(
        debounceTime(300),
        switchMap(q => this.heroService.search(q, this.publisher))
      ).subscribe(r => this.resultsB.set(r.slice(0, 6)))
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  searchA(q: string): void {
    this.queryA.set(q);
    if (q.length < 2) { this.resultsA.set([]); return; }
    this.queryA$.next(q);
  }

  searchB(q: string): void {
    this.queryB.set(q);
    if (q.length < 2) { this.resultsB.set([]); return; }
    this.queryB$.next(q);
  }

  selectA(char: Character): void {
    this.heroA.set(char);
    this.queryA.set(char.name);
    this.resultsA.set([]);
  }

  selectB(char: Character): void {
    this.heroB.set(char);
    this.queryB.set(char.name);
    this.resultsB.set([]);
  }

  clearA(): void {
    this.heroA.set(null);
    this.queryA.set('');
    this.resultsA.set([]);
  }

  clearB(): void {
    this.heroB.set(null);
    this.queryB.set('');
    this.resultsB.set([]);
  }

  winner(key: string): 'A' | 'B' | 'tie' | null {
    const a = this.heroA(), b = this.heroB();
    if (!a || !b) return null;
    const va = statVal(a, key), vb = statVal(b, key);
    if (va > vb) return 'A';
    if (vb > va) return 'B';
    return 'tie';
  }

  overallWinner(): 'A' | 'B' | 'tie' | null {
    const a = this.heroA(), b = this.heroB();
    if (!a || !b) return null;
    const sumA = this.stats.reduce((s, st) => s + statVal(a, st.key), 0);
    const sumB = this.stats.reduce((s, st) => s + statVal(b, st.key), 0);
    if (sumA > sumB) return 'A';
    if (sumB > sumA) return 'B';
    return 'tie';
  }

  reset(): void {
    this.clearA();
    this.clearB();
  }
}
