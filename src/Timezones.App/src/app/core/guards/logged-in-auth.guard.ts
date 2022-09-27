import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { NavigationService } from '../services/navigation.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInAuthGuard implements CanActivate {
  public constructor(
    private authService: AuthService,
    private navigationService: NavigationService
  ) { }

  public canActivate(route: ActivatedRouteSnapshot): boolean {
    return this.checkIfAuthenticated(route);
  }

  private checkIfAuthenticated(route: ActivatedRouteSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      this.navigationService.navigate(['/timezones']);

      return false;
    }

    return true;
  }
}
