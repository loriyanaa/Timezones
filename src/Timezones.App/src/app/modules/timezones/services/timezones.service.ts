import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TimezoneModel } from './../models/timezone.model';
import { HttpClientService } from './../../../core/services/http-client.service';
import { ApiPaths } from './../../../core/constants/api-paths.constants';
import { TimezonesListModel } from '../models/timezones-list.model';

@Injectable()
export class TimezonesService {
  constructor(private httpService: HttpClientService) { }

  public getTimezone(id: number): Observable<TimezoneModel> {
    const requestUrl = ApiPaths.timezoneByIdUrl(id);

    return this.httpService.get(requestUrl);
  }

  public getTimezonesList(pageIndex: number, pageSize: number, name: string = null): Observable<TimezonesListModel> {
    const requestUrl = ApiPaths.timezonesBaseUrl;

    const params: {[key: string]: any} = {
      pageIndex,
      pageSize
    }

    if (name) {
      params['name'] = name;
    }

    return this.httpService.get(requestUrl, params);
  }

  public createTimezone(timezone: TimezoneModel): Observable<void> {
    const requestUrl = ApiPaths.timezonesBaseUrl;

    return this.httpService.post(requestUrl, timezone);
  }

  public updateTimezone(timezone: TimezoneModel): Observable<void> {
    const requestUrl = ApiPaths.timezoneByIdUrl(timezone.id);

    return this.httpService.put(requestUrl, timezone);
  }

  public deleteTimezone(id: number): Observable<void> {
    const requestUrl = ApiPaths.timezoneByIdUrl(id);

    return this.httpService.delete(requestUrl);
  }
}
