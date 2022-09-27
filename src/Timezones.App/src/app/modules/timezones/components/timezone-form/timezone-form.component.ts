import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { ValidationConstants } from './../../../../core/constants/validation.constants';
import { TimezoneModel } from '../../models/timezone.model';
import { ResolutionType } from './../../../../core/enums/resolution-type.enum';

@Component({
  selector: 'app-timezone-form',
  templateUrl: './timezone-form.component.html',
  styleUrls: ['./timezone-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimezoneFormComponent {
  @Input() set model(model: TimezoneModel) {
    this.data = model;

    this.form.patchValue({
      name: model?.name,
      city: model?.city,
      offset: model?.offset
    });
  }

  @Input() resolution: ResolutionType;

  public data: TimezoneModel;
  public form: FormGroup;
  public ResolutionType = ResolutionType;

  private hasValidationErrors$$ = new BehaviorSubject<boolean>(false);
  public hasValidationErrors$ = this.hasValidationErrors$$.asObservable();

  constructor(private formBuilder: FormBuilder) {
    this.form = this.buildForm();
  }

  public validate(): boolean {
    if (this.form.valid) {
      this.hasValidationErrors$$.next(false);
      return true;
    }

    this.form.markAllAsTouched();
    this.hasValidationErrors$$.next(true);

    return false;
  }

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      name: [null, [ Validators.required, Validators.maxLength(100) ]],
      city: [null, [ Validators.required, Validators.maxLength(100) ]],
      offset: [null, [ 
        Validators.required,
        Validators.pattern(ValidationConstants.offsetPattern)
      ]]
    });
  }
}
