import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, ConfirmModalComponent],
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  // Estado reactivo con signals
  protected readonly products = signal<Product[]>([]);
  protected readonly loading = signal(true);
  protected readonly searchTerm = signal('');
  protected readonly pageSize = signal(5);
  protected readonly error = signal<string | null>(null);
  protected readonly openMenuId = signal<string | null>(null);
  protected readonly deleteTarget = signal<Product | null>(null);

  // Estado derivado con computed()
  protected readonly filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const all = this.products();
    if (!term) return all;
    return all.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.id.toLowerCase().includes(term)
    );
  });

  protected readonly paginatedProducts = computed(() =>
    this.filteredProducts().slice(0, this.pageSize())
  );

  protected readonly resultCount = computed(() => this.filteredProducts().length);

  protected readonly skeletonRows = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);
    this.productService.getAll().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.pageSize.set(Number(target.value));
  }

  navigateToAdd(): void {
    this.router.navigate(['/products/add']);
  }

  editProduct(product: Product): void {
    this.openMenuId.set(null);
    this.router.navigate(['/products/edit', product.id]);
  }

  toggleMenu(productId: string): void {
    this.openMenuId.set(this.openMenuId() === productId ? null : productId);
  }

  confirmDelete(product: Product): void {
    this.openMenuId.set(null);
    this.deleteTarget.set(product);
  }

  onDeleteConfirm(): void {
    const target = this.deleteTarget();
    if (!target) return;

    this.productService.delete(target.id).subscribe({
      next: () => {
        this.products.update((products) =>
          products.filter((p) => p.id !== target.id)
        );
        this.deleteTarget.set(null);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.deleteTarget.set(null);
      },
    });
  }

  onDeleteCancel(): void {
    this.deleteTarget.set(null);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent) {
      const fallback = document.createElement('div');
      fallback.className = 'logo-fallback';
      fallback.textContent = '📦';
      parent.appendChild(fallback);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    // Si el clic no fue dentro de un dropdown-wrapper, cerramos el menú abierto
    if (!target.closest('.dropdown-wrapper')) {
      this.openMenuId.set(null);
    }
  }
}
