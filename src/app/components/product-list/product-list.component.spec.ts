import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';
import { of, throwError } from 'rxjs';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceSpy: any;
  const mockProducts: Product[] = [
    {
      id: 'prod-001',
      name: 'Tarjeta de Crédito',
      description: 'Tarjeta de consumo bajo modalidad crédito',
      logo: 'https://example.com/visa.jpg',
      date_release: '2025-01-01',
      date_revision: '2026-01-01',
    },
    {
      id: 'prod-002',
      name: 'Cuenta de Ahorros',
      description: 'Cuenta para ahorro personal con intereses',
      logo: 'https://example.com/savings.jpg',
      date_release: '2025-06-01',
      date_revision: '2026-06-01',
    },
    {
      id: 'prod-003',
      name: 'Préstamo Personal',
      description: 'Préstamo con tasa preferencial para clientes',
      logo: 'https://example.com/loan.jpg',
      date_release: '2025-03-15',
      date_revision: '2026-03-15',
    },
  ];

  beforeEach(async () => {
    productServiceSpy = {
      getAll: vi.fn().mockReturnValue(of(mockProducts)),
      delete: vi.fn().mockReturnValue(of({ message: 'Product removed successfully' })),
    };

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los productos al inicializar', () => {
    expect(productServiceSpy.getAll).toHaveBeenCalled();
    expect(component['products']().length).toBe(3);
    expect(component['loading']()).toBe(false);
  });

  it('debería mostrar la tabla con los productos', () => {
    const rows = fixture.nativeElement.querySelectorAll(
      '.products-table tbody tr'
    );
    expect(rows.length).toBe(3);
  });

  it('debería mostrar el skeleton loader mientras carga', () => {
    component['loading'].set(true);
    fixture.detectChanges();
    const skeletons = fixture.nativeElement.querySelectorAll('.skeleton-row');
    expect(skeletons.length).toBe(5);
  });

  describe('F2 - Búsqueda', () => {
    it('debería filtrar productos por nombre', () => {
      component['searchTerm'].set('crédito');
      fixture.detectChanges();
      expect(component['filteredProducts']().length).toBe(1);
      expect(component['filteredProducts']()[0].name).toBe(
        'Tarjeta de Crédito'
      );
    });

    it('debería filtrar productos por descripción', () => {
      component['searchTerm'].set('intereses');
      fixture.detectChanges();
      expect(component['filteredProducts']().length).toBe(1);
      expect(component['filteredProducts']()[0].id).toBe('prod-002');
    });

    it('debería mostrar todos si no hay término de búsqueda', () => {
      component['searchTerm'].set('');
      expect(component['filteredProducts']().length).toBe(3);
    });

    it('debería ser case-insensitive', () => {
      component['searchTerm'].set('TARJETA');
      expect(component['filteredProducts']().length).toBe(1);
    });

    it('debería mostrar mensaje vacío si no hay resultados', () => {
      component['searchTerm'].set('producto-inexistente');
      fixture.detectChanges();
      const emptyMsg =
        fixture.nativeElement.querySelector('.empty-message');
      expect(emptyMsg).toBeTruthy();
    });
  });

  describe('F3 - Paginación', () => {
    it('debería mostrar 5 resultados por defecto', () => {
      expect(component['pageSize']()).toBe(5);
      expect(component['paginatedProducts']().length).toBe(3); // solo hay 3
    });

    it('debería cambiar el tamaño de página', () => {
      component['pageSize'].set(1);
      fixture.detectChanges();
      expect(component['paginatedProducts']().length).toBe(1);
    });

    it('debería mostrar el contador de resultados', () => {
      fixture.detectChanges();
      const countEl = fixture.nativeElement.querySelector('.results-count');
      expect(countEl.textContent).toContain('3 Resultados');
    });
  });

  describe('Menú contextual', () => {
    it('debería abrir el menú al hacer clic', () => {
      component.toggleMenu('prod-001');
      expect(component['openMenuId']()).toBe('prod-001');
    });

    it('debería cerrar el menú si se hace clic en el mismo producto', () => {
      component.toggleMenu('prod-001');
      component.toggleMenu('prod-001');
      expect(component['openMenuId']()).toBeNull();
    });

    it('debería cambiar de menú al hacer clic en otro producto', () => {
      component.toggleMenu('prod-001');
      component.toggleMenu('prod-002');
      expect(component['openMenuId']()).toBe('prod-002');
    });
  });

  describe('Eliminación', () => {
    it('debería mostrar el modal al confirmar eliminación', () => {
      component.confirmDelete(mockProducts[0]);
      expect(component['deleteTarget']()).toEqual(mockProducts[0]);
    });

    it('debería cerrar el modal al cancelar', () => {
      component.confirmDelete(mockProducts[0]);
      component.onDeleteCancel();
      expect(component['deleteTarget']()).toBeNull();
    });

    it('debería eliminar el producto al confirmar', () => {
      component.confirmDelete(mockProducts[0]);
      component.onDeleteConfirm();
      expect(productServiceSpy.delete).toHaveBeenCalledWith('prod-001');
      expect(component['products']().length).toBe(2);
      expect(component['deleteTarget']()).toBeNull();
    });
  });

  describe('Manejo de errores', () => {
    it('debería mostrar error al fallar la carga', () => {
      productServiceSpy.getAll.mockReturnValue(
        throwError(() => new Error('Error de conexión'))
      );
      component.loadProducts();
      fixture.detectChanges();
      expect(component['error']()).toBe('Error de conexión');
      expect(component['loading']()).toBe(false);
    });

    it('debería mostrar el botón de reintentar en error', () => {
      productServiceSpy.getAll.mockReturnValue(
        throwError(() => new Error('Error'))
      );
      component.loadProducts();
      fixture.detectChanges();
      const retryBtn = fixture.nativeElement.querySelector('.btn-retry');
      expect(retryBtn).toBeTruthy();
    });
  });
});
