import type { MockedObject } from "vitest";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RandomHeroComponent } from './random-hero.component';
import { HeroService } from '../../services/hero.service';
import { mockCharacter } from '../../testing/mock-character';
import { of } from 'rxjs';

describe('RandomHeroComponent', () => {
    let component: RandomHeroComponent;
    let fixture: ComponentFixture<RandomHeroComponent>;
    let heroSvc: MockedObject<HeroService>;

    beforeEach(async () => {
        heroSvc = {
            getRandom: vi.fn().mockName("HeroService.getRandom")
        } as unknown as MockedObject<HeroService>;
        heroSvc.getRandom.mockReturnValue(of(mockCharacter()));

        await TestBed.configureTestingModule({
            imports: [RandomHeroComponent],
            providers: [{ provide: HeroService, useValue: heroSvc }],
        }).compileComponents();

        fixture = TestBed.createComponent(RandomHeroComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => expect(component).toBeTruthy());

    it('surprise() should call getRandom with current publisher', () => {
        component.publisher = 'DC Comics';
        component.surprise();
        expect(heroSvc.getRandom).toHaveBeenCalledWith('DC Comics');
    });

    it('surprise() should emit selectCharacter with the returned char', () => {
        const char = mockCharacter({ id: 99, name: 'Wolverine' });
        heroSvc.getRandom.mockReturnValue(of(char));
        vi.spyOn(component.selectCharacter, 'emit').mockReturnValue(undefined);
        component.surprise();
        expect(component.selectCharacter.emit).toHaveBeenCalledWith(char);
    });
});
