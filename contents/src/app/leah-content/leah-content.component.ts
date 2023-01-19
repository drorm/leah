import { Component } from '@angular/core';
import { CgptService } from './cgpt.service';
import { VoiceService } from './voice.service';
import { SpeechService } from './speech.service';
import { UtilService } from './util.service';
import { NGXLogger } from 'ngx-logger';
import { SettingsComponent } from '../settings/settings.component';
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

  constructor(
    private gptPage: CgptService,
    private voiceService: VoiceService,
    private utilService: UtilService,
    private speechService: SpeechService,
    private logger: NGXLogger,
    public dialog: MatDialog
  ) {
    this.init();
  }

  async init() {
    this.logger.info('init');
    await this.speechService.init('en', 'us');
    await this.gptPage.init();
    await UtilService.sleep(250);
  }

  async converse() {
    while (this.conversing) {
      this.logger.info('========== new conversation');
      this.voiceService.init('English', 'US');
      this.listening = true;
      const request = await this.voiceService.fetch();
      this.listening = false;
      this.logger.info('speech:', request);
      if (request) {
        this.logger.info('========== start handleRequest');
        await this.handleRequest(request);
      }
      await UtilService.sleep(1000);
    }
  }

  async handleRequest(request: string) {
    await this.gptPage.sendMessage(request);
    const response = await this.gptPage.getMessage();
    this.logger.info('response', response);
    if (response) {
      await this.speak(response);
    }
    this.logger.info('done speaking', response);
  }

  ngAfterViewInit() {}

  async speak(text: string) {
    this.speaking = true;
    await this.speechService.speak(text);
    this.speaking = false;
  }

  async run() {
    const paragraph = 'Hello';
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
    });
  }
}
