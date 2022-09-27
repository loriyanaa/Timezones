import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { NavigationService } from '../services/navigation.service';
import { AppConstants } from './../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {
  public constructor(
    private authService: AuthService,
    private navigationService: NavigationService
  ) { }

  public canActivateChild(route: ActivatedRouteSnapshot): boolean {
    return this.checkIfAuthenticated(route);
  }

  private checkIfAuthenticated(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      this.navigationService.navigate(['/login']);

      return false;
    }

    if (route.data['role'] === AppConstants.adminRole && this.authService.userRole != AppConstants.adminRole) {
      this.navigationService.navigate(['/']);
      return false;
    }

    return true;
  }
}
