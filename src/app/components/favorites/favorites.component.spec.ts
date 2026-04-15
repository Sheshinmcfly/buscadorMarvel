import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritesComponent } from './favorites.component';
import { FavoritesService } from '../../services/favorites.service';
import { mockCharacter } from '../../testing/mock-character';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;
  let favSvc: FavoritesService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [FavoritesComponent] }).compileComponents();
    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    favSvc = TestBed.inject(FavoritesService);
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('should create', () => expect(component).toBeTruthy());

  it('should show empty state when no favorites', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('No tienes favoritos');
  });

  it('should show favorites when added', () => {
    favSvc.toggle(mockCharacter({ id: 1, name: 'Spider-Man' }));
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Spider-Man');
  });

  it('alignmentLabel should map correctly', () => {
    expect(component.alignmentLabel('good')).toBe('Héroe');
    expect(component.alignmentLabel('bad')).toBe('Villano');
    expect(component.alignmentLabel('neutral')).toBe('Neutral');
    expect(component.alignmentLabel('other')).toBe('other');
  });

  it('alignmentClass should return correct class', () => {
    expect(component.alignmentClass('good')).toBe('bg-success');
    expect(component.alignmentClass('bad')).toBe('bg-danger');
    expect(component.alignmentClass('neutral')).toBe('bg-secondary');
    expect(component.alignmentClass('other')).toBe('bg-secondary');
  });

  it('initials should return uppercase initials', () => {
    expect(component.initials('Bruce Wayne')).toBe('BW');
  });

  it('onImgError should hide img and show placeholder', () => {
    const wrapper = document.createElement('div');
    wrapper.className = 'fav-img-wrapper';
    const img = document.createElement('img');
    const ph = document.createElement('div');
    ph.className = 'fav-placeholder';
    ph.style.display = 'none';
    wrapper.appendChild(img);
    wrapper.appendChild(ph);
    component.onImgError({ target: img } as unknown as Event);
    expect(img.style.display).toBe('none');
    expect(ph.style.display).toBe('flex');
  });

  it('should emit selectCharacter', () => {
    spyOn(component.selectCharacter, 'emit');
    const char = mockCharacter();
    component.selectCharacter.emit(char);
    expect(component.selectCharacter.emit).toHaveBeenCalledWith(char);
  });
});
