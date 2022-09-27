import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimezoneFormContainerComponent } from './containers/timezone-form-container/timezone-form-container.component';
import { TimezonesContainerComponent } from './containers/timezones-container/timezones-container.component';

const routes: Routes = [
  {
    path: '',
    component: TimezonesContainerComponent
  },
  {
    path: 'add',
    component: TimezoneFormContainerComponent
  },
  {
    path: 'edit/:id',
    component: TimezoneFormContainerComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TimezonesRoutingModule { }
