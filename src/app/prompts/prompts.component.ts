import { Component, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { SettingsService } from '../settings/settings.service';
import { NGXLogger, NgxLoggerLevel } from 'ngx-logger';
import { MatDialog } from '@angular/material/dialog';
import { CreatePromptDialog } from './create-prompt-dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Prompt } from '../settings/settings.service';

@Component({
  selector: 'custom-prompts',
  templateUrl: './prompts.component.html',
  styleUrls: ['./prompts.component.css'],
})
export class PromptsComponent {
  displayedColumns: string[] = [
    'actions',
    'type',
    'title',
    'body',
    'listenVoice',
    'speakVoice',
  ];
  prompts = this.settingsService.userSettings.prompts;
  selectedRow: any;
  @ViewChild(MatTable) table!: MatTable<Prompt>;

  constructor(
    private settingsService: SettingsService,
    private dialog: MatDialog,
    private logger: NGXLogger
  ) {
    this.logger.debug('PromptsComponent', this.prompts);
  }

  add() {
    // open a dialog to create a new prompt
    const dialogRef = this.dialog.open(CreatePromptDialog, {
      data: {
        type: '',
        title: '',
        body: '',
        listenVoice: '',
        speakVoice: '',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        result['type'] = 'user';
        this.prompts.push(result);
        this.table.renderRows();
        this.settingsService.setUserSetting('prompts', this.prompts);
      }
    });
  }

  edit(element: Prompt) {
    // open a dialog to edit the selected prompt
    const dialogRef = this.dialog.open(CreatePromptDialog, {
      data: element,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.prompts[this.selectedRow.index] = result;
        this.table.renderRows();
        this.settingsService.setUserSetting('prompts', this.prompts);
      }
    });
  }

  delete(element: Prompt) {
    if (!confirm(`Are you sure you want to delete '${element.title}'?`)) {
      return;
    }

    // delete the selected prompt
    // this.prompts.splice(this.selectedRow.index, 1);
    this.prompts = this.prompts.filter((item: Prompt) => item !== element);
    this.table.renderRows();
    // this.settingsService.setUserSetting('prompts', this.prompts);
  }
}
