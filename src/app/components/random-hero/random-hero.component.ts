import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';
import { HeroService } from '../../services/hero.service';
import { Character, Publisher } from '../../models/character';

@Component({
    selector: 'app-random-hero',
    imports: [],
    templateUrl: './random-hero.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './random-hero.component.css'
})
export class RandomHeroComponent {
  @Input() publisher: Publisher = 'Marvel Comics';
  @Input() isDC = false;
  @Output() selectCharacter = new EventEmitter<Character>();

  private readonly heroService = inject(HeroService);

  surprise(): void {
    this.heroService.getRandom(this.publisher).subscribe(char => {
      this.selectCharacter.emit(char);
    });
  }
}
