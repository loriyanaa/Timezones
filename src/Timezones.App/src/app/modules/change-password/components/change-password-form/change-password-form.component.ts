import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { matchValidator } from '../../../../core/validators/match.validator';
import { passwordValidator } from '../../../../core/validators/password.validator';

@Component({
  selector: 'app-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordFormComponent implements OnInit {
  public form: FormGroup;
  public showCurrentPassword: boolean;
  public showNewPassword: boolean;
  public showConfirmPassword: boolean;

  private hasValidationErrors$$ = new BehaviorSubject<boolean>(false);
  public hasValidationErrors$ = this.hasValidationErrors$$.asObservable();

  constructor(private formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      currentPassword: [null, [ Validators.required ]],
      newPassword: [ null, [
        Validators.required,
        Validators.minLength(8),
        passwordValidator
      ]],
      confirmPassword: [null]
    }, {
      validators: [
        matchValidator('currentPassword', 'newPassword', false),
        matchValidator('newPassword', 'confirmPassword', true)
      ]
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

  public onToggleCurrentPasswordVisibility(): void {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  public onToggleNewPasswordVisibility(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  public onToggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
