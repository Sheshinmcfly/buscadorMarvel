import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroBackgroundComponent } from './hero-background.component';
import { SimpleChange } from '@angular/core';

describe('HeroBackgroundComponent', () => {
    let component: HeroBackgroundComponent;
    let fixture: ComponentFixture<HeroBackgroundComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [HeroBackgroundComponent] }).compileComponents();
        fixture = TestBed.createComponent(HeroBackgroundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => fixture.destroy());

    it('should create', () => expect(component).toBeTruthy());

    it('should render a canvas element', () => {
        const canvas = fixture.nativeElement.querySelector('canvas');
        expect(canvas).toBeTruthy();
    });

    it('should restart animation on isDC change (not first change)', () => {
        vi.spyOn(component as any, 'reset').mockReturnValue(undefined);
        component.ngOnChanges({ isDC: new SimpleChange(false, true, false) });
        expect((component as any).reset).toHaveBeenCalled();
    });

    it('should not restart on first change', () => {
        vi.spyOn(component as any, 'reset').mockReturnValue(undefined);
        component.ngOnChanges({ isDC: new SimpleChange(null, true, true) });
        expect((component as any).reset).not.toHaveBeenCalled();
    });

    it('should stop animation on destroy', () => {
        const spy = vi.spyOn(window, 'cancelAnimationFrame').mockReturnValue(undefined);
        component.ngOnDestroy();
        expect(spy).toHaveBeenCalled();
    });
});
