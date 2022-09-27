import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

import { ConfirmationDialogModule } from './../../shared/confirmation-dialog/confirmation-dialog.module';
import { TimezonesContainerComponent } from './containers/timezones-container/timezones-container.component';
import { TimezonesRoutingModule } from './timezones-routing.module';
import { TimezonesComponent } from './components/timezones/timezones.component';
import { TimezonesFacadeService } from './services/timezones-facade.service';
import { TimezonesService } from './services/timezones.service';
import { TimezoneFormContainerComponent } from './containers/timezone-form-container/timezone-form-container.component';
import { TimezoneFormComponent } from './components/timezone-form/timezone-form.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TimezonesRoutingModule,
    ConfirmationDialogModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule,
    MatGridListModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    TimezonesContainerComponent,
    TimezonesComponent,
    TimezoneFormContainerComponent,
    TimezoneFormComponent
  ],
  providers: [
    TimezonesFacadeService,
    TimezonesService
  ]
})
export class TimezonesModule { }
