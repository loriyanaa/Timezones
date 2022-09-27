import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { interval, Observable, Subscription, take } from 'rxjs';

import { PageEvent } from '@angular/material/paginator';

import { NavigationService } from './../../../../core/services/navigation.service';
import { ConfirmationDialogService } from './../../../../shared/confirmation-dialog/services/confirmation-dialog.service';
import { TimezoneListItemModel } from './../../models/timezone-list-item.model';
import { ListQueryInfoModel } from '../../../../core/models/list-query-info.model';
import { TimezonesFacadeService } from '../../services/timezones-facade.service';

@Component({
  selector: 'app-timezones-container',
  templateUrl: './timezones-container.component.html',
  styleUrls: ['./timezones-container.component.scss']
})
export class TimezonesContainerComponent implements OnInit, OnDestroy {
  public timezones$: Observable<TimezoneListItemModel[]> = this.timezonesFacade.timezones$;
  public timezonesIsLoading$: Observable<boolean> = this.timezonesFacade.timezonesIsLoading$;
  public timezonesListInfo$: Observable<ListQueryInfoModel> = this.timezonesFacade.timezonesListInfo$;
  public filter: string;

  private interval: Observable<number> = interval(500);
  private subscriptions = new Subscription();

  constructor(
    private navigationService: NavigationService,
    private confirmationDialogService: ConfirmationDialogService,
    private route: ActivatedRoute,
    private timezonesFacade: TimezonesFacadeService) { }

  public ngOnInit(): void {
    this.subscriptions.add(this.route.queryParams.subscribe((params: Params) => {
      const pageIndex = +params['pageIndex'] || 1;
      const pageSize = +params['pageSize'] || 10;
      const name = params['name'];
      
      this.filter = name || null;
      this.timezonesFacade.getTimezonesList(pageIndex, pageSize, name);
    }));

    this.subscriptions.add(
      this.interval.subscribe(() => this.timezonesFacade.setCurrentTimeAndOffset())
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.timezonesFacade.clearTimezones();
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
    const dialogReference: Observable<boolean> = this.confirmationDialogService.show({
      title: 'Confirmation required',
      content: 'Are you sure you want to delete this record?'
    });

    dialogReference.pipe(take(1)).subscribe((result: boolean) => {
      if (result) {
        this.timezonesFacade.deleteTimezone(itemId);
        
        this.navigationService.navigate(
          [],
          {
            queryParams: {
              pageIndex: 1,
              pageSize: 10,
              name: null
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
      name: filter ? filter : null
    }

    this.navigationService.navigate(
      [],
      {
        queryParams,
        queryParamsHandling: 'merge'
      });
  }
}
