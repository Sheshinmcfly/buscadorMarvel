import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopRankingsComponent } from './top-rankings.component';
import { HeroService } from '../../services/hero.service';
import { mockCharacter } from '../../testing/mock-character';
import { of } from 'rxjs';
import { Character } from '../../models/character';

describe('TopRankingsComponent', () => {
  let component: TopRankingsComponent;
  let fixture: ComponentFixture<TopRankingsComponent>;
  let heroSvc: jasmine.SpyObj<HeroService>;

  const chars: Character[] = [
    mockCharacter({ id: 1, name: 'A', powerstats: { intelligence: 100, strength: 90, speed: 80, durability: 70, power: 60, combat: 50 } }),
    mockCharacter({ id: 2, name: 'B', powerstats: { intelligence: 80,  strength: 70, speed: 60, durability: 50, power: 40, combat: 30 } }),
    mockCharacter({ id: 3, name: 'C', powerstats: { intelligence: 60,  strength: 50, speed: 40, durability: 30, power: 20, combat: 10 } }),
    mockCharacter({ id: 4, name: 'D', powerstats: { intelligence: 0,   strength: 0,  speed: 0,  durability: 0,  power: 0,  combat: 0  } }),
  ];

  beforeEach(async () => {
    heroSvc = jasmine.createSpyObj('HeroService', ['getByPublisher']);
    heroSvc.getByPublisher.and.returnValue(of(chars));

    await TestBed.configureTestingModule({
      imports: [TopRankingsComponent],
      providers: [{ provide: HeroService, useValue: heroSvc }],
    }).compileComponents();

    fixture = TestBed.createComponent(TopRankingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should build 6 ranking categories on ngOnChanges', () => {
    component.ngOnChanges();
    expect(component.rankings().length).toBe(6);
  });

  it('should exclude characters with 0 stat value', () => {
    component.ngOnChanges();
    const intRanking = component.rankings().find(r => r.key === 'intelligence')!;
    expect(intRanking.top.every(c => c.powerstats.intelligence > 0)).toBeTrue();
    expect(intRanking.top.map(c => c.name)).not.toContain('D');
  });

  it('should sort top characters by stat descending', () => {
    component.ngOnChanges();
    const intRanking = component.rankings().find(r => r.key === 'intelligence')!;
    expect(intRanking.top[0].powerstats.intelligence).toBeGreaterThanOrEqual(intRanking.top[1].powerstats.intelligence);
  });

  it('should limit to top 5 per stat', () => {
    const many = Array.from({ length: 10 }, (_, i) =>
      mockCharacter({ id: i + 1, powerstats: { intelligence: 100 - i, strength: 10, speed: 10, durability: 10, power: 10, combat: 10 } })
    );
    heroSvc.getByPublisher.and.returnValue(of(many));
    component.ngOnChanges();
    component.rankings().forEach(r => expect(r.top.length).toBeLessThanOrEqual(5));
  });

  it('should emit selectCharacter', () => {
    spyOn(component.selectCharacter, 'emit');
    component.selectCharacter.emit(chars[0]);
    expect(component.selectCharacter.emit).toHaveBeenCalledWith(chars[0]);
  });

  it('statValue should return correct value', () => {
    expect(component.statValue(chars[0], 'intelligence')).toBe(100);
    expect(component.statValue(chars[0], 'unknown')).toBe(0);
  });

  it('should reload rankings when publisher changes', () => {
    heroSvc.getByPublisher.and.returnValue(of([]));
    component.publisher = 'DC Comics';
    component.ngOnChanges();
    expect(heroSvc.getByPublisher).toHaveBeenCalledWith('DC Comics');
  });

  it('should set loading false after rankings are built', () => {
    component.ngOnChanges();
    expect(component.loading()).toBeFalse();
  });
});
