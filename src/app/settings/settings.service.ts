import { OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { NGXLogger, NgxLoggerLevel } from 'ngx-logger';
import { LocalStorageService } from 'ngx-webstorage';
import { defaultPrompts } from './prompts';
import * as version from '../version';

const SETTINGS = 'Leah-settings';

/**
 * @title Settings service,
 * Loads and saves settings from local storage and makes them available
 * to various parts of the app
 */

export interface Prompt {
  type: string;
  title: string;
  body: string;
  listenVoice: string;
  speakVoice: string;
  prefix?: string;
}

export enum VersionStatus {
  NEW = 'new',
  NOCHANGE = 'nochange',
  UPGRADE = 'upgrade',
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  public static readonly PROMPT_NONE = 'none';
  currentVersion = version.vars.version;
  versionStatus: VersionStatus = VersionStatus.NOCHANGE;

  userSettings: any = {
    readSentence: true,
    hilite: 'yellow',
    speed: 1.0,
    listenLang: 'en-US',
    voice: 'en-US',
    recognitionProgress: true,
    prompts: [],
    chosenPrompt: 'none',
    version: '',
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
    this.userSettings.prompts = defaultPrompts;
    const settings = this.storage.retrieve(SETTINGS);
    this.logger.debug('default settings:', this.userSettings);
    if (settings) {
      // If we have previously saved settings
      const settingArray = Object.keys(this.userSettings);
      for (let ii = 0; ii < settingArray.length; ii++) {
        const key = settingArray[ii];
        let value = settings[key];
        if (value === undefined) {
          // This is a new setting created by a new version of the app
          settings[key] = this.userSettings[key]; // Set it to the default
        }
      }
      this.userSettings = settings;
      if (this.userSettings.version !== this.currentVersion) {
        // This is an upgrade. Technically, it could be a downgrade, but we don't care
        this.versionStatus = VersionStatus.UPGRADE;
      }
    } else {
      // This is the first time the app has been run
      this.versionStatus = VersionStatus.NEW;
    }
    this.logger.debug('version status:', this.versionStatus);
    this.userSettings.version = this.currentVersion;
    this.storage.store(SETTINGS, this.userSettings); // In case it's the first time
    this.logger.debug('new settings:', this.userSettings);
  }

  setUserSetting(key: string, value: any) {
    this.userSettings[key] = value;
    this.storage.store(SETTINGS, this.userSettings);
  }

  ngOnInit() {
    this.load();
  }

  getVersionStatus(): VersionStatus {
    return this.versionStatus;
  }
}
