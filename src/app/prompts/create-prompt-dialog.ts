import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Prompt } from '../settings/settings.service';
import { FormControl, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NGXLogger, NgxLoggerLevel } from 'ngx-logger';

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
  form = new FormGroup({});
  error = '';
  fields: FormlyFieldConfig[] = [];
  model: Object = {}; // Model for the form
  newPrompt: Prompt = {
    type: '',
    title: '',
    body: '',
    listenVoice: '',
    speakVoice: '',
    prefix: '',
  };
  constructor(
    private logger: NGXLogger,
    public dialogRef: MatDialogRef<CreatePromptDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Prompt
  ) {
    this.fields = [
      {
        key: 'title',
        type: 'input',
        templateOptions: {
          type: 'string',
          label: 'Title',
          placeholder: 'Enter the title',
          required: true,
        },
      },
      {
        key: 'body',
        type: 'textarea',
        templateOptions: {
          rows: 5,
          autosize: true,
          label: 'Body',
          placeholder: 'Enter the prompt',
          required: true,
        },
      },
      {
        key: 'listenVoice',
        type: 'input',
        templateOptions: {
          type: 'input',
          label: 'Listen Voice',
          placeholder: 'Enter the listen voice',
          required: true,
        },
      },
      {
        key: 'speakVoice',
        type: 'input',
        templateOptions: {
          type: 'input',
          label: 'Speak Voice',
          placeholder: 'Enter the speaking voice',
          required: true,
        },
      },
      {
        key: 'prefix',
        type: 'input',
        templateOptions: {
          type: 'input',
          label: 'Prefix',
          placeholder: 'Optional prefix added before each question',
          required: false,
        },
      },
    ];
  }

  create() {
    this.dialogRef.close(this.newPrompt);
  }

  cancel(): void {
    this.dialogRef.close(this.newPrompt);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
//
