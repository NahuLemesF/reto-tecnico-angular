import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { dateReleaseValidator } from '../../validators/date.validator';
import { idExistsValidator } from '../../validators/id-exists.validator';
import { Product } from '../../models/product.interface';
import { calculateRevisionDate } from '../../utils/date.utils';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
})
export class ProductFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly isEditMode = signal(false);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly title = computed(() =>
    this.isEditMode() ? 'Formulario de Edición' : 'Formulario de Registro'
  );

  protected readonly form = this.fb.nonNullable.group({
    id: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
      ],
      [idExistsValidator(this.productService)],
    ],
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
      ],
    ],
    description: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200),
      ],
    ],
    logo: ['', [Validators.required]],
    date_release: ['', [Validators.required, dateReleaseValidator()]],
    date_revision: [{ value: '', disabled: true }],
  });

  ngOnInit(): void {
    this.setupFormReactivity();
    this.checkEditMode();
  }

  private setupFormReactivity(): void {
    this.form.controls.date_release.valueChanges.subscribe((value) => {
      if (!value) {
        this.form.controls.date_revision.setValue('');
        return;
      }
      this.form.controls.date_revision.setValue(calculateRevisionDate(value));
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.form.controls.id.disable();
      this.form.controls.id.clearAsyncValidators();
      this.loadProduct(id);
    }
  }

  private loadProduct(id: string): void {
    this.loading.set(true);
    this.productService.getOne(id).subscribe({
      next: (product) => {
        this.form.patchValue({
          id: product.id,
          name: product.name,
          description: product.description,
          logo: product.logo,
          date_release: product.date_release ? product.date_release.split('T')[0] : '',
        });
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  onReset(): void {
    if (this.isEditMode()) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) this.loadProduct(id);
    } else {
      this.form.reset();
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  onSubmit(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const productData = this.form.getRawValue() as Product;

    const request = this.isEditMode()
      ? this.productService.update(productData.id, productData)
      : this.productService.create(productData);

    request.subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }
}
