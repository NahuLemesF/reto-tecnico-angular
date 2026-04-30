import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ImageFallbackDirective } from './image-fallback.directive';

@Component({
  template: `
    <div id="container">
      <img src="invalid-src" appImageFallback />
    </div>
  `,
  standalone: true,
  imports: [ImageFallbackDirective]
})
class TestComponent {}

describe('ImageFallbackDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [TestComponent, ImageFallbackDirective]
    }).createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('debería ocultar la imagen y mostrar el fallback cuando hay un error', () => {
    const imgEl = fixture.debugElement.query(By.css('img'));
    
    // Simular el evento error
    imgEl.triggerEventHandler('error', null);
    fixture.detectChanges();

    expect(imgEl.nativeElement.style.display).toBe('none');
    
    const container = fixture.debugElement.query(By.css('#container'));
    const fallback = container.query(By.css('.logo-fallback'));
    
    expect(fallback).toBeTruthy();
    expect(fallback.nativeElement.textContent).toBe('📦');
  });
});
