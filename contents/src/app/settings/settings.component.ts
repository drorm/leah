import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import * as version from '../version';
import { SettingsService } from './settings.service';
import { langs } from './listenLangs';
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

  voices: SpeechSynthesisVoice[] = [
    {
      default: false,
      lang: 'es-ES',
      localService: false,
      name: 'Google US English',
      voiceURI: 'Google US English',
    },
  ];

  hilites = [
    { value: 'yellow', label: 'Yellow background' },
    { value: 'redFont', label: 'Red Font' },
  ];

  listenLangs = langs; // Array of supported languages for listening
  listenRegion = [];
  constructor(
    public dialogRef: MatDialogRef<SettingsComponent>,
    private settingsService: SettingsService,
    private logger: NGXLogger,
    @Inject(MAT_DIALOG_DATA) public data: SpeechSynthesisVoice[]
  ) {
    this.voices = data;
  }

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

  onReadSentence(event: any) {
    this.settingsService.setUserSetting('readSentence', event.checked);
  }

  onSpeedSelect(event: any) {
    this.settingsService.setUserSetting('speed', event.value);
  }

  onVoiceSelect(event: any) {
    this.settingsService.setUserSetting('voice', event.value);
  }

  onListenLangSelect(event: any) {
    this.settingsService.setUserSetting('listenLang', event.value);
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
