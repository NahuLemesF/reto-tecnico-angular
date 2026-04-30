import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-product-form',
  template: '<p>Formulario de producto...</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormComponent {}
