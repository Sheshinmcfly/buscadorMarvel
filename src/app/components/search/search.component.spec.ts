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
  let heroSvc: jasmine.SpyObj<HeroService>;

  beforeEach(async () => {
    heroSvc = jasmine.createSpyObj('HeroService', ['search']);

    await TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [{ provide: HeroService, useValue: heroSvc }],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));
  });

  it('should create', () => expect(component).toBeTruthy());

  it('form should be invalid when empty', () => {
    expect(component.form.invalid).toBeTrue();
  });

  it('form should be invalid when query length < 2', () => {
    component.query.setValue('a');
    expect(component.form.invalid).toBeTrue();
  });

  it('form should be valid with 2+ characters', () => {
    component.query.setValue('sp');
    expect(component.form.valid).toBeTrue();
  });

  describe('search()', () => {
    it('should show Swal warning when form invalid', () => {
      component.search();
      expect(Swal.fire).toHaveBeenCalled();
      expect(heroSvc.search).not.toHaveBeenCalled();
    });

    it('should emit loadingChange(true) then results on success', () => {
      const chars = [mockCharacter()];
      heroSvc.search.and.returnValue(of(chars));
      const loadingEmits: boolean[] = [];
      spyOn(component.results, 'emit');
      component.loadingChange.subscribe(v => loadingEmits.push(v));
      component.query.setValue('Spider');
      component.search();
      expect(loadingEmits).toEqual([true, false]);
      expect(component.results.emit).toHaveBeenCalledWith(chars);
    });

    it('should emit empty results and show Swal when no characters found', () => {
      heroSvc.search.and.returnValue(of([]));
      spyOn(component.results, 'emit');
      component.query.setValue('Unknown');
      component.search();
      expect(Swal.fire).toHaveBeenCalled();
      expect(component.results.emit).toHaveBeenCalledWith([]);
    });

    it('should show Swal error on API error', () => {
      heroSvc.search.and.returnValue(throwError(() => new Error('fail')));
      component.query.setValue('Spider');
      component.search();
      expect(Swal.fire).toHaveBeenCalled();
    });

    it('should set searched signal to true after search', () => {
      heroSvc.search.and.returnValue(of([mockCharacter()]));
      component.query.setValue('Spider');
      component.search();
      expect(component.searched()).toBeTrue();
    });

    it('should use DC color in Swal warning when isDC', () => {
      component.isDC = true;
      component.search();
      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ confirmButtonColor: '#1a53a0' }));
    });

    it('should use DC color in Swal when no results and isDC', () => {
      component.isDC = true;
      heroSvc.search.and.returnValue(of([]));
      component.query.setValue('Unknown');
      component.search();
      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ confirmButtonColor: '#1a53a0' }));
    });

    it('should use DC color in Swal error when isDC', () => {
      component.isDC = true;
      heroSvc.search.and.returnValue(throwError(() => new Error('fail')));
      component.query.setValue('Spider');
      component.search();
      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ confirmButtonColor: '#1a53a0' }));
    });
  });

  describe('clear()', () => {
    it('should reset form, searched and emit empty results', () => {
      spyOn(component.results, 'emit');
      heroSvc.search.and.returnValue(of([mockCharacter()]));
      component.query.setValue('Spider');
      component.search();
      expect(component.searched()).toBeTrue();

      component.clear();
      expect(component.searched()).toBeFalse();
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
      expect(component.searched()).toBeFalse();
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
