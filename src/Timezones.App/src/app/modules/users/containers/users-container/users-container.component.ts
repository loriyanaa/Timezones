import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription, take } from 'rxjs';

import { PageEvent } from '@angular/material/paginator';

import { AuthService } from './../../../../core/services/auth.service';
import { NavigationService } from './../../../../core/services/navigation.service';
import { ConfirmationDialogService } from './../../../../shared/confirmation-dialog/services/confirmation-dialog.service';
import { ListQueryInfoModel } from '../../../../core/models/list-query-info.model';
import { UsersFacadeService } from '../../services/users-facade.service';
import { UserModel } from './../../models/user.model';

@Component({
  selector: 'app-users-container',
  templateUrl: './users-container.component.html',
  styleUrls: ['./users-container.component.scss']
})
export class UsersContainerComponent implements OnInit, OnDestroy {
  public users$: Observable<UserModel[]> = this.usersFacade.users$;
  public usersIsLoading$: Observable<boolean> = this.usersFacade.usersIsLoading$;
  public usersListInfo$: Observable<ListQueryInfoModel> = this.usersFacade.usersListInfo$;
  public filter: string;

  private subscriptions = new Subscription();

  constructor(
    private navigationService: NavigationService,
    private confirmationDialogService: ConfirmationDialogService,
    private route: ActivatedRoute,
    private usersFacade: UsersFacadeService,
    private authService: AuthService
  ) { }

  public ngOnInit(): void {
    this.subscriptions.add(this.route.queryParams.subscribe((params: Params) => {
      const pageIndex = +params['pageIndex'] || 1;
      const pageSize = +params['pageSize'] || 10;
      const email = params['email'];
      this.filter = email || null;

      this.usersFacade.getUsersList(pageIndex, pageSize, email);
    }));
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.usersFacade.clearUsers();
  }

  public onEdit(itemId: number): void {
    this.navigationService.navigate(
      [`./edit/${itemId}`],
      { relativeTo: this.route }
    );
  }

  public onAdd(): void {
    this.navigationService.navigate(
      [`./add`],
      { relativeTo: this.route }
    );
  }

  public onDelete(itemId: number): void {
    const message = `If you delete your account you will no longer have access to the application. 
      Are you sure you want to continue?`;

    const dialogReference: Observable<boolean> = this.confirmationDialogService.show({
      title: 'Confirmation required',
      content: this.authService.userId == itemId ? message : 'Are you sure you want to delete this record?'
    });
 
    dialogReference.pipe(take(1)).subscribe((result: boolean) => {
      if (result) {
        this.usersFacade.deleteUser(itemId);
        
        this.navigationService.navigate(
          [],
          {
            queryParams: {
              pageIndex: 1,
              pageSize: 10,
              email: null
            },
            queryParamsHandling: 'merge'
          });
      }
    });
  }

  public onPage(event: PageEvent): void {
    this.navigationService.navigate(
      [],
      {
        queryParams: {
          pageIndex: event.pageIndex + 1,
          pageSize: event.pageSize,
        },
        queryParamsHandling: 'merge'
      });
  }

  public onFilter(filter: string): void {
    const queryParams: Params = {
      pageIndex: 1,
      pageSize: 10,
      email: filter ? filter : null
    }

    this.navigationService.navigate(
      [],
      {
        queryParams,
        queryParamsHandling: 'merge'
      });
  }
}
