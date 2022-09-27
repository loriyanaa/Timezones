import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './services/confirmation-dialog.service';

@NgModule({
  declarations: [
    ConfirmationDialogComponent
  ],
  providers: [
    ConfirmationDialogService,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class ConfirmationDialogModule { }
