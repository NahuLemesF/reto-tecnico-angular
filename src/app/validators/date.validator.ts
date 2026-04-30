import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateReleaseValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    // Convert input to Date (assuming format YYYY-MM-DD)
    const [year, month, day] = control.value.split('-').map(Number);
    const inputDate = new Date(year, month - 1, day);
    inputDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return inputDate >= today ? null : { dateReleaseInvalid: true };
  };
}
