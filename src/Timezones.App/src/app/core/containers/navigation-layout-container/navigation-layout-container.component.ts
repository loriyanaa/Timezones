import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { AppConstants } from './../../constants/app.constants';
import { ResolutionType } from '../../enums/resolution-type.enum';
import { AuthService } from '../../services/auth.service';
import { NavigationService } from '../../services/navigation.service';
import { ResolutionStateService } from '../../services/resolution-state.service';

@Component({
  selector: 'app-navigation-layout-container',
  templateUrl: './navigation-layout-container.component.html',
  styleUrls: ['./navigation-layout-container.component.scss']
})
export class NavigationLayoutContainerComponent {
  public resolution$: Observable<ResolutionType> = this.resolutionStateService.resolution$;
  public isAuthenticated: boolean = this.authService.isAuthenticated();
  public isAdmin: boolean = this.authService.userRole === AppConstants.adminRole;
  public userEmail: string = this.authService.userEmail;

  constructor(
    private authService: AuthService,
    private navigationService: NavigationService,
    private resolutionStateService: ResolutionStateService
  ) { }

  public onLogout(): void {
    this.authService.logout();
    this.navigationService.navigate(['/login']);
  }
}
