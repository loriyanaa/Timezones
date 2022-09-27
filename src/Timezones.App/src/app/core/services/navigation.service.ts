import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationExtras, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(private router: Router, private location: Location) {}

  public navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
    return this.router.navigate(commands, extras);
  }

  public back(): void {
    this.location.back();
  }
}
