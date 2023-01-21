import { Component } from '@angular/core';
import { CgptService } from './cgpt.service';
import { VoiceService } from './voice.service';
import { SpeechService } from './speech.service';
import { UtilService } from './util.service';
import { NGXLogger } from 'ngx-logger';
import { SettingsComponent } from '../settings/settings.component';
import { SettingsService } from '../settings/settings.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'custom-leah-content',
  templateUrl: './leah-content.component.html',
  styleUrls: ['./leah-content.component.css'],
})

/*
 *
 */
export class LeahContentComponent {
  speaking = false;
  listening = false;
  conversing = false;
  dictation: any; // Current dictation
  voices: any;

  constructor(
    private gptPage: CgptService,
    private voiceService: VoiceService,
    private utilService: UtilService,
    private speechService: SpeechService,
    private logger: NGXLogger,
    private settingsService: SettingsService,
    public dialog: MatDialog
  ) {
    this.init();
  }

  async init() {
    this.logger.info('init Leah');
    this.settingsService.load();
    await this.speechService.init();
    this.voices = await this.speechService.getVoices();
    await this.gptPage.init();
    await UtilService.sleep(250);
  }

  async converse() {
    while (this.conversing) {
      this.logger.debug('========== new conversation');
      this.voiceService.init('English', 'US');
      this.listening = true;
      let request = '';
      try {
        request = await this.voiceService.fetch();
      } catch (err) {
        // This will also catch 'No speech was detected, try again' which is not really an error
        this.logger.error(err);
        request = '';
      }
      this.listening = false;
      if (request) {
        this.logger.debug('start speech request:', request);
        await this.handleRequest(request);
      }
      await UtilService.sleep(1000);
    }
  }

  async handleRequest(request: string) {
    await this.gptPage.sendMessage(request);
    const response = await this.gptPage.getMessage();
    this.logger.debug('response', response);
    if (response) {
      await this.speak(response);
    }
    this.logger.debug('done speaking', response);
  }

  ngAfterViewInit() {}

  async speak(text: string) {
    this.speaking = true;
    await this.speechService.speak(text);
    this.speaking = false;
  }

  async run() {
    const paragraph = 'Hello';
    // const paragraph = `The winter is typically the rainy season for California, the time of year when many of the state’s aquifers get recharged with precipitation. But snowmelt that begins in the spring and continues throughout the summer is crucial in refilling aquifers, too, typically providing about 30 percent of the water supply for the state. `;
    if (!this.speaking) {
      await this.speak(paragraph);
    } else {
      await this.speechService.stop();
      await this.speak('goodbye');
    }
  }

  async start() {
    this.conversing = true;
    this.converse();
  }

  async stop() {
    this.conversing = false;
    await this.speak('goodbye');
    await this.speechService.stop();
  }

  settings() {
    const dialogRef = this.dialog.open(SettingsComponent, {
      width: '70%',
      data: this.voices,
    });
  }
}
