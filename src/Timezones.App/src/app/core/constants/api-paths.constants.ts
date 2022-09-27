import { environment } from '../../../environments/environment';

export class ApiPaths {
  public static readonly domainUrl: string = environment.apiUrl;

  // account
  public static readonly accountBaseUrl: string = ApiPaths.domainUrl + 'account';
  public static readonly loginUrl: string = ApiPaths.accountBaseUrl + '/login';
  public static readonly registerUrl: string = ApiPaths.accountBaseUrl + '/register';
  public static readonly changePasswordUrl: string = ApiPaths.accountBaseUrl + '/password';

  // timezones
  public static readonly timezonesBaseUrl: string = ApiPaths.domainUrl + 'timezones';
  public static readonly timezoneByIdUrl = (id: number) => `${ApiPaths.timezonesBaseUrl}/${id}`;

  // users
  public static readonly usersBaseUrl: string = ApiPaths.domainUrl + 'users';
  public static readonly userByIdUrl = (id: number) => `${ApiPaths.usersBaseUrl}/${id}`;
  public static readonly userRolesUrl: string = ApiPaths.usersBaseUrl + '/roles'
}
