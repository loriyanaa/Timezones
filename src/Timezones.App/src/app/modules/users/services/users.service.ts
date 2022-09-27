import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserModel } from '../models/user.model';
import { HttpClientService } from '../../../core/services/http-client.service';
import { ApiPaths } from '../../../core/constants/api-paths.constants';
import { UsersListModel } from '../models/users-list.model';

@Injectable()
export class UsersService {
  constructor(private httpService: HttpClientService) { }

  public getUser(id: number): Observable<UserModel> {
    const requestUrl = ApiPaths.userByIdUrl(id);

    return this.httpService.get(requestUrl);
  }

  public getUsersList(pageIndex: number, pageSize: number, email: string = null): Observable<UsersListModel> {
    const requestUrl = ApiPaths.usersBaseUrl;

    const params: {[key: string]: any} = {
      pageIndex,
      pageSize
    }

    if (email) {
      params['email'] = email;
    }

    return this.httpService.get(requestUrl, params);
  }

  public createUser(user: UserModel): Observable<void> {
    const requestUrl = ApiPaths.usersBaseUrl;

    return this.httpService.post(requestUrl, user);
  }

  public updateUser(user: UserModel): Observable<void> {
    const requestUrl = ApiPaths.userByIdUrl(user.id);

    return this.httpService.put(requestUrl, user);
  }

  public deleteUser(id: number): Observable<void> {
    const requestUrl = ApiPaths.userByIdUrl(id);

    return this.httpService.delete(requestUrl);
  }

  public getUserRoles(): Observable<string[]> {
    const requestUrl = ApiPaths.userRolesUrl;

    return this.httpService.get(requestUrl);
  }
}
