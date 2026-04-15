import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Character } from '../../models/character';
import { FavoritesService } from '../../services/favorites.service';
import { STATS, statVal, alignmentLabel, alignmentClass, initials } from '../../utils/hero-utils';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-detail.component.html',
  styleUrl: './character-detail.component.css'
})
export class CharacterDetailComponent implements OnInit, OnDestroy {
  @Input() character!: Character;
  @Input() isDC = false;
  @Output() close = new EventEmitter<void>();

  favSvc = inject(FavoritesService);
  private doc = inject(DOCUMENT);

  stats = STATS;
  alignmentLabel = alignmentLabel;
  alignmentClass = alignmentClass;
  initials = initials;

  ngOnInit(): void {
    this.doc.body.style.overflow = 'hidden';
    this.doc.documentElement.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    this.doc.body.style.overflow = '';
    this.doc.documentElement.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }

  statValue(key: string): number {
    return statVal(this.character, key);
  }

  statColor(value: number): string {
    if (value >= 80) return 'bg-success';
    if (value >= 50) return 'bg-warning';
    return 'bg-danger';
  }

  get aliases(): string {
    const a = this.character.biography.aliases;
    return Array.isArray(a) ? a.join(', ') : a;
  }

  imgFailed = false;

  onImgError(): void { this.imgFailed = true; }

  isUnknown(val: string | string[]): boolean {
    if (Array.isArray(val)) return val.every(v => v === '-' || v.toLowerCase().includes('unknown'));
    return !val || val === '-' || val.toLowerCase().includes('unknown');
  }
}
