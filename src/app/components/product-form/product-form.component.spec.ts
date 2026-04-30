import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../../services/product.service';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productServiceSpy: any;

  const mockProduct = {
    id: 'prod-001',
    name: 'Tarjeta de Crédito',
    description: 'Tarjeta de consumo bajo modalidad crédito',
    logo: 'https://example.com/visa.jpg',
    date_release: '2030-01-01',
    date_revision: '2031-01-01',
  };

  const setupTest = async (mockRouteId: string | null = null) => {
    productServiceSpy = {
      getOne: vi.fn().mockReturnValue(of(mockProduct)),
      create: vi.fn().mockReturnValue(of({ message: 'Success', data: mockProduct })),
      update: vi.fn().mockReturnValue(of({ message: 'Success', data: mockProduct })),
      verifyId: vi.fn().mockReturnValue(of(false)),
    };

    const mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: () => mockRouteId,
        },
      },
    };

    const mockRouter = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ProductFormComponent, ReactiveFormsModule],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  describe('Modo Creación (F4)', () => {
    beforeEach(async () => {
      await setupTest();
    });

    it('debería inicializarse en modo creación', () => {
      expect(component['isEditMode']()).toBe(false);
      expect(component['title']()).toBe('Formulario de Registro');
      expect(component['form'].controls.id.disabled).toBe(false);
    });

    it('debería validar campos requeridos', () => {
      expect(component['form'].valid).toBe(false);
      component['form'].markAllAsTouched();
      fixture.detectChanges();
      
      expect(component['form'].controls.id.errors?.['required']).toBeTruthy();
      expect(component['form'].controls.name.errors?.['required']).toBeTruthy();
    });

    it('debería calcular date_revision dinámicamente sumando 1 año', () => {
      component['form'].controls.date_release.setValue('2025-06-15');
      expect(component['form'].controls.date_revision.value).toBe('2026-06-15');
    });

    it('debería llamar a create en submit si es válido', () => {
      component['form'].patchValue({
        id: 'new-id',
        name: 'Nuevo producto',
        description: 'Descripción válida y larga',
        logo: 'logo.jpg',
        date_release: '2030-01-01',
      });
      // Mock validation async to be complete
      component['form'].controls.id.setErrors(null);
      
      component.onSubmit();
      
      expect(productServiceSpy.create).toHaveBeenCalled();
    });
  });

  describe('Modo Edición (F5)', () => {
    beforeEach(async () => {
      await setupTest('prod-001');
    });

    it('debería inicializarse en modo edición y cargar producto', () => {
      expect(component['isEditMode']()).toBe(true);
      expect(component['title']()).toBe('Formulario de Edición');
      expect(productServiceSpy.getOne).toHaveBeenCalledWith('prod-001');
    });

    it('debería deshabilitar el campo ID', () => {
      expect(component['form'].controls.id.disabled).toBe(true);
    });

    it('debería cargar los datos en el formulario', () => {
      expect(component['form'].controls.name.value).toBe(mockProduct.name);
      expect(component['form'].controls.description.value).toBe(mockProduct.description);
      expect(component['form'].controls.date_release.value).toBe('2030-01-01');
      expect(component['form'].controls.date_revision.value).toBe('2031-01-01');
    });

    it('debería llamar a update en submit si es válido', () => {
      component['form'].controls.name.setValue('Nombre editado');
      component.onSubmit();
      
      expect(productServiceSpy.update).toHaveBeenCalled();
      const callArgs = productServiceSpy.update.mock.calls[0];
      expect(callArgs[0]).toBe('prod-001'); // ID parameter
      expect(callArgs[1].name).toBe('Nombre editado'); // Payload
    });
  });
});
