import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import { SettingsService } from '../settings/settings.service';
import { NGXLogger, NgxLoggerLevel } from 'ngx-logger';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'custom-prompts',
  templateUrl: './prompts.component.html',
  styleUrls: ['./prompts.component.css'],
})
export class PromptsComponent {
  displayedColumns: string[] = [
    'type',
    'title',
    'body',
    'listenVoice',
    'speakVoice',
  ];
  prompts = this.settingsService.userSettings.prompts;
  dataSource = this.prompts;
  selectedRow: any;

  constructor(
    private settingsService: SettingsService,
    private logger: NGXLogger
  ) {
    this.logger.trace('PromptsComponent constructor');
    this.logger.info('PromptsComponent', this.prompts);
  }
}
