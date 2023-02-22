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
import { langs } from '../settings/listenLangs';

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
  model: Prompt = {
    type: '',
    title: '',
    body: '',
    listenVoice: '',
    speakVoice: '',
    prefix: '',
  };
  listenLangs = [{}];
  speechLangs = [{}];
  isUpdate = false;

  constructor(
    private logger: NGXLogger,
    public dialogRef: MatDialogRef<CreatePromptDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Prompt
  ) {
    if (data.title !== '') {
      this.model = data;
      this.isUpdate = true;
    }
    this.init();
  }

  async init() {
    // Setup the langues structure for the select boxes
    langs.forEach((lang: any) => {
      this.listenLangs.push({ label: lang[0], value: lang[1] });
    });
    // we can just get the voices since we've already loaded them once in speech.service.ts
    const slangs = window.speechSynthesis.getVoices();
    slangs.forEach((lang: any) => {
      this.speechLangs.push({ label: lang.name, value: lang.lang });
    });

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
        type: 'select',
        templateOptions: {
          options: this.listenLangs,
          label: 'Listen Voice',
          placeholder: 'Enter the listen voice',
          required: true,
        },
      },
      {
        key: 'speakVoice',
        type: 'select',
        templateOptions: {
          options: this.speechLangs,
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

    // On update
    if (this.isUpdate) {
      // when editing a prompt, we want to set the default value for the speakVoice and listenVoice select boxes
      // to the current value of the prompt
      this.fields[2].defaultValue = this.model.listenVoice;
      this.fields[3].defaultValue = this.model.speakVoice;
    }
  }

  create() {
    this.dialogRef.close(this.model);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
//
