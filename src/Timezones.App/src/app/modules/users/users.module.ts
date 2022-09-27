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
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ConfirmationDialogModule } from './../../shared/confirmation-dialog/confirmation-dialog.module';
import { UsersContainerComponent } from './containers/users-container/users-container.component';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './components/users/users.component';
import { UsersFacadeService } from './services/users-facade.service';
import { UsersService } from './services/users.service';
import { UserFormContainerComponent } from './containers/user-form-container/user-form-container.component';
import { UserFormComponent } from './components/user-form/user-form.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UsersRoutingModule,
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
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    UsersContainerComponent,
    UsersComponent,
    UserFormContainerComponent,
    UserFormComponent
  ],
  providers: [
    UsersFacadeService,
    UsersService
  ]
})
export class UsersModule { }
