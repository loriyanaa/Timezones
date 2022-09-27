import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

import { ResolutionType } from '../../enums/resolution-type.enum';

@Component({
  selector: 'app-navigation-layout',
  templateUrl: './navigation-layout.component.html',
  styleUrls: ['./navigation-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationLayoutComponent {
  @Input() isAuthenticated: boolean;
  @Input() isAdmin: boolean;
  @Input() resolution: ResolutionType;
  @Input() userEmail: string;

  @Output() logout = new EventEmitter<void>();

  @ViewChild('matSidenav') private matSidenav: MatSidenav;
  @ViewChild("matSidenavContent") private matSidenavContent: ElementRef;

  public ResolutionType = ResolutionType;

  public onLogout(): void {
    this.logout.emit();
  }

  public onActivate(): void {
    if (this.matSidenavContent && this.resolution == ResolutionType.Mobile) {
      this.matSidenav.close();
    }
  }
}
