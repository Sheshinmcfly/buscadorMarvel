import type { MockedObject } from "vitest";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { HeroService } from '../../services/hero.service';
import { mockCharacter } from '../../testing/mock-character';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { SimpleChange } from '@angular/core';

describe('SearchComponent', () => {
    let component: SearchComponent;
    let fixture: ComponentFixture<SearchComponent>;
    let heroSvc: MockedObject<HeroService>;

    beforeEach(async () => {
        heroSvc = {
            search: vi.fn().mockName("HeroService.search")
        } as unknown as MockedObject<HeroService>;

        await TestBed.configureTestingModule({
            imports: [SearchComponent],
            providers: [{ provide: HeroService, useValue: heroSvc }],
        }).compileComponents();

        fixture = TestBed.createComponent(SearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        vi.spyOn(Swal, 'fire').mockResolvedValue({ isConfirmed: true } as any);
    });

    it('should create', () => expect(component).toBeTruthy());

    it('form should be invalid when empty', () => {
        expect(component.form.invalid).toBe(true);
    });

    it('form should be invalid when query length < 2', () => {
        component.query.setValue('a');
        expect(component.form.invalid).toBe(true);
    });

    it('form should be valid with 2+ characters', () => {
        component.query.setValue('sp');
        expect(component.form.valid).toBe(true);
    });

    describe('search()', () => {
        it('should show Swal warning when form invalid', () => {
            component.search();
            expect(Swal.fire).toHaveBeenCalled();
            expect(heroSvc.search).not.toHaveBeenCalled();
        });

        it('should emit loadingChange(true) then results on success', () => {
            const chars = [mockCharacter()];
            heroSvc.search.mockReturnValue(of(chars));
            const loadingEmits: boolean[] = [];
            vi.spyOn(component.results, 'emit').mockReturnValue(undefined);
            component.loadingChange.subscribe(v => loadingEmits.push(v));
            component.query.setValue('Spider');
            component.search();
            expect(loadingEmits).toEqual([true, false]);
            expect(component.results.emit).toHaveBeenCalledWith(chars);
        });

        it('should emit empty results and show Swal when no characters found', () => {
            heroSvc.search.mockReturnValue(of([]));
            vi.spyOn(component.results, 'emit').mockReturnValue(undefined);
            component.query.setValue('Unknown');
            component.search();
            expect(Swal.fire).toHaveBeenCalled();
            expect(component.results.emit).toHaveBeenCalledWith([]);
        });

        it('should show Swal error on API error', () => {
            heroSvc.search.mockReturnValue(throwError(() => new Error('fail')));
            component.query.setValue('Spider');
            component.search();
            expect(Swal.fire).toHaveBeenCalled();
        });

        it('should set searched signal to true after search', () => {
            heroSvc.search.mockReturnValue(of([mockCharacter()]));
            component.query.setValue('Spider');
            component.search();
            expect(component.searched()).toBe(true);
        });

        it('should use DC color in Swal warning when isDC', () => {
            component.isDC = true;
            component.search();
            expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ confirmButtonColor: '#1a53a0' }));
        });

        it('should use DC color in Swal when no results and isDC', () => {
            component.isDC = true;
            heroSvc.search.mockReturnValue(of([]));
            component.query.setValue('Unknown');
            component.search();
            expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ confirmButtonColor: '#1a53a0' }));
        });

        it('should use DC color in Swal error when isDC', () => {
            component.isDC = true;
            heroSvc.search.mockReturnValue(throwError(() => new Error('fail')));
            component.query.setValue('Spider');
            component.search();
            expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ confirmButtonColor: '#1a53a0' }));
        });
    });

    describe('clear()', () => {
        it('should reset form, searched and emit empty results', () => {
            vi.spyOn(component.results, 'emit').mockReturnValue(undefined);
            heroSvc.search.mockReturnValue(of([mockCharacter()]));
            component.query.setValue('Spider');
            component.search();
            expect(component.searched()).toBe(true);

            component.clear();
            expect(component.searched()).toBe(false);
            expect(component.query.value).toBeNull();
            expect(component.results.emit).toHaveBeenCalledWith([]);
        });
    });

    describe('ngOnChanges', () => {
        it('should reset form when isDC changes (not first change)', () => {
            component.query.setValue('Batman');
            component.ngOnChanges({
                isDC: new SimpleChange(false, true, false),
            });
            expect(component.form.value.query).toBeNull();
            expect(component.searched()).toBe(false);
        });

        it('should not reset on first change', () => {
            component.query.setValue('Batman');
            component.ngOnChanges({
                isDC: new SimpleChange(null, true, true),
            });
            expect(component.form.value.query).toBe('Batman');
        });
    });
});
