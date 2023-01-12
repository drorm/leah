import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as version from '../version';
import { SettingsService } from './settings.service';
import { NGXLogger, NgxLoggerLevel } from 'ngx-logger';

@Component({
  // Need to remove view encapsulation so that the custom tooltip style defined in
  // `tooltip-custom-class-example.css` will not be scoped to this component's view.
  encapsulation: ViewEncapsulation.None,
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  settings: any;
  version = version.vars.version;
  released = version.vars.released;
  checked = true;

  speeds = [
    { value: 0.5, label: '0.5 -- slowest' },
    { value: 0.75, label: '0.75 -- slower' },
    { value: 1.0, label: '1.0 -- normal' },
    { value: 1.5, label: '1.5 -- faster' },
    { value: 2.0, label: '2.0 -- fastest' },
  ];

  hilites = [
    { value: 'yellow', label: 'Yellow background' },
    { value: 'redFont', label: 'Red Font' },
  ];

  constructor(
    public dialogRef: MatDialogRef<SettingsComponent>,
    private settingsService: SettingsService,
    private logger: NGXLogger
  ) {}

  onElementsAnimationsToggle(event: any) {}

  onClassroomModeToggle(event: any) {
    this.settingsService.setUserSetting('classroomMode', event.checked);
    /*
    event.checked
      ? this.router.navigate(['/childLib'])
      : this.router.navigate(['/library']);
     */
    return event.checked;
  }

  onAutoReadBook(event: any) {
    this.settingsService.setUserSetting('autoReadBook', event.checked);
  }

  onSpeedSelect(event: any) {
    this.settingsService.setUserSetting('speed', event.value);
  }

  onHiliteSelect(event: any) {
    this.settingsService.setUserSetting('hilite', event.value);
  }

  ngOnInit() {
    this.settings = this.settingsService.userSettings;
  }

  done() {
    this.dialogRef.close();
  }
}
