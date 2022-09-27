import { AbstractControl, ValidationErrors } from '@angular/forms';

export function matchValidator(controlName: string, matchingControlName: string, mustMatch: boolean) {
  return (form: AbstractControl): ValidationErrors | null => {
    const control = form.get(controlName);
    const matchingControl = form.get(matchingControlName);

    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      return null;
    }

    if (mustMatch && control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
      return { mustMatch: true };
    } else if (mustMatch && control.value === matchingControl.value) {
      matchingControl.setErrors(null);
      return null;
    }

    if (!mustMatch && control.value === matchingControl.value) {
      matchingControl.setErrors({ mustNotMatch: true });
      return { mustNotMatch: true };
    } else if (!mustMatch && control.value !== matchingControl.value) {
      matchingControl.setErrors(null);
      return null;
    }
  };
}
