import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, of, Subject } from 'rxjs';
import * as moment from 'moment';

import { NotificationConstants } from './../../../core/constants/notification.constants';
import { SnackbarService } from './../../../core/services/snackbar.service';
import { NavigationService } from './../../../core/services/navigation.service';
import { TimezoneModel } from '../models/timezone.model';
import { TimezoneListItemModel } from './../models/timezone-list-item.model';
import { TimezonesService } from './timezones.service';
import { TimezonesListModel } from '../models/timezones-list.model';
import { ListQueryInfoModel } from '../../../core/models/list-query-info.model';

@Injectable()
export class TimezonesFacadeService {
  private timezones$$ = new BehaviorSubject<TimezoneListItemModel[]>([]);
  public timezones$ = this.timezones$$.asObservable();

  private timezonesListInfo$$ = new BehaviorSubject<ListQueryInfoModel>(null);
  public timezonesListInfo$ = this.timezonesListInfo$$.asObservable();

  private timezonesIsLoading$$ = new BehaviorSubject<boolean>(false);
  public timezonesIsLoading$ = this.timezonesIsLoading$$.asObservable();

  private selectedTimezone$$ = new BehaviorSubject<TimezoneModel>(null);
  public selectedTimezone$ = this.selectedTimezone$$.asObservable();

  private selectedTimezoneIsLoading$$ = new BehaviorSubject<boolean>(false);
  public selectedTimezoneIsLoading$ = this.selectedTimezoneIsLoading$$.asObservable();

  private errorMessage$$ = new Subject<string>();
  public errorMessage$ = this.errorMessage$$.asObservable();

  constructor(
    private timezoneService: TimezonesService,
    private navigationService: NavigationService,
    private snackbarService: SnackbarService
  ) { }

  public getTimezone(id: number): void {
    this.selectedTimezoneIsLoading$$.next(true);

    this.timezoneService.getTimezone(id)
    .pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        if (errorResponse.status != 401 && errorResponse.status != 403 && errorResponse.status != 404) {
          this.snackbarService.show(NotificationConstants.genericError);
        }

        return of(false);
      })
    ).subscribe((response: TimezoneModel | boolean) => {
      this.selectedTimezoneIsLoading$$.next(false);

      if (response === false) {
        return;
      }

      this.selectedTimezone$$.next(response as TimezoneModel);
    });
  }

  public getTimezonesList(pageIndex = 1, pageSize = 10, name: string = null): void {
    this.timezonesIsLoading$$.next(true);

    this.timezoneService.getTimezonesList(pageIndex, pageSize, name)
    .pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        if (errorResponse.status != 401) {
          this.snackbarService.show(NotificationConstants.genericError);
        }

        return of(false);
      })
    ).subscribe((response: TimezonesListModel | boolean) => {
      this.timezonesIsLoading$$.next(false);

      if (response === false) {
        return;
      }

      const items: TimezoneListItemModel[] = (response as TimezonesListModel).items;
      
      this.setCurrentTimeAndOffset(items);
      this.timezonesListInfo$$.next(response as TimezonesListModel);
    });
  }

  public createTimezone(timezone: TimezoneModel): void {
    this.selectedTimezoneIsLoading$$.next(true);

    this.timezoneService.createTimezone(timezone)
    .pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        if (errorResponse.status == 400 || errorResponse.status == 403) {
          this.errorMessage$$.next(errorResponse.error.message);
        } else if (errorResponse.status != 401) {
          this.errorMessage$$.next(NotificationConstants.genericError);
        }

        return of(false);
      })
    ).subscribe((response: any) => {
      this.selectedTimezoneIsLoading$$.next(false);
      
      if (response === false) {
        return;
      }
      
      this.errorMessage$$.next(null);
      this.navigationService.navigate(['./timezones']);
    });
  }

  public updateTimezone(timezone: TimezoneModel): void {
    this.selectedTimezoneIsLoading$$.next(true);

    this.timezoneService.updateTimezone(timezone)
    .pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        if (errorResponse.status == 400 || errorResponse.status == 403) {
          this.errorMessage$$.next(errorResponse.error.message);
        } else if (errorResponse.status == 404) {
          this.errorMessage$$.next(NotificationConstants.notFound);
        } else if (errorResponse.status != 401) {
          this.errorMessage$$.next(NotificationConstants.genericError);
        }

        return of(false);
      })
    ).subscribe((response: any) => {
      this.selectedTimezoneIsLoading$$.next(false);

      if (response === false) {
        return;
      }

      this.errorMessage$$.next(null);
      this.navigationService.navigate(['./timezones']);
    });
  }

  public deleteTimezone(id: number): void {
    this.timezonesIsLoading$$.next(true);

    this.timezoneService.deleteTimezone(id)
    .pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        if (errorResponse.status == 400 || errorResponse.status == 403) {
          this.snackbarService.show(errorResponse.error.message);
        } else if (errorResponse.status == 404) {
          this.snackbarService.show(NotificationConstants.notFound);
        } else if (errorResponse.status != 401) {
          this.snackbarService.show(NotificationConstants.genericError);
        }

        return of(false);
      })
    ).subscribe((response: any) => {
      this.timezonesIsLoading$$.next(false);

      if (response === false) {
        return;
      }

      this.getTimezonesList();
    });
  }

  public clearSelectedTimezone(): void {
    this.selectedTimezone$$.next(null);
  }

  public clearTimezones(): void {
    this.timezones$$.next([]);
  }

  public setCurrentTimeAndOffset(timezones: TimezoneListItemModel[] = null): void {
    const browserMoment = moment();
    const utcMoment = moment.utc();

    let currentTimezones = timezones ? timezones : this.timezones$$.value;
    currentTimezones = currentTimezones.map(t => {
      const offset: string = t.offset.slice(0, 1);
      const hours: number = +t.offset.slice(1, 3);
      const minutes: number = +t.offset.slice(4, 6);
      const offsetInMinutes: number = +(offset + (hours * 60 + minutes));
    
      let currentTimezoneMoment = moment(utcMoment);
      currentTimezoneMoment.add(offsetInMinutes, 'minutes');

      const browserOffsetInMinutes: number = browserMoment.utcOffset();
      let offsetDiff = offsetInMinutes - browserOffsetInMinutes;

      const browserOffsetSign: string = offsetDiff > 0 ? '+' : offsetDiff == 0 ? '' : '-';
      offsetDiff = Math.abs(offsetDiff);
      const diffHours = Math.floor(offsetDiff / 60);
      const diffMinutes = offsetDiff % 60;

      const browserOffset: string = browserOffsetSign + 
        (diffHours < 10 ? '0' + diffHours : diffHours) + ':' +
        (diffMinutes < 10 ? '0' + diffMinutes : diffMinutes);

      return ({
        ...t,
        currentTime: currentTimezoneMoment.toString(),
        offsetToBrowserTime: browserOffset
      });
    })

    this.timezones$$.next([...currentTimezones]);
  }
}