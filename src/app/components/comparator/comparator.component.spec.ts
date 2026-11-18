import type { MockedObject } from "vitest";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComparatorComponent } from './comparator.component';
import { HeroService } from '../../services/hero.service';
import { mockCharacter } from '../../testing/mock-character';
import { of } from 'rxjs';

describe('ComparatorComponent', () => {
    let component: ComparatorComponent;
    let fixture: ComponentFixture<ComparatorComponent>;
    let heroSvc: MockedObject<HeroService>;

    const charA = mockCharacter({ id: 1, name: 'Alpha', powerstats: { intelligence: 90, strength: 80, speed: 70, durability: 60, power: 50, combat: 40 } });
    const charB = mockCharacter({ id: 2, name: 'Beta', powerstats: { intelligence: 40, strength: 50, speed: 60, durability: 70, power: 80, combat: 90 } });

    beforeEach(async () => {
        heroSvc = {
            search: vi.fn().mockName("HeroService.search")
        } as unknown as MockedObject<HeroService>;
        heroSvc.search.mockReturnValue(of([]));

        await TestBed.configureTestingModule({
            imports: [ComparatorComponent],
            providers: [{ provide: HeroService, useValue: heroSvc }],
        }).compileComponents();

        fixture = TestBed.createComponent(ComparatorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => expect(component).toBeTruthy());

    describe('searchA / searchB', () => {
        beforeEach(() => vi.useFakeTimers());
        afterEach(() => vi.useRealTimers());

        it('should not search when query < 2 chars', () => {
            component.searchA('a');
            expect(heroSvc.search).not.toHaveBeenCalled();
            expect(component.resultsA()).toEqual([]);
        });

        it('should search and slice to 6 results for A', () => {
            const many = Array.from({ length: 10 }, (_, i) => mockCharacter({ id: i }));
            heroSvc.search.mockReturnValue(of(many));
            component.searchA('spider');
            vi.advanceTimersByTime(300);
            expect(component.resultsA().length).toBe(6);
        });

        it('should clear resultsB when queryB < 2', () => {
            component.searchB('x');
            expect(component.resultsB()).toEqual([]);
        });

        it('should search for B', () => {
            heroSvc.search.mockReturnValue(of([charB]));
            component.searchB('beta');
            vi.advanceTimersByTime(300);
            expect(component.resultsB().length).toBe(1);
        });

        it('should debounce rapid searches (only last query hits API)', () => {
            heroSvc.search.mockReturnValue(of([charA]));
            component.searchA('sp');
            component.searchA('spi');
            component.searchA('spid');
            vi.advanceTimersByTime(300);
            expect(heroSvc.search).toHaveBeenCalledTimes(1);
            expect(heroSvc.search).toHaveBeenCalledWith('spid', 'Marvel Comics');
        });
    });

    describe('selectA / selectB', () => {
        it('should set heroA and clear results', () => {
            component.selectA(charA);
            expect(component.heroA()).toEqual(charA);
            expect(component.queryA()).toBe(charA.name);
            expect(component.resultsA()).toEqual([]);
        });

        it('should set heroB and clear results', () => {
            component.selectB(charB);
            expect(component.heroB()).toEqual(charB);
            expect(component.queryB()).toBe(charB.name);
            expect(component.resultsB()).toEqual([]);
        });
    });

    describe('statVal', () => {
        it('should return stat value', () => {
            expect(component.statVal(charA, 'intelligence')).toBe(90);
        });
        it('should return 0 for unknown key', () => {
            expect(component.statVal(charA, 'unknown')).toBe(0);
        });
    });

    describe('winner', () => {
        beforeEach(() => {
            component.selectA(charA);
            component.selectB(charB);
        });

        it('should return A when charA wins stat', () => {
            expect(component.winner('intelligence')).toBe('A');
        });

        it('should return B when charB wins stat', () => {
            expect(component.winner('combat')).toBe('B');
        });

        it('should return null when no heroes selected', () => {
            component.reset();
            expect(component.winner('intelligence')).toBeNull();
        });

        it('should return tie when equal', () => {
            const equalA = mockCharacter({ id: 3, powerstats: { ...charA.powerstats, intelligence: 50 } });
            const equalB = mockCharacter({ id: 4, powerstats: { ...charB.powerstats, intelligence: 50 } });
            component.selectA(equalA);
            component.selectB(equalB);
            expect(component.winner('intelligence')).toBe('tie');
        });
    });

    describe('overallWinner', () => {
        it('should return null when no heroes selected', () => {
            expect(component.overallWinner()).toBeNull();
        });

        it('should return A when charA has higher total stats', () => {
            component.selectA(charA);
            component.selectB(charB);
            // charA sum = 90+80+70+60+50+40 = 390
            // charB sum = 40+50+60+70+80+90 = 390 → tie
            expect(component.overallWinner()).toBe('tie');
        });

        it('should return A when charA total is higher', () => {
            const strong = mockCharacter({ id: 5, powerstats: { intelligence: 100, strength: 100, speed: 100, durability: 100, power: 100, combat: 100 } });
            const weak = mockCharacter({ id: 6, powerstats: { intelligence: 1, strength: 1, speed: 1, durability: 1, power: 1, combat: 1 } });
            component.selectA(strong);
            component.selectB(weak);
            expect(component.overallWinner()).toBe('A');
        });

        it('should return B when charB total is higher', () => {
            const weak = mockCharacter({ id: 7, powerstats: { intelligence: 1, strength: 1, speed: 1, durability: 1, power: 1, combat: 1 } });
            const strong = mockCharacter({ id: 8, powerstats: { intelligence: 100, strength: 100, speed: 100, durability: 100, power: 100, combat: 100 } });
            component.selectA(weak);
            component.selectB(strong);
            expect(component.overallWinner()).toBe('B');
        });
    });

    describe('reset', () => {
        it('should clear all state', () => {
            component.selectA(charA);
            component.selectB(charB);
            component.reset();
            expect(component.heroA()).toBeNull();
            expect(component.heroB()).toBeNull();
            expect(component.queryA()).toBe('');
            expect(component.queryB()).toBe('');
        });
    });

    describe('clearA / clearB', () => {
        it('should clear only side A', () => {
            component.selectA(charA);
            component.selectB(charB);
            component.clearA();
            expect(component.heroA()).toBeNull();
            expect(component.queryA()).toBe('');
            expect(component.heroB()).toEqual(charB);
        });

        it('should clear only side B', () => {
            component.selectA(charA);
            component.selectB(charB);
            component.clearB();
            expect(component.heroB()).toBeNull();
            expect(component.queryB()).toBe('');
            expect(component.heroA()).toEqual(charA);
        });
    });

    describe('ngOnDestroy', () => {
        it('should unsubscribe on destroy', () => {
            component.ngOnDestroy();
            expect((component as any).subs.closed).toBe(true);
        });
    });
});
