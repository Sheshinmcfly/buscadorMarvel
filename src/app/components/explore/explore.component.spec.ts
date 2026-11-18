import type { MockedObject } from "vitest";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExploreComponent } from './explore.component';
import { HeroService } from '../../services/hero.service';
import { mockCharacter } from '../../testing/mock-character';
import { of } from 'rxjs';
import { Character } from '../../models/character';

function makeChars(n: number, alignment: 'good' | 'bad' | 'neutral' = 'good'): Character[] {
    return Array.from({ length: n }, (_, i) => mockCharacter({ id: i + 1, name: `Hero ${i + 1}`, biography: { ...mockCharacter().biography, alignment } }));
}

describe('ExploreComponent', () => {
    let component: ExploreComponent;
    let fixture: ComponentFixture<ExploreComponent>;
    let heroSvc: MockedObject<HeroService>;

    const twentyFiveChars = makeChars(25);

    beforeEach(async () => {
        heroSvc = {
            getByPublisher: vi.fn().mockName("HeroService.getByPublisher")
        } as unknown as MockedObject<HeroService>;
        heroSvc.getByPublisher.mockReturnValue(of(twentyFiveChars));

        await TestBed.configureTestingModule({
            imports: [ExploreComponent],
            providers: [{ provide: HeroService, useValue: heroSvc }],
        }).compileComponents();

        fixture = TestBed.createComponent(ExploreComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.ngOnChanges();
    });

    it('should create', () => expect(component).toBeTruthy());

    it('should load characters on init and set loading false', () => {
        expect(component.loading()).toBe(false);
        expect(component.filtered().length).toBe(25);
    });

    it('should show first page of 20', () => {
        expect(component.paged().length).toBe(20);
        expect(component.totalPages()).toBe(2);
    });

    it('should go to next page', () => {
        component.nextPage();
        expect(component.page()).toBe(1);
        expect(component.paged().length).toBe(5);
    });

    it('should not go before page 0', () => {
        component.prevPage();
        expect(component.page()).toBe(0);
    });

    it('should go prev after next', () => {
        component.nextPage();
        component.prevPage();
        expect(component.page()).toBe(0);
    });

    it('should not exceed last page', () => {
        component.nextPage();
        component.nextPage();
        expect(component.page()).toBe(1);
    });

    it('should filter by alignment', () => {
        const mixed = [
            ...makeChars(3, 'good'),
            ...makeChars(2, 'bad'),
            ...makeChars(1, 'neutral'),
        ];
        heroSvc.getByPublisher.mockReturnValue(of(mixed));
        component.ngOnChanges();
        component.setAlignment('bad');
        expect(component.filtered().length).toBe(2);
        expect(component.filtered().every(c => c.biography.alignment === 'bad')).toBe(true);
    });

    it('should reset page when alignment changes', () => {
        component.nextPage();
        component.setAlignment('good');
        expect(component.page()).toBe(0);
    });

    it('should sort by name ascending', () => {
        component.setSortBy('name');
        const names = component.filtered().map(c => c.name);
        expect(names).toEqual([...names].sort());
    });

    it('should sort by stat descending', () => {
        heroSvc.getByPublisher.mockReturnValue(of([
            mockCharacter({ id: 1, powerstats: { intelligence: 50, strength: 100, speed: 50, durability: 50, power: 50, combat: 50 } }),
            mockCharacter({ id: 2, powerstats: { intelligence: 50, strength: 20, speed: 50, durability: 50, power: 50, combat: 50 } }),
        ]));
        component.ngOnChanges();
        component.setSortBy('strength');
        expect(component.filtered()[0].powerstats.strength).toBe(100);
    });

    it('should reset page when sort changes', () => {
        component.nextPage();
        component.setSortBy('strength');
        expect(component.page()).toBe(0);
    });

    it('should reload when publisher changes', () => {
        component.publisher = 'DC Comics';
        component.ngOnChanges();
        expect(heroSvc.getByPublisher).toHaveBeenCalledWith('DC Comics');
    });

    it('should emit selectCharacter', () => {
        vi.spyOn(component.selectCharacter, 'emit').mockReturnValue(undefined);
        component.selectCharacter.emit(twentyFiveChars[0]);
        expect(component.selectCharacter.emit).toHaveBeenCalledWith(twentyFiveChars[0]);
    });

    it('initials should return uppercase initials', () => {
        expect(component.initials('Peter Parker')).toBe('PP');
    });

    it('onImgError should hide img and show placeholder', () => {
        const wrapper = document.createElement('div');
        wrapper.className = 'hero-img-wrapper';
        const img = document.createElement('img');
        const ph = document.createElement('div');
        ph.className = 'img-placeholder';
        ph.style.display = 'none';
        wrapper.appendChild(img);
        wrapper.appendChild(ph);
        component.onImgError({ target: img } as unknown as Event);
        expect(img.style.display).toBe('none');
        expect(ph.style.display).toBe('flex');
    });
});
