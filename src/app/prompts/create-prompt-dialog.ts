import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Prompt } from '../settings/settings.service';

/**
 * A dialog to create a prompt with the same fields as the prompts table.
 * @param data The data to be passed to the dialog.
 * @param data.prompt The prompt to be edited.
 */
@Component({
  selector: 'create-prompt-dialog',
  templateUrl: 'create-prompt-dialog.html',
  styleUrls: ['./create-prompt-dialog.css'],
})
export class CreatePromptDialog {
  newPrompt: Prompt = {
    type: '',
    title: '',
    body: '',
    listenVoice: '',
    speakVoice: '',
    prefix: '',
  };
  constructor(
    public dialogRef: MatDialogRef<CreatePromptDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Prompt
  ) {
    this.newPrompt = data;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
//
