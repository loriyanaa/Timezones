import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ChangePasswordModel } from './../../models/change-password.model';
import { ChangePasswordFormComponent } from './../../components/change-password-form/change-password-form.component';
import { ChangePasswordFacadeService } from './../../services/change-password-facade.service';

@Component({
  selector: 'app-change-password-container',
  templateUrl: './change-password-container.component.html',
  styleUrls: ['./change-password-container.component.scss']
})
export class ChangePasswordContainerComponent {
  public errorMessage$: Observable<string> = this.changePasswordFacade.errorMessage$;

  private currentUserEmail: string;
  private token: string;

  constructor(
    private router: Router,
    private changePasswordFacade: ChangePasswordFacadeService
  ) { 
    const routerState = this.router.getCurrentNavigation().extras.state;
    if (!routerState || !routerState['email'] || !routerState['token']) {
      this.router.navigate(['/']);
    }

    this.currentUserEmail = routerState['email'];
    this.token = routerState['token'];
  }

  public onChangePassword(changePasswordForm: ChangePasswordFormComponent): void {
    const isValid = changePasswordForm.validate();
    if (!isValid) {
      return;
    }

    const changePasswordModel: ChangePasswordModel = {
      ...changePasswordForm.form.value,
      email: this.currentUserEmail
    }

    this.changePasswordFacade.changePassword(changePasswordModel, this.token);
  }
}
