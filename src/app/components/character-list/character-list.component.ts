import { Component, Input, Output, EventEmitter, OnChanges, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Character } from '../../models/character';
import { SkeletonCardComponent } from '../skeleton-card/skeleton-card.component';
import { alignmentClass, alignmentLabel, initials, statVal } from '../../utils/hero-utils';

type AlignmentFilter = 'all' | 'good' | 'bad' | 'neutral';
type SortKey = 'name' | 'intelligence' | 'strength' | 'speed' | 'durability' | 'power' | 'combat';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SkeletonCardComponent],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.css'
})
export class CharacterListComponent implements OnChanges {
  @Input() characters: Character[] = [];
  @Input() isDC = false;
  @Input() loading = false;
  @Output() selectCharacter = new EventEmitter<Character>();

  skeletons = Array(8).fill(0);

  private allChars = signal<Character[]>([]);
  alignment = signal<AlignmentFilter>('all');
  sortBy = signal<SortKey>('name');

  alignments: { value: AlignmentFilter; label: string }[] = [
    { value: 'all',     label: 'Todos' },
    { value: 'good',    label: 'Héroes' },
    { value: 'bad',     label: 'Villanos' },
    { value: 'neutral', label: 'Neutrales' },
  ];

  sortOptions: { value: SortKey; label: string }[] = [
    { value: 'name',         label: 'Nombre' },
    { value: 'intelligence', label: 'Inteligencia' },
    { value: 'strength',     label: 'Fuerza' },
    { value: 'speed',        label: 'Velocidad' },
    { value: 'durability',   label: 'Durabilidad' },
    { value: 'power',        label: 'Poder' },
    { value: 'combat',       label: 'Combate' },
  ];

  displayed = computed(() => {
    let list = this.allChars();
    const al = this.alignment();
    if (al !== 'all') list = list.filter(c => c.biography.alignment === al);
    const sk = this.sortBy();
    if (sk === 'name') return [...list].sort((a, b) => a.name.localeCompare(b.name));
    return [...list].sort((a, b) => statVal(b, sk) - statVal(a, sk));
  });

  ngOnChanges(): void {
    this.allChars.set(this.characters);
    this.alignment.set('all');
    this.sortBy.set('name');
  }

  setAlignment(a: AlignmentFilter): void { this.alignment.set(a); }
  setSortBy(s: SortKey): void { this.sortBy.set(s); }

  alignmentLabel = alignmentLabel;
  alignmentClass = alignmentClass;
  initials = initials;

  trackById(_: number, char: Character): number { return char.id; }

  onImgError(event: Event): void {
    const img = event.target as HTMLElement;
    img.style.display = 'none';
    const placeholder = img.closest('.hero-img-wrapper')?.querySelector('.img-placeholder') as HTMLElement;
    if (placeholder) placeholder.style.display = 'flex';
  }
}
