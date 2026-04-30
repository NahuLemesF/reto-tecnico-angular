import { FormControl } from '@angular/forms';
import { of, throwError, firstValueFrom } from 'rxjs';
import { ProductService } from '../services/product.service';
import { idExistsValidator } from './id-exists.validator';
import { vi } from 'vitest';

describe('idExistsValidator', () => {
  let productServiceMock: any;

  beforeEach(() => {
    productServiceMock = {
      verifyId: vi.fn().mockReturnValue(of(false))
    };
  });

  it('debería retornar null si el valor es corto', async () => {
    const control = new FormControl('ab');
    const validator = idExistsValidator(productServiceMock);
    
    const result = await firstValueFrom(validator(control) as any);
    expect(result).toBeNull();
  });

  it('debería retornar { idExists: true } si el ID ya existe', async () => {
    const control = new FormControl('test-id');
    productServiceMock.verifyId.mockReturnValue(of(true));
    const validator = idExistsValidator(productServiceMock);
    
    // We need to wait for the timer(300)
    // But we can also just wait a bit more than 300ms
    const resultPromise = firstValueFrom(validator(control) as any);
    
    const result = await resultPromise;
    expect(result).toEqual({ idExists: true });
    expect(productServiceMock.verifyId).toHaveBeenCalledWith('test-id');
  });

  it('debería retornar null si el ID no existe', async () => {
    const control = new FormControl('new-id');
    productServiceMock.verifyId.mockReturnValue(of(false));
    const validator = idExistsValidator(productServiceMock);
    
    const result = await firstValueFrom(validator(control) as any);
    expect(result).toBeNull();
  });

  it('debería retornar null si hay un error en el servicio', async () => {
    const control = new FormControl('error-id');
    productServiceMock.verifyId.mockReturnValue(throwError(() => new Error('Error')));
    const validator = idExistsValidator(productServiceMock);
    
    const result = await firstValueFrom(validator(control) as any);
    expect(result).toBeNull();
  });
});
