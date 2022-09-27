import { FormControl, ValidationErrors } from '@angular/forms';

export function passwordValidator(control: FormControl): ValidationErrors | null {
  if (control.value) {
    const regex = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])');
    const result = regex.test(control.value);
    if (!result) {
      return {
        password: true
      };
    }

    return null;
  }

  return null;
}
