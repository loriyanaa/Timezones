import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { RegisterFormComponent } from './../../components/register-form/register-form.component';
import { RegisterModel } from './../../models/register.model';
import { RegisterFacadeService } from './../../services/register-facade.service';

@Component({
  selector: 'app-register-container',
  templateUrl: './register-container.component.html',
  styleUrls: ['./register-container.component.scss']
})
export class RegisterContainerComponent {
  public errorMessage$: Observable<string> = this.registerFacade.errorMessage$;

  constructor(
    private registerFacade: RegisterFacadeService
  ) { }

  public onRegister(registerForm: RegisterFormComponent): void {
    const isValid = registerForm.validate();
    if (!isValid) {
      return;
    }

    const registerModel: RegisterModel = registerForm.form.value;
    this.registerFacade.register(registerModel);
  }
}
