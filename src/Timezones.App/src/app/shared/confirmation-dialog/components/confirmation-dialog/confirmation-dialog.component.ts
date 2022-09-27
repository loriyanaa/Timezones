import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ConfirmationDialogModel } from '../../models/confirmation-dialog.model';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent, string>,
    @Inject(MAT_DIALOG_DATA) public dialogData: ConfirmationDialogModel) {}

  public onNoClick(): void {
    this.dialogRef.close();
  }
}
