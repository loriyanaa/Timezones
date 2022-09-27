import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { passwordValidator } from '../../../../core/validators/password.validator';
import { matchValidator } from '../../../../core/validators/match.validator';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterFormComponent implements OnInit {
  public form: FormGroup;
  public showPassword: boolean;
  public showConfirmPassword: boolean;

  private hasValidationErrors$$ = new BehaviorSubject<boolean>(false);
  public hasValidationErrors$ = this.hasValidationErrors$$.asObservable();

  constructor(private formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [null, [ Validators.required, Validators.email ]],
      password: [null, [
        Validators.required,
        Validators.minLength(8),
        passwordValidator
      ]],
      confirmPassword: [null]
    }, {
      validators: matchValidator('password', 'confirmPassword', true)
    });
  }

  public validate(): boolean {
    if (this.form.valid) {
      this.hasValidationErrors$$.next(false);
      return true;
    }

    this.hasValidationErrors$$.next(true);
    this.form.markAllAsTouched();

    return false;
  }

  public onTogglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public onToggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
