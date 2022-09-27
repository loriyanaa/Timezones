import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { Observable } from 'rxjs';

import { ConfirmationDialogModel } from '../models/confirmation-dialog.model';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';

@Injectable()
export class ConfirmationDialogService {
  constructor(
    public dialog: MatDialog,
    public overlay: Overlay
  ) { }

  public show(data: ConfirmationDialogModel): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: data,
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });

    return dialogRef.afterClosed();
  }
}
