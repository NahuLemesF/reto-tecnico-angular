import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeaderComponent } from './header.component';
import { vi } from 'vitest';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    // Limpiamos localStorage y document.body antes de cada test
    localStorage.clear();
    document.body.className = '';

    // Mock window.matchMedia para JSDOM
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
    document.body.className = '';
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería alternar el tema al llamar toggleTheme', () => {
    expect(component.isDarkMode()).toBe(false);
    
    component.toggleTheme();
    // Forzamos la ejecución del effect() si es necesario, 
    // en Vitest/Angular signals a veces requieren detectChanges
    fixture.detectChanges();
    
    expect(component.isDarkMode()).toBe(true);
    expect(document.body.classList.contains('dark-mode')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');

    component.toggleTheme();
    fixture.detectChanges();
    
    expect(component.isDarkMode()).toBe(false);
    expect(document.body.classList.contains('dark-mode')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
