import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ResolutionType } from '../enums/resolution-type.enum';

@Injectable({
  providedIn: 'root'
})
export class ResolutionStateService {
  private resolution$$ = new BehaviorSubject<ResolutionType>(ResolutionType.Mobile);
  public resolution$ = this.resolution$$.asObservable();

  constructor() {
    this.checkResolution();
    window.addEventListener('resize', _ => {
      this.checkResolution();
    });
  }

  private checkResolution(): void {
    if (window.innerWidth < 768) {
      this.resolution$$.next(ResolutionType.Mobile);
    } else {
      this.resolution$$.next(ResolutionType.Desktop);
    }
  }
}
