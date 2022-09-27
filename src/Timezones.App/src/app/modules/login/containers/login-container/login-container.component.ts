import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { LoginFormComponent } from './../../components/login-form/login-form.component';
import { LoginFacadeService } from './../../services/login-facade.service';

@Component({
  selector: 'app-login-container',
  templateUrl: './login-container.component.html',
  styleUrls: ['./login-container.component.scss']
})
export class LoginContainerComponent {
  public errorMessage$: Observable<string> = this.loginFacade.errorMessage$;

  constructor(private loginFacade: LoginFacadeService) { }

  public onLogin(loginForm: LoginFormComponent): void {
    const isValid = loginForm.validate();
    if (!isValid) {
      return;
    }

    this.loginFacade.login(loginForm.form.value);
  }
}
