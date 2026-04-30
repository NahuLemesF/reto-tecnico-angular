import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient,
} from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.interface';

describe('ProductService', () => {
  let service: ProductService;
  let httpTesting: HttpTestingController;

  const baseUrl = '/bp/products';

  const mockProduct: Product = {
    id: 'trj-crd',
    name: 'Tarjetas de Crédito',
    description: 'Tarjeta de consumo bajo la modalidad de crédito',
    logo: 'https://example.com/visa.jpg',
    date_release: '2025-01-01',
    date_revision: '2026-01-01',
  };

  const mockProducts: Product[] = [
    mockProduct,
    {
      id: 'trj-dbt',
      name: 'Tarjetas de Débito',
      description: 'Tarjeta de consumo bajo la modalidad de débito',
      logo: 'https://example.com/debit.jpg',
      date_release: '2025-06-01',
      date_revision: '2026-06-01',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ProductService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('debería obtener todos los productos', () => {
      service.getAll().subscribe((products) => {
        expect(products).toEqual(mockProducts);
        expect(products.length).toBe(2);
      });

      const req = httpTesting.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush({ data: mockProducts });
    });

    it('debería manejar error del servidor al obtener productos', () => {
      service.getAll().subscribe({
        error: (error) => {
          expect(error.message).toBe('Error interno del servidor');
        },
      });

      const req = httpTesting.expectOne(baseUrl);
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('debería manejar error de conexión', () => {
      service.getAll().subscribe({
        error: (error) => {
          expect(error.message).toBe('No se pudo conectar con el servidor');
        },
      });

      const req = httpTesting.expectOne(baseUrl);
      req.error(new ProgressEvent('network error'));
    });
  });

  describe('getOne', () => {
    it('debería obtener un producto por ID', () => {
      service.getOne('trj-crd').subscribe((product) => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpTesting.expectOne(`${baseUrl}/trj-crd`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProduct);
    });

    it('debería manejar producto no encontrado', () => {
      service.getOne('no-existe').subscribe({
        error: (error) => {
          expect(error.message).toBe('Producto no encontrado');
        },
      });

      const req = httpTesting.expectOne(`${baseUrl}/no-existe`);
      req.flush(
        { message: 'Not product found with that identifier' },
        { status: 404, statusText: 'Not Found' }
      );
    });
  });

  describe('create', () => {
    it('debería crear un producto', () => {
      service.create(mockProduct).subscribe((product) => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpTesting.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockProduct);
      req.flush({ message: 'Product added successfully', data: mockProduct });
    });

    it('debería manejar error de datos inválidos', () => {
      service.create(mockProduct).subscribe({
        error: (error) => {
          expect(error.message).toBe('Datos inválidos');
        },
      });

      const req = httpTesting.expectOne(baseUrl);
      req.flush(
        { message: 'Datos inválidos' },
        { status: 400, statusText: 'Bad Request' }
      );
    });

    it('debería manejar error de ID duplicado', () => {
      service.create(mockProduct).subscribe({
        error: (error) => {
          expect(error.message).toBe('Duplicate identifier found in the database');
        },
      });

      const req = httpTesting.expectOne(baseUrl);
      req.flush(
        { message: 'Duplicate identifier found in the database' },
        { status: 400, statusText: 'Bad Request' }
      );
    });
  });

  describe('update', () => {
    it('debería actualizar un producto', () => {
      const updatedProduct = { ...mockProduct, name: 'Nombre actualizado' };

      service.update('trj-crd', updatedProduct).subscribe((product) => {
        expect(product).toEqual(updatedProduct);
      });

      const req = httpTesting.expectOne(`${baseUrl}/trj-crd`);
      expect(req.request.method).toBe('PUT');
      req.flush({
        message: 'Product updated successfully',
        data: updatedProduct,
      });
    });

    it('debería manejar producto no encontrado al actualizar', () => {
      service.update('no-existe', mockProduct).subscribe({
        error: (error) => {
          expect(error.message).toBe('Producto no encontrado');
        },
      });

      const req = httpTesting.expectOne(`${baseUrl}/no-existe`);
      req.flush(
        { message: 'Not product found with that identifier' },
        { status: 404, statusText: 'Not Found' }
      );
    });
  });

  describe('delete', () => {
    it('debería eliminar un producto', () => {
      service.delete('trj-crd').subscribe((response) => {
        expect(response.message).toBe('Product removed successfully');
      });

      const req = httpTesting.expectOne(`${baseUrl}/trj-crd`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ message: 'Product removed successfully' });
    });

    it('debería manejar producto no encontrado al eliminar', () => {
      service.delete('no-existe').subscribe({
        error: (error) => {
          expect(error.message).toBe('Producto no encontrado');
        },
      });

      const req = httpTesting.expectOne(`${baseUrl}/no-existe`);
      req.flush(
        { message: 'Not product found with that identifier' },
        { status: 404, statusText: 'Not Found' }
      );
    });
  });

  describe('verifyId', () => {
    it('debería retornar true si el ID existe', () => {
      service.verifyId('trj-crd').subscribe((exists) => {
        expect(exists).toBe(true);
      });

      const req = httpTesting.expectOne(`${baseUrl}/verification/trj-crd`);
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });

    it('debería retornar false si el ID no existe', () => {
      service.verifyId('nuevo-id').subscribe((exists) => {
        expect(exists).toBe(false);
      });

      const req = httpTesting.expectOne(`${baseUrl}/verification/nuevo-id`);
      req.flush(false);
    });

    it('debería manejar error en la verificación', () => {
      service.verifyId('error-id').subscribe({
        error: (error) => {
          expect(error.message).toBe('Error interno del servidor');
        },
      });

      const req = httpTesting.expectOne(`${baseUrl}/verification/error-id`);
      req.flush('Error', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });
  });
});
