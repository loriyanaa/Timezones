import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NotificationConstants } from './../../../core/constants/notification.constants';
import { NavigationService } from '../../../core/services/navigation.service';
import { AuthService } from '../../../core/services/auth.service';
import { LoginModel } from './../models/login.model';

@Injectable()
export class LoginFacadeService {
  private errorMessage$$ = new Subject<string>();
  public errorMessage$ = this.errorMessage$$.asObservable();

  constructor(
    private authService: AuthService,
    private navigationService: NavigationService
  ) { }

  public login(model: LoginModel): void {
    this.authService
      .login(model.email, model.password)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 400) {
            this.errorMessage$$.next(errorResponse.error.message);
          } else {
            this.errorMessage$$.next(NotificationConstants.genericError);
          }

          return of(false);
        })
      )
      .subscribe((response: any) => {
        if (response === false) {
          return;
        }

        if (this.authService.mustChangePassword(response)) {
          this.navigationService.navigate(['/change-password'], { state: { email: model.email, token: response }});

          return;
        }

        this.authService.setAccessToken(response);

        this.navigationService.navigate(['/timezones']);
        this.errorMessage$$.next(null);
      });
  }
}
