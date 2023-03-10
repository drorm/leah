import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
// import { SettingsService } from '../settings/settings.service';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'custom-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent {
  type: string;
  constructor(
    // public dialogRef: MatDialogRef<DialogComponent>,
    // private settingsService: SettingsService,
    private logger: NGXLogger,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.type = data['type'];
  }
  done() {
    this.dialogRef.close();
  }
}
