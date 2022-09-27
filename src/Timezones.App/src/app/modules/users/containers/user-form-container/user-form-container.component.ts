import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, Observable, of, Subscription, take } from 'rxjs';

import { ResolutionType } from './../../../../core/enums/resolution-type.enum';
import { ResolutionStateService } from './../../../../core/services/resolution-state.service';
import { AuthService } from './../../../../core/services/auth.service';
import { ConfirmationDialogService } from './../../../../shared/confirmation-dialog/services/confirmation-dialog.service';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { UserModel } from '../../models/user.model';
import { UsersFacadeService } from '../../services/users-facade.service';

@Component({
  selector: 'app-user-form-container',
  templateUrl: './user-form-container.component.html',
  styleUrls: ['./user-form-container.component.scss']
})
export class UserFormContainerComponent implements OnInit, OnDestroy {
  public selectedUser$: Observable<UserModel>;
  public userRoles$: Observable<string[]> = this.usersFacade.userRoles$;
  public selectedUserIsLoading$: Observable<boolean> = this.usersFacade.selectedUserIsLoading$;
  public errorMessage$: Observable<string> = this.usersFacade.errorMessage$;
  public resolution$: Observable<ResolutionType> = this.resolutionStateService.resolution$;

  private subscriptions = new Subscription();

  constructor(
    private usersFacade: UsersFacadeService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private confirmationDialogService: ConfirmationDialogService,
    private resolutionStateService: ResolutionStateService
  ) { }

  public ngOnInit(): void {
    this.usersFacade.getUserRoles();

    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (!id) {
        this.selectedUser$ = of({} as UserModel);
      } else {
        this.usersFacade.getUser(+id);
        this.selectedUser$ = this.usersFacade.selectedUser$;
      }
    });
  }

  public ngOnDestroy(): void {
    this.usersFacade.clearSelectedUser();
    this.usersFacade.clearUserRoles();
    this.subscriptions.unsubscribe();
  }

  public onSave(component: UserFormComponent): void {
    const isValid = component.validate();
    if (!isValid) {
      return;
    }

    this.subscriptions.add(
      this.selectedUser$.pipe(filter(u => !!u)).subscribe((user) => {
        const data: UserModel = {
          ...user,
          ...component.form.value
        };

        if (data?.id) {
          if (this.authService.userId == data.id && (user.roleName != data.roleName || user.email != data.email)) {
            const dialogReference: Observable<boolean> = this.confirmationDialogService.show({
              title: 'Confirmation required',
              content: `If you change your user details you will be logged out of the application and will have to log in again.
                Are you sure you want to continue?`
            });
        
            dialogReference.pipe(take(1)).subscribe((result: boolean) => {
              if (result) {
                this.usersFacade.updateUser(data);
              }
            });
          } else {
            this.usersFacade.updateUser(data);
          }
        } else {
          this.usersFacade.createUser(data);
        }
      })
    );
  }
}
