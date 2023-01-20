import { OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { NGXLogger, NgxLoggerLevel } from 'ngx-logger';
import { LocalStorageService } from 'ngx-webstorage';

const SETTINGS = 'settings';

/**
 * @title Settings service,
 * Loads and saves settings from local storage and makes them available
 * to various parts of the app
 */
@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  userSettings: any = {
    autoReadBook: true,
    hilite: 'yellow',
    speed: 1.0,
    level: 5,
    appMode: 'parent_mode',
    language: 'en',
    voice: 'en-us',
    classroomMode: false,
  };

  // prettier-ignore
  constructor(
    private logger: NGXLogger,
    private storage: LocalStorageService,
  ) {
  }

  /**
   * Load the settings
   * Use the default if a setting is not enabled
   */
  load() {
    const settings = this.storage.retrieve(SETTINGS);
    this.logger.info('default settings:', this.userSettings);
    if (settings) {
      // if thre're settings in localStorage - use them
      if (settings) {
        // If we have previously saved settings
        const settingArray = Object.keys(this.userSettings);
        for (let ii = 0; ii < settingArray.length; ii++) {
          const key = settingArray[ii];
          let value = settings[key];
          if (value === undefined) {
            // This is a new setting created by a new version of the app
            value = this.userSettings[key]; // Set it to the default
          }
        }
        this.logger.info('new settings:', this.userSettings);
        this.userSettings = settings;
      }
    }
  }

  setUserSetting(key: string, value: any) {
    this.userSettings[key] = value;
    this.storage.store(SETTINGS, this.userSettings);
  }

  ngOnInit() {
    this.load();
  }
}
