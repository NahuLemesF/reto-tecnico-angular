import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from '../models/product.interface';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/bp/products`;

  getAll(): Observable<Product[]> {
    return this.http
      .get<{ data: Product[] }>(this.baseUrl)
      .pipe(
        map((response) => response.data),
        catchError(this.handleError)
      );
  }

  getOne(id: string): Observable<Product> {
    return this.http
      .get<Product>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  create(product: Product): Observable<Product> {
    return this.http
      .post<{ message: string; data: Product }>(this.baseUrl, product)
      .pipe(
        map((response) => response.data),
        catchError(this.handleError)
      );
  }

  update(id: string, product: Partial<Product>): Observable<Product> {
    return this.http
      .put<{ message: string; data: Product }>(`${this.baseUrl}/${id}`, product)
      .pipe(
        map((response) => response.data),
        catchError(this.handleError)
      );
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  verifyId(id: string): Observable<boolean> {
    return this.http
      .get<boolean>(`${this.baseUrl}/verification/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.status === 0) {
      errorMessage = 'No se pudo conectar con el servidor';
    } else if (error.status === 400) {
      errorMessage = error.error?.message || 'Datos inválidos';
    } else if (error.status === 404) {
      errorMessage = 'Producto no encontrado';
    } else if (error.status >= 500) {
      errorMessage = 'Error interno del servidor';
    }

    return throwError(() => new Error(errorMessage));
  }
}
