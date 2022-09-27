import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';

import { RegisterContainerComponent } from './containers/register-container/register-container.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterFacadeService } from './services/register-facade.service';


@NgModule({
  imports: [
    CommonModule,
    RegisterRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatGridListModule
  ],
  declarations: [
    RegisterContainerComponent,
    RegisterFormComponent
  ],
  providers: [
    RegisterFacadeService
  ]
})
export class RegisterModule { }
