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
  listening = false;
  conversing = true;
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
    this.logger.info('init');
  }

  async init() {
    await this.speechService.init('en', 'us');
    await this.gptPage.init();
    await UtilService.sleep(250);
  }

  async converse() {
    while (this.conversing) {
      console.log('========== new conversation');
      this.voiceService.init('English', 'US');
      const request = await this.voiceService.fetch();
      this.logger.info('speech:', request);
      //const request: any = await this.listen();
      //console.log('request', request);
      if (request) {
        console.log('========== start handleRequest');
        await this.handleRequest(request);
        console.log('========== end handleRequest');
      }
      await UtilService.sleep(1000);
      console.log('========== end conversation');
    }
  }

  async handleRequest(request: string) {
    await this.gptPage.sendMessage(request);
    const response = await this.gptPage.getMessage();
    console.log('response', response);
    if (response) {
      await this.speechService.speak(response);
    }
    console.log('done speaking', response);
  }

  ngAfterViewInit() {}

  async run() {
    if (!this.conversing) {
      await this.speechService.speak('hello');
      this.conversing = true;
    } else {
      await this.speechService.speak('goodbye');
      await this.speechService.stop();
      this.conversing = false;
    }
  }

  async start() {
    this.conversing = true;
    this.converse();
  }

  async stop() {
    this.conversing = false;
    await this.speechService.speak('goodbye');
    await this.speechService.stop();
    this.conversing = false;
    this.listening = false;
  }

  settings() {
    const dialogRef = this.dialog.open(SettingsComponent, {
      width: '70%',
    });
  }
}
