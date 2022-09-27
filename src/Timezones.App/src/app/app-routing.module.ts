import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoggedInAuthGuard } from './core/guards/logged-in-auth.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { NavigationLayoutContainerComponent } from './core/containers/navigation-layout-container/navigation-layout-container.component';
import { AppConstants } from './core/constants/app.constants';
import { PageInfoContainerComponent } from './core/containers/page-info-container/page-info-container.component';

export const routes: Routes = [
  {
    path: '',
    component: NavigationLayoutContainerComponent,
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: 'timezones',
            pathMatch: 'full'
          },
          {
            path: 'timezones',
            loadChildren: () => import('./modules/timezones/timezones.module').then(m => m.TimezonesModule)
          },
          {
            path: 'users',
            loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule),
            data: {
              role: AppConstants.adminRole
            }
          },
          {
            path: 'page-not-found',
            component: PageInfoContainerComponent,
            data: {
              message: 'The page you are looking for cannot be found'
            }
          },
          {
            path: 'page-not-accessible',
            component: PageInfoContainerComponent,
            data: {
              message: 'The page you are looking for has restricted access'
            }
          }
        ]
      }
    ]
  },
  {
    path: 'login',
    canActivate: [LoggedInAuthGuard],
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'register',
    canActivate: [LoggedInAuthGuard],
    loadChildren: () => import('./modules/register/register.module').then(m => m.RegisterModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./modules/change-password/change-password.module').then(m => m.ChangePasswordModule)
  },
  {
    path: '**',
    redirectTo: 'page-not-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
