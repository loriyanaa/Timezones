import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent implements OnInit {
  public form: FormGroup;
  public showPassword: boolean;

  private hasValidationErrors$$ = new BehaviorSubject<boolean>(false);
  public hasValidationErrors$ = this.hasValidationErrors$$.asObservable();

  constructor(private formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [null, [ Validators.required, Validators.email ]],
      password: [null, Validators.required]
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
}
