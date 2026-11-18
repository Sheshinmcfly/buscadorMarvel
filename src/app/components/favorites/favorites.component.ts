import { Component, inject, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { FavoritesService } from '../../services/favorites.service';
import { Character } from '../../models/character';
import { alignmentClass, alignmentLabel, initials } from '../../utils/hero-utils';

@Component({
    selector: 'app-favorites',
    imports: [],
    templateUrl: './favorites.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './favorites.component.css'
})
export class FavoritesComponent {
  favSvc = inject(FavoritesService);
  @Output() selectCharacter = new EventEmitter<Character>();

  initials = initials;
  alignmentLabel = alignmentLabel;
  alignmentClass = alignmentClass;

  onImgError(event: Event): void {
    const img = event.target as HTMLElement;
    img.style.display = 'none';
    const placeholder = img.closest('.fav-img-wrapper')?.querySelector('.fav-placeholder') as HTMLElement;
    if (placeholder) placeholder.style.display = 'flex';
  }
}
