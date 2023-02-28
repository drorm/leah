import { Component } from '@angular/core';
import { CgptService } from './cgpt.service';
import { VoiceService } from './voice.service';
import { SpeechService } from './speech.service';
import { UtilService } from './util.service';
import { NGXLogger } from 'ngx-logger';
import { SettingsComponent } from '../settings/settings.component';
import { DialogComponent } from '../dialog/dialog.component';
import { SettingsService, VersionStatus } from '../settings/settings.service';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

const WAITING = 'press the red button to start';

@Component({
  selector: 'custom-leah-content',
  templateUrl: './leah-content.component.html',
  styleUrls: ['./leah-content.component.css'],
})

/*
 * Leah main module. Basic steps:
 * 1. Load and inject the prompt.
 * 2. Listen to the mic
 * 3. Send to chatGPT
 * 4. Speak the response
 */
export class LeahContentComponent {
  speaking = false;
  listening = false;
  conversing = false;
  promptSet = false;
  currentPrompt: any = null;
  dictation: any; // Current dictation
  voices: any;
  status = WAITING;
  userSettings: any;

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
    await this.settingsService.load();
    this.userSettings = this.settingsService.userSettings;
    this.logger.debug('userSettings', this.userSettings);
    await this.speechService.init();
    await this.versionCheck();
    this.voices = await this.speechService.getVoices();
    await this.gptPage.init();
    await UtilService.sleep(250);
  }

  async converse() {
    while (this.conversing) {
      this.logger.debug('========== new conversation');
      this.voiceService.init('English', 'US');
      this.listening = true;
      this.setStatus('Listening ...');
      let request = '';
      try {
        request = await this.voiceService.fetch(this.gptPage.updateTextArea);
      } catch (err) {
        // This will also catch 'No speech was detected, try again' which is not really an error
        this.logger.error(err);
        this.listening = false;
        this.setStatus(WAITING);
        alert(err);
        return;
      }
      this.listening = false;
      if (request) {
        this.logger.debug('start speech request:', request);
        await this.handleRequest(request);
      }
      await UtilService.sleep(1000);
    }
  }

  /**
   * Send the request to chatGPT and speak the response.
   * @param request The request to send to chatGPT
   * @param doPrefix If true, add the prefix to the request
   */
  async handleRequest(request: string, doPrefix = true) {
    if (this.currentPrompt && this.currentPrompt.prefix && doPrefix) {
      request = `${this.currentPrompt.prefix} ${request}\n`;
      this.logger.debug('request with prefix', request);
    }
    await this.gptPage.sendMessage(request);
    this.setStatus('Waiting for bot');
    const response = await this.gptPage.getMessage(this);
    this.logger.debug('response', response);
    if (response) {
      // this.setStatus('Bot is speaking');
      //  await this.speak(response);
    }
    this.logger.debug('done speaking', response);
  }

  ngAfterViewInit() {}

  async speak(text: string) {
    this.setStatus('Bot is speaking');
    this.speaking = true;
    await this.speechService.speak(text);
    this.speaking = false;
    this.setStatus('');
  }

  async run() {
    const paragraph = 'Hello';
    // const paragraph = `The winter is typically the rainy season for California, the time of year when many of the state’s aquifers get recharged with precipitation. But snowmelt that begins in the spring and continues throughout the summer is crucial in refilling aquifers, too, typically providing about 30 percent of the water supply for the state. `;
    if (!this.speaking) {
      await this.speak(paragraph);
    } else {
      await this.speechService.stop();
    }
  }

  async start() {
    if (!this.currentPrompt) {
      //only once and after the user clicked on the icon
      await this.setPrompt();
    }
    this.conversing = true;
    this.converse();
  }

  async stop() {
    this.conversing = false;
    await this.speak('goodbye');
    await this.speechService.stop();
  }

  async stopListen() {
    this.conversing = false;
    this.listening = false;
    await this.voiceService.stop();
    this.setStatus(WAITING);
  }

  settings() {
    const dialogRef = this.dialog.open(SettingsComponent, {
      width: '70%',
      data: this.voices,
    });
  }

  setStatus(message: string) {
    this.status = message;
  }

  /*
   * If the user chose a prompt, we inject the prompt whenever the page is loaded.
   */

  async setPrompt() {
    const promptName = this.userSettings.chosenPrompt;
    // prettier-ignore
    if (promptName && (promptName !== SettingsService.PROMPT_NONE)) {
      this.listening = false;
      // Find the prompts in the array of available prompts.
      const myPrompt = this.userSettings.prompts.filter(
        (pr: any) => pr.title === promptName
      );
      this.logger.debug('myPrompt:', myPrompt);
      if (myPrompt && myPrompt[0]) {
        this.currentPrompt = myPrompt[0];
        // send the prompt but do not prefix it
        await this.handleRequest(this.currentPrompt.body, false);
      }
    }
  }

  async versionCheck() {
    const versionStatus = this.settingsService.getVersionStatus();
    if (versionStatus === VersionStatus.NOCHANGE) {
      return; // No change, no need to show the dialog
    }
    await this.dialog.open(DialogComponent, {
      data: { type: versionStatus },
    });
  }
}
