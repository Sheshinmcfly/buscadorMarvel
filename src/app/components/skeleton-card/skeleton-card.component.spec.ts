import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonCardComponent } from './skeleton-card.component';

describe('SkeletonCardComponent', () => {
  let fixture: ComponentFixture<SkeletonCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SkeletonCardComponent] }).compileComponents();
    fixture = TestBed.createComponent(SkeletonCardComponent);
    fixture.detectChanges();
  });

  it('should create', () => expect(fixture.componentInstance).toBeTruthy());

  it('should render skeleton card structure', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.skeleton-card')).toBeTruthy();
    expect(el.querySelector('.skeleton-img')).toBeTruthy();
    expect(el.querySelector('.skeleton-body')).toBeTruthy();
  });
});
