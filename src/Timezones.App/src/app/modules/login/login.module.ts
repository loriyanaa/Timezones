import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';

import { LoginRoutingModule } from './login-routing.module';
import { LoginContainerComponent } from './containers/login-container/login-container.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LoginFacadeService } from './services/login-facade.service';

@NgModule({
  declarations: [
    LoginContainerComponent,
    LoginFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatGridListModule
  ],
  providers: [
    LoginFacadeService
  ]
})
export class LoginModule { }
