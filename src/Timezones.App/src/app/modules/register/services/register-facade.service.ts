import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NotificationConstants } from './../../../core/constants/notification.constants';
import { NavigationService } from '../../../core/services/navigation.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterModel } from './../models/register.model';

@Injectable()
export class RegisterFacadeService {
  private errorMessage$$ = new Subject<string>();
  public errorMessage$ = this.errorMessage$$.asObservable();

  constructor(
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private navigationService: NavigationService
  ) { }

  public register(model: RegisterModel): void {
    this.authService
      .register(model.email, model.password)
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

        this.navigationService.navigate(['/login']);
        this.snackbarService.show(NotificationConstants.registrationConfirmation);
        this.errorMessage$$.next(null);
      });
  }
}
