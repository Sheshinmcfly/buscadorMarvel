import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { mockCharacter } from './testing/mock-character';

describe('AppComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  afterEach(() => {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    localStorage.clear();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should start in Marvel theme', () => {
    const { componentInstance: app } = TestBed.createComponent(AppComponent);
    expect(app.theme()).toBe('marvel');
    expect(app.isDC()).toBeFalse();
    expect(app.publisher()).toBe('Marvel Comics');
  });

  it('toggleTheme should switch to DC', () => {
    const { componentInstance: app } = TestBed.createComponent(AppComponent);
    app.toggleTheme();
    expect(app.theme()).toBe('dc');
    expect(app.isDC()).toBeTrue();
    expect(app.publisher()).toBe('DC Comics');
  });

  it('toggleTheme should clear characters and selectedCharacter', () => {
    const { componentInstance: app } = TestBed.createComponent(AppComponent);
    app.onResults([mockCharacter()]);
    app.onSelectCharacter(mockCharacter());
    app.toggleTheme();
    expect(app.characters()).toEqual([]);
    expect(app.selectedCharacter()).toBeNull();
  });

  it('setTab should change active tab and clear selectedCharacter', () => {
    const { componentInstance: app } = TestBed.createComponent(AppComponent);
    app.onSelectCharacter(mockCharacter());
    app.setTab('compare');
    expect(app.activeTab()).toBe('compare');
    expect(app.selectedCharacter()).toBeNull();
  });

  it('onResults should set characters', () => {
    const { componentInstance: app } = TestBed.createComponent(AppComponent);
    const chars = [mockCharacter()];
    app.onResults(chars);
    expect(app.characters()).toEqual(chars);
    expect(app.selectedCharacter()).toBeNull();
  });

  it('onLoadingChange should set loading signal', () => {
    const { componentInstance: app } = TestBed.createComponent(AppComponent);
    app.onLoadingChange(true);
    expect(app.loading()).toBeTrue();
    app.onLoadingChange(false);
    expect(app.loading()).toBeFalse();
  });

  it('onSelectCharacter should set selectedCharacter', () => {
    const { componentInstance: app } = TestBed.createComponent(AppComponent);
    const char = mockCharacter();
    app.onSelectCharacter(char);
    expect(app.selectedCharacter()).toEqual(char);
  });

  it('onCloseDetail should clear selectedCharacter', () => {
    const { componentInstance: app } = TestBed.createComponent(AppComponent);
    app.onSelectCharacter(mockCharacter());
    app.onCloseDetail();
    expect(app.selectedCharacter()).toBeNull();
  });

  it('should have 5 tabs defined', () => {
    const { componentInstance: app } = TestBed.createComponent(AppComponent);
    expect(app.tabs.length).toBe(5);
    expect(app.tabs.map(t => t.id)).toContain('favorites');
  });

  it('effect should update CSS vars on documentElement', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    app.toggleTheme(); // switch to DC
    fixture.detectChanges();
    expect(document.documentElement.style.getPropertyValue('--primary')).toBe('#1a53a0');
    app.toggleTheme(); // switch back to Marvel
    fixture.detectChanges();
    expect(document.documentElement.style.getPropertyValue('--primary')).toBe('#B7000D');
  });
});
