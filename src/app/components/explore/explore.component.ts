import { Component, Input, Output, EventEmitter, OnChanges, inject, signal, computed, DOCUMENT, ChangeDetectionStrategy } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HeroService } from '../../services/hero.service';
import { Character, Publisher } from '../../models/character';
import { SkeletonCardComponent } from '../skeleton-card/skeleton-card.component';
import { initials, statVal } from '../../utils/hero-utils';

type AlignmentFilter = 'all' | 'good' | 'bad' | 'neutral';
type SortKey = 'name' | 'intelligence' | 'strength' | 'speed' | 'durability' | 'power' | 'combat';

import { ClickableDirective } from '../../directives/clickable.directive';

@Component({
    selector: 'app-explore',
    imports: [FormsModule, SkeletonCardComponent, ClickableDirective],
    templateUrl: './explore.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './explore.component.css'
})
export class ExploreComponent implements OnChanges {
  @Input() publisher: Publisher = 'Marvel Comics';
  @Input() isDC = false;
  @Output() selectCharacter = new EventEmitter<Character>();

  private readonly heroService = inject(HeroService);
  private readonly doc = inject(DOCUMENT);

  private all = signal<Character[]>([]);
  loading = signal(true);
  skeletons = Array(20).fill(0);
  alignment = signal<AlignmentFilter>('all');
  sortBy = signal<SortKey>('name');
  page = signal(0);
  readonly pageSize = 20;

  initials = initials;

  alignments: { value: AlignmentFilter; label: string }[] = [
    { value: 'all',     label: 'Todos' },
    { value: 'good',    label: 'Héroes' },
    { value: 'bad',     label: 'Villanos' },
    { value: 'neutral', label: 'Neutrales' },
  ];

  sortOptions: { value: SortKey; label: string }[] = [
    { value: 'name',          label: 'Nombre' },
    { value: 'intelligence',  label: 'Inteligencia' },
    { value: 'strength',      label: 'Fuerza' },
    { value: 'speed',         label: 'Velocidad' },
    { value: 'durability',    label: 'Durabilidad' },
    { value: 'power',         label: 'Poder' },
    { value: 'combat',        label: 'Combate' },
  ];

  filtered = computed(() => {
    let list = this.all();
    const al = this.alignment();
    if (al !== 'all') list = list.filter(c => c.biography.alignment === al);
    const sk = this.sortBy();
    if (sk === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else list = [...list].sort((a, b) => statVal(b, sk) - statVal(a, sk));
    return list;
  });

  paged = computed(() => {
    const start = this.page() * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  totalPages = computed(() => Math.ceil(this.filtered().length / this.pageSize));

  ngOnChanges(): void {
    this.page.set(0);
    this.loading.set(true);
    this.heroService.getByPublisher(this.publisher).subscribe(c => {
      this.all.set(c);
      this.loading.set(false);
    });
  }

  setAlignment(a: AlignmentFilter): void { this.alignment.set(a); this.page.set(0); this.scrollToTop(); }
  setSortBy(s: SortKey): void { this.sortBy.set(s); this.page.set(0); this.scrollToTop(); }
  prevPage(): void { if (this.page() > 0) { this.page.update(p => p - 1); this.scrollToTop(); } }
  nextPage(): void { if (this.page() < this.totalPages() - 1) { this.page.update(p => p + 1); this.scrollToTop(); } }

  private scrollToTop(): void {
    /* istanbul ignore next */
    if (this.doc.defaultView) {
      this.doc.defaultView.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLElement;
    img.style.display = 'none';
    const placeholder = img.closest('.hero-img-wrapper')?.querySelector('.img-placeholder') as HTMLElement;
    if (placeholder) placeholder.style.display = 'flex';
  }
}
