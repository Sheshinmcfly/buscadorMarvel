import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener, inject, DOCUMENT, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';


import { Character } from '../../models/character';
import { FavoritesService } from '../../services/favorites.service';
import { STATS, statVal, alignmentLabel, alignmentClass, initials } from '../../utils/hero-utils';
import { translateEyes, translateGender, translateHair, translateRace } from '../../utils/translate';

@Component({
    selector: 'app-character-detail',
    imports: [],
    templateUrl: './character-detail.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
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
  translateGender = translateGender;
  translateRace = translateRace;
  translateEyes = translateEyes;
  translateHair = translateHair;

  @ViewChild('panel', { static: true }) private panel!: ElementRef<HTMLElement>;
  private opener: HTMLElement | null = null;

  ngOnInit(): void {
    this.opener = this.doc.activeElement as HTMLElement | null;
    this.doc.body.style.overflow = 'hidden';
    this.doc.documentElement.style.overflow = 'hidden';
    this.panel.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.doc.body.style.overflow = '';
    this.doc.documentElement.style.overflow = '';
    // Devuelve el foco a quien abrió el detalle (si sigue en la página).
    if (this.opener?.isConnected) this.opener.focus();
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
    return !val || val === '-' || val.toLowerCase().includes('unknown') || val === 'No alter egos found.';
  }
}
