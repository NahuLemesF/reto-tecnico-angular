import { Directive, ElementRef, HostListener, Renderer2, inject } from '@angular/core';

@Directive({
  selector: 'img[appImageFallback]',
  standalone: true
})
export class ImageFallbackDirective {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  @HostListener('error')
  onError(): void {
    const imgElement = this.el.nativeElement;
    this.renderer.setStyle(imgElement, 'display', 'none');

    const parent = this.renderer.parentNode(imgElement);
    if (parent) {
      const fallback = this.renderer.createElement('div');
      this.renderer.addClass(fallback, 'logo-fallback');
      const text = this.renderer.createText('📦');
      this.renderer.appendChild(fallback, text);
      this.renderer.appendChild(parent, fallback);
    }
  }
}
