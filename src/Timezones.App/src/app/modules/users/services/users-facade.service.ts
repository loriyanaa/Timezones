import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, of, Subject } from 'rxjs';

import { NotificationConstants } from './../../../core/constants/notification.constants';
import { AuthService } from './../../../core/services/auth.service';
import { SnackbarService } from './../../../core/services/snackbar.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { UserModel } from '../models/user.model';
import { UsersService } from './users.service';
import { UsersListModel } from '../models/users-list.model';
import { ListQueryInfoModel } from '../../../core/models/list-query-info.model';

@Injectable()
export class UsersFacadeService {
  private users$$ = new BehaviorSubject<UserModel[]>([]);
  public users$ = this.users$$.asObservable();

  private userRoles$$ = new BehaviorSubject<string[]>([]);
  public userRoles$ = this.userRoles$$.asObservable();

  private userRolesIsLoading$$ = new BehaviorSubject<boolean>(false);
  public userRolesIsLoading$ = this.userRolesIsLoading$$.asObservable();

  private usersListInfo$$ = new BehaviorSubject<ListQueryInfoModel>(null);
  public usersListInfo$ = this.usersListInfo$$.asObservable();

  private usersIsLoading$$ = new BehaviorSubject<boolean>(false);
  public usersIsLoading$ = this.usersIsLoading$$.asObservable();

  private selectedUser$$ = new BehaviorSubject<UserModel>(null);
  public selectedUser$ = this.selectedUser$$.asObservable();

  private selectedUserIsLoading$$ = new BehaviorSubject<boolean>(false);
  public selectedUserIsLoading$ = this.selectedUserIsLoading$$.asObservable();

  private errorMessage$$ = new Subject<string>();
  public errorMessage$ = this.errorMessage$$.asObservable();

  constructor(
    private userService: UsersService,
    private navigationService: NavigationService,
    private snackbarService: SnackbarService,
    private authService: AuthService
  ) { }

  public getUser(id: number): void {
    this.selectedUserIsLoading$$.next(true);

    this.userService.getUser(id)
    .pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        if (errorResponse.status != 401 && errorResponse.status != 404) {
          this.snackbarService.show(NotificationConstants.genericError);
        }

        return of(false);
      })
    ).subscribe((response: UserModel | boolean) => {
      this.selectedUserIsLoading$$.next(false);

      if (response === false) {
        return;
      }

      this.selectedUser$$.next(response as UserModel);
    });
  }

  public getUsersList(pageIndex = 1, pageSize = 10, email: string = null): void {
    this.usersIsLoading$$.next(true);

    this.userService.getUsersList(pageIndex, pageSize, email)
    .pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        if (errorResponse.status != 401) {
          this.snackbarService.show(NotificationConstants.genericError);
        }

        return of(false);
      })
    ).subscribe((response: UsersListModel | boolean) => {
      this.usersIsLoading$$.next(false);

      if (response === false) {
        return;
      }

      const users: UserModel[] = (response as UsersListModel).items;
      
      this.users$$.next(users);
      this.usersListInfo$$.next(response as UsersListModel);
    });
  }

  public createUser(user: UserModel): void {
    this.selectedUserIsLoading$$.next(true);

    this.userService.createUser(user)
    .pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        if (errorResponse.status == 400) {
          this.errorMessage$$.next(errorResponse.error.message);
        } else if (errorResponse.status != 401) {
          this.errorMessage$$.next(NotificationConstants.genericError);
        }

        return of(false);
      })
    ).subscribe((response: any) => {
      this.selectedUserIsLoading$$.next(false);

      if (response === false) {
        return;
      }

      this.errorMessage$$.next(null);
      this.navigationService.navigate(['./users']);
    });
  }

  public updateUser(user: UserModel): void {
    this.selectedUserIsLoading$$.next(true);

    this.userService.updateUser(user)
    .pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        if (errorResponse.status == 400) {
          this.errorMessage$$.next(errorResponse.error.message);
        } else if (errorResponse.status == 404) {
          this.errorMessage$$.next(NotificationConstants.notFound);
        } else if (errorResponse.status != 401) {
          this.errorMessage$$.next(NotificationConstants.genericError);
        }

        return of(false);
      })
    ).subscribe((response: any) => {
      this.selectedUserIsLoading$$.next(false);

      if (response === false) {
        return;
      }

      if (user.id == this.authService.userId && 
        (this.selectedUser$$.value.roleName != user.roleName || this.selectedUser$$.value.email != user.email)) {
        this.authService.logout();
        this.navigationService.navigate(['/login']);
        return;
      }

      this.errorMessage$$.next(null);
      this.navigationService.navigate(['./users']);
    });
  }

  public deleteUser(id: number): void {
    this.usersIsLoading$$.next(true);

    this.userService.deleteUser(id)
    .pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        if (errorResponse.status == 400) {
          this.snackbarService.show(errorResponse.error.message);
        } else if (errorResponse.status == 404) {
          this.snackbarService.show(NotificationConstants.notFound);
        } else if (errorResponse.status != 401) {
          this.snackbarService.show(NotificationConstants.genericError);
        }

        return of(false);
      })
    ).subscribe((response: any) => {
      this.usersIsLoading$$.next(false);

      if (response === false) {
        return;
      }

      if (id == this.authService.userId) {
        this.authService.logout();
        this.navigationService.navigate(['/login']);
        return;
      }

      this.getUsersList();
    });
  }

  public getUserRoles(): void {
    this.userRolesIsLoading$$.next(true);

    this.userService.getUserRoles().subscribe((response: string[]) => {
      this.userRoles$$.next(response);
      this.userRolesIsLoading$$.next(false);
    });
  }

  public clearSelectedUser(): void {
    this.selectedUser$$.next(null);
  }

  public clearUsers(): void {
    this.users$$.next([]);
  }

  public clearUserRoles(): void {
    this.userRoles$$.next([]);
  }
}