import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';

import { ChangePasswordFacadeService } from './services/change-password-facade.service';
import { ChangePasswordRoutingModule } from './change-password-routing.module';
import { ChangePasswordContainerComponent } from './containers/change-password-container/change-password-container.component';
import { ChangePasswordFormComponent } from './components/change-password-form/change-password-form.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChangePasswordRoutingModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatGridListModule
  ],
  declarations: [
    ChangePasswordContainerComponent,
    ChangePasswordFormComponent
  ],
  providers: [
    ChangePasswordFacadeService
  ]
})
export class ChangePasswordModule { }
