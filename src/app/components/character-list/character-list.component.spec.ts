import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterListComponent } from './character-list.component';
import { mockCharacter } from '../../testing/mock-character';
import { Character } from '../../models/character';

const chars: Character[] = [
    mockCharacter({ id: 1, name: 'Aardvark', biography: { ...mockCharacter().biography, alignment: 'good' }, powerstats: { intelligence: 50, strength: 80, speed: 30, durability: 60, power: 40, combat: 70 } }),
    mockCharacter({ id: 2, name: 'Zebra', biography: { ...mockCharacter().biography, alignment: 'bad' }, powerstats: { intelligence: 90, strength: 20, speed: 90, durability: 10, power: 80, combat: 20 } }),
    mockCharacter({ id: 3, name: 'Mango', biography: { ...mockCharacter().biography, alignment: 'neutral' }, powerstats: { intelligence: 70, strength: 50, speed: 60, durability: 40, power: 60, combat: 50 } }),
];

describe('CharacterListComponent', () => {
    let component: CharacterListComponent;
    let fixture: ComponentFixture<CharacterListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [CharacterListComponent] }).compileComponents();
        fixture = TestBed.createComponent(CharacterListComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('characters', chars);
        fixture.detectChanges();
    });

    it('should create', () => expect(component).toBeTruthy());

    it('should show all characters by default', () => {
        expect(component.displayed().length).toBe(3);
    });

    it('should filter by alignment good', () => {
        component.setAlignment('good');
        expect(component.displayed().length).toBe(1);
        expect(component.displayed()[0].name).toBe('Aardvark');
    });

    it('should filter by alignment bad', () => {
        component.setAlignment('bad');
        expect(component.displayed().length).toBe(1);
        expect(component.displayed()[0].name).toBe('Zebra');
    });

    it('should filter by alignment neutral', () => {
        component.setAlignment('neutral');
        expect(component.displayed().length).toBe(1);
        expect(component.displayed()[0].name).toBe('Mango');
    });

    it('should sort by name ascending', () => {
        component.setSortBy('name');
        const names = component.displayed().map(c => c.name);
        expect(names).toEqual([...names].sort());
    });

    it('should sort by strength descending', () => {
        component.setSortBy('strength');
        const vals = component.displayed().map(c => c.powerstats.strength);
        expect(vals[0]).toBeGreaterThanOrEqual(vals[1]);
        expect(vals[1]).toBeGreaterThanOrEqual(vals[2]);
    });

    it('should sort by intelligence descending', () => {
        component.setSortBy('intelligence');
        const vals = component.displayed().map(c => c.powerstats.intelligence);
        expect(vals[0]).toBeGreaterThanOrEqual(vals[1]);
    });

    it('should reset filters and sort on ngOnChanges', () => {
        component.setAlignment('bad');
        component.setSortBy('strength');
        component.characters = [mockCharacter()];
        component.ngOnChanges();
        expect(component.alignment()).toBe('all');
        expect(component.sortBy()).toBe('name');
    });

    it('should emit selectCharacter', () => {
        vi.spyOn(component.selectCharacter, 'emit').mockReturnValue(undefined);
        component.selectCharacter.emit(chars[0]);
        expect(component.selectCharacter.emit).toHaveBeenCalledWith(chars[0]);
    });

    it('alignmentLabel should return correct labels', () => {
        expect(component.alignmentLabel('good')).toBe('Héroe');
        expect(component.alignmentLabel('bad')).toBe('Villano');
        expect(component.alignmentLabel('neutral')).toBe('Neutral');
        expect(component.alignmentLabel('unknown')).toBe('unknown');
    });

    it('alignmentClass should return correct badge classes', () => {
        expect(component.alignmentClass('good')).toBe('bg-success');
        expect(component.alignmentClass('bad')).toBe('bg-danger');
        expect(component.alignmentClass('neutral')).toBe('bg-secondary');
        expect(component.alignmentClass('other')).toBe('bg-secondary');
    });

    it('trackById should return character id', () => {
        expect(component.trackById(0, chars[0])).toBe(1);
    });

    it('initials should return up to 2 uppercase initials', () => {
        expect(component.initials('Peter Parker')).toBe('PP');
        expect(component.initials('Bruce')).toBe('B');
        expect(component.initials('Clark Joseph Kent')).toBe('CJ');
    });

    it('onImgError should hide img and show placeholder', () => {
        const wrapper = document.createElement('div');
        wrapper.className = 'hero-img-wrapper';
        const img = document.createElement('img');
        const placeholder = document.createElement('div');
        placeholder.className = 'img-placeholder';
        placeholder.style.display = 'none';
        wrapper.appendChild(img);
        wrapper.appendChild(placeholder);
        component.onImgError({ target: img } as unknown as Event);
        expect(img.style.display).toBe('none');
        expect(placeholder.style.display).toBe('flex');
    });
});
