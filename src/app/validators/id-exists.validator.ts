import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ProductService } from '../services/product.service';

export function idExistsValidator(productService: ProductService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.value.length < 3) {
      return of(null);
    }

    // Debounce de 300ms para evitar múltiples peticiones mientras el usuario escribe
    return timer(300).pipe(
      switchMap(() => productService.verifyId(control.value)),
      map((exists) => (exists ? { idExists: true } : null)),
      catchError(() => of(null)) // En caso de error, no bloqueamos la validación del formulario
    );
  };
}
