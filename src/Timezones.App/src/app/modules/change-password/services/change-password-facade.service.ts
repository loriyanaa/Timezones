import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NotificationConstants } from './../../../core/constants/notification.constants';
import { AuthService } from '../../../core/services/auth.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { ChangePasswordModel } from './../models/change-password.model';

@Injectable()
export class ChangePasswordFacadeService {
  private errorMessage$$ = new Subject<string>();
  public errorMessage$ = this.errorMessage$$.asObservable();

  constructor(
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private navigationService: NavigationService
  ) { }

  public changePassword(model: ChangePasswordModel, token: string): void {
    this.authService
      .changePassword(model.email, model.currentPassword, model.newPassword)
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
      .subscribe((response) => {
        if (response === false) {
          return;
        }

        this.authService.setAccessToken(token);
        this.navigationService.navigate(['/']);
        this.snackbarService.show(NotificationConstants.passwordChangeConfirmation);
        this.errorMessage$$.next(null);
      });
  }
}
