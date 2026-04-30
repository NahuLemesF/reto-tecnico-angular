import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-product-list',
  template: '<p>Cargando listado de productos...</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {}
