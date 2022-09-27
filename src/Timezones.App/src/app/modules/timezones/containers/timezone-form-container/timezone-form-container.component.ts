import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, Observable, of, Subscription } from 'rxjs';

import { ResolutionStateService } from './../../../../core/services/resolution-state.service';
import { ResolutionType } from './../../../../core/enums/resolution-type.enum';
import { TimezoneFormComponent } from './../../components/timezone-form/timezone-form.component';
import { TimezoneModel } from './../../models/timezone.model';
import { TimezonesFacadeService } from '../../services/timezones-facade.service';

@Component({
  selector: 'app-timezone-form-container',
  templateUrl: './timezone-form-container.component.html',
  styleUrls: ['./timezone-form-container.component.scss']
})
export class TimezoneFormContainerComponent implements OnInit, OnDestroy {
  public selectedTimezone$: Observable<TimezoneModel>;
  public selectedTimezoneIsLoading$: Observable<boolean> = this.timezonesFacade.selectedTimezoneIsLoading$;
  public resolution$: Observable<ResolutionType> = this.resolutionStateService.resolution$;
  public errorMessage$: Observable<string> = this.timezonesFacade.errorMessage$;

  private subscriptions = new Subscription();

  constructor(
    private timezonesFacade: TimezonesFacadeService,
    private resolutionStateService: ResolutionStateService,
    private route: ActivatedRoute
  ) { }

  public ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (!id) {
        this.selectedTimezone$ = of({} as TimezoneModel);
      } else {
        this.timezonesFacade.getTimezone(+id);
        this.selectedTimezone$ = this.timezonesFacade.selectedTimezone$;
      }
    });
  }

  public ngOnDestroy(): void {
    this.timezonesFacade.clearSelectedTimezone();
    this.subscriptions.unsubscribe();
  }

  public onSave(component: TimezoneFormComponent): void {
    const isValid = component.validate();
    if (!isValid) {
      return;
    }

    this.subscriptions.add(
      this.selectedTimezone$.pipe(filter(c => !!c)).subscribe((timezone) => {
        const data: TimezoneModel = {
          ...timezone,
          ...component.form.value
        };

        if (data?.id) {
          this.timezonesFacade.updateTimezone(data);
        } else {
          this.timezonesFacade.createTimezone(data);
        }
      })
    );
  }
}
