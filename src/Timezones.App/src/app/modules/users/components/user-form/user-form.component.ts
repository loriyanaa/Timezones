import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { ResolutionType } from './../../../../core/enums/resolution-type.enum';
import { matchValidator } from '../../../../core/validators/match.validator';
import { passwordValidator } from '../../../../core/validators/password.validator';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent {
  @Input() set model(model: UserModel) {
    this.data = model;

    this.form.patchValue({
      email: model?.email,
      roleName: model?.roleName
    });

    this.isInEditMode = model?.id ? true : false;

    if (this.isInEditMode) {
      this.form.get('password').clearValidators();
    }
    else {
      this.form.get('password').addValidators([Validators.required, passwordValidator, Validators.minLength(8)]);
      this.form.addValidators(matchValidator('password', 'confirmPassword', true));
    }
  }

  @Input() userRoles: string[];
  @Input() resolution: ResolutionType;

  public data: UserModel;
  public form: FormGroup;
  public showPassword: boolean;
  public showConfirmPassword: boolean;
  public isInEditMode: boolean;
  public ResolutionType = ResolutionType;

  private hasValidationErrors$$ = new BehaviorSubject<boolean>(false);
  public hasValidationErrors$ = this.hasValidationErrors$$.asObservable();

  constructor(private formBuilder: FormBuilder) {
    this.form = this.buildForm();
  }

  public validate(): boolean {
    if (this.form.valid) {
      this.hasValidationErrors$$.next(false);
      return true;
    }

    this.form.markAllAsTouched();
    this.hasValidationErrors$$.next(true);

    return false;
  }

  public onTogglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public onToggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      email: [null, [ Validators.required, Validators.email ]],
      roleName: [null, Validators.required],
      password: [null],
      confirmPassword: [null]
    });
  }
}
