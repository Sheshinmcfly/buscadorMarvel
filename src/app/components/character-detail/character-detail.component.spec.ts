import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterDetailComponent } from './character-detail.component';
import { FavoritesService } from '../../services/favorites.service';
import { mockCharacter } from '../../testing/mock-character';

describe('CharacterDetailComponent', () => {
    let component: CharacterDetailComponent;
    let fixture: ComponentFixture<CharacterDetailComponent>;

    beforeEach(async () => {
        localStorage.clear();
        await TestBed.configureTestingModule({ imports: [CharacterDetailComponent] }).compileComponents();
        fixture = TestBed.createComponent(CharacterDetailComponent);
        component = fixture.componentInstance;
        component.character = mockCharacter();
        fixture.detectChanges();
    });

    afterEach(() => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        localStorage.clear();
    });

    it('should create', () => expect(component).toBeTruthy());

    it('should lock body and html scroll on init', () => {
        expect(document.body.style.overflow).toBe('hidden');
        expect(document.documentElement.style.overflow).toBe('hidden');
    });

    it('should restore scroll on destroy', () => {
        fixture.destroy();
        expect(document.body.style.overflow).toBe('');
        expect(document.documentElement.style.overflow).toBe('');
    });

    it('should emit close', () => {
        vi.spyOn(component.close, 'emit').mockReturnValue(undefined);
        component.close.emit();
        expect(component.close.emit).toHaveBeenCalled();
    });

    describe('statValue', () => {
        it('should return powerstats value by key', () => {
            expect(component.statValue('intelligence')).toBe(mockCharacter().powerstats.intelligence);
            expect(component.statValue('strength')).toBe(mockCharacter().powerstats.strength);
        });

        it('should return 0 for unknown key', () => {
            expect(component.statValue('unknown')).toBe(0);
        });
    });

    describe('statColor', () => {
        it('should return bg-success for value >= 80', () => {
            expect(component.statColor(80)).toBe('bg-success');
            expect(component.statColor(100)).toBe('bg-success');
        });

        it('should return bg-warning for value >= 50 and < 80', () => {
            expect(component.statColor(50)).toBe('bg-warning');
            expect(component.statColor(79)).toBe('bg-warning');
        });

        it('should return bg-danger for value < 50', () => {
            expect(component.statColor(49)).toBe('bg-danger');
            expect(component.statColor(0)).toBe('bg-danger');
        });
    });

    describe('aliases getter', () => {
        it('should join array aliases', () => {
            component.character = mockCharacter({ biography: { ...mockCharacter().biography, aliases: ['A', 'B'] } });
            expect(component.aliases).toBe('A, B');
        });

        it('should return string aliases as-is', () => {
            component.character = mockCharacter({ biography: { ...mockCharacter().biography, aliases: 'Solo' as any } });
            expect(component.aliases).toBe('Solo');
        });
    });

    describe('isUnknown', () => {
        it('should return true for "-"', () => expect(component.isUnknown('-')).toBe(true));
        it('should return true for "unknown"', () => expect(component.isUnknown('unknown value')).toBe(true));
        it('should return true for empty string', () => expect(component.isUnknown('')).toBe(true));
        it('should return false for known value', () => expect(component.isUnknown('New York')).toBe(false));
        it('should return true for array with all unknown', () => expect(component.isUnknown(['-', 'unknown'])).toBe(true));
        it('should return false for array with known values', () => expect(component.isUnknown(['New York', '-'])).toBe(false));
    });

    describe('onImgError', () => {
        it('should set imgFailed to true', () => {
            component.onImgError();
            expect(component.imgFailed).toBe(true);
        });
    });

    describe('initials', () => {
        it('should return 2-letter initials', () => expect(component.initials('Bruce Wayne')).toBe('BW'));
        it('should handle single name', () => expect(component.initials('Batman')).toBe('B'));
    });

    describe('alignmentLabel and alignmentClass', () => {
        it('should map good/bad/neutral', () => {
            expect(component.alignmentLabel('good')).toBe('Héroe');
            expect(component.alignmentLabel('bad')).toBe('Villano');
            expect(component.alignmentLabel('neutral')).toBe('Neutral');
        });

        it('should return correct badge class', () => {
            expect(component.alignmentClass('good')).toBe('bg-success');
            expect(component.alignmentClass('bad')).toBe('bg-danger');
            expect(component.alignmentClass('neutral')).toBe('bg-secondary');
        });

        it('should fallback for unknown alignment', () => {
            expect(component.alignmentLabel('unknown')).toBe('unknown');
            expect(component.alignmentClass('unknown')).toBe('bg-secondary');
        });
    });

    describe('FavoritesService integration', () => {
        it('should toggle favorite via favSvc', () => {
            const favSvc = TestBed.inject(FavoritesService);
            expect(favSvc.isFavorite(component.character.id)).toBe(false);
            favSvc.toggle(component.character);
            expect(favSvc.isFavorite(component.character.id)).toBe(true);
        });
    });

    describe('onEscape', () => {
        it('should emit close when Escape key is pressed', () => {
            vi.spyOn(component.close, 'emit').mockReturnValue(undefined);
            component.onEscape();
            expect(component.close.emit).toHaveBeenCalled();
        });
    });
});
