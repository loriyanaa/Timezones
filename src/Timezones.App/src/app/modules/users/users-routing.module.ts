import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserFormContainerComponent } from './containers/user-form-container/user-form-container.component';
import { UsersContainerComponent } from './containers/users-container/users-container.component';

const routes: Routes = [
  {
    path: '',
    component: UsersContainerComponent
  },
  {
    path: 'add',
    component: UserFormContainerComponent
  },
  {
    path: 'edit/:id',
    component: UserFormContainerComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
