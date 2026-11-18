import { Component, Input, Output, EventEmitter, OnChanges, inject, signal, ChangeDetectionStrategy } from '@angular/core';

import { HeroService } from '../../services/hero.service';
import { Character, Publisher } from '../../models/character';
import { STATS, statVal, totalPower } from '../../utils/hero-utils';

interface StatRanking {
  key: string;
  label: string;
  icon: string;
  top: Character[];
}

import { ClickableDirective } from '../../directives/clickable.directive';

@Component({
    selector: 'app-top-rankings',
    imports: [ClickableDirective],
    templateUrl: './top-rankings.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './top-rankings.component.css'
})
export class TopRankingsComponent implements OnChanges {
  @Input() publisher: Publisher = 'Marvel Comics';
  @Input() isDC = false;
  @Output() selectCharacter = new EventEmitter<Character>();

  private readonly heroService = inject(HeroService);

  rankings = signal<StatRanking[]>([]);
  loading = signal(true);
  skeletonRows = [0, 1, 2, 3, 4];
  statDefs = STATS;

  ngOnChanges(): void {
    this.loading.set(true);
    this.heroService.getByPublisher(this.publisher).subscribe(chars => {
      this.rankings.set(this.statDefs.map(stat => ({
        ...stat,
        top: [...chars]
          .filter(c => statVal(c, stat.key) > 0)
          // Muchos personajes empatan en 100: se desempata por el total de estadísticas.
          .sort((a, b) => statVal(b, stat.key) - statVal(a, stat.key) || totalPower(b) - totalPower(a))
          .slice(0, 5)
      })));
      this.loading.set(false);
    });
  }

  statValue = statVal;
}
