import { Component } from '@angular/core';
import Artyom from 'artyom.js/build/artyom.js';
import { CgptService } from './cgpt.service';
import { NGXLogger } from 'ngx-logger';
import { SettingsComponent } from '../settings/settings.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'custom-leah-content',
  templateUrl: './leah-content.component.html',
  styleUrls: ['./leah-content.component.css'],
})

/*
 * Functions:
 * Play/Pause
 * Stop
 * Settings
 * Help
 */
export class LeahContentComponent {
  talking = false;
  listening = false;
  conversing = true;
  artyom: any;
  dictation: any; // Current dictation

  constructor(
    private gptPage: CgptService,
    private logger: NGXLogger,
    public dialog: MatDialog
  ) {
    this.init();
  }

  sleep(ms: number) {
    return new Promise((resolve) => {
      return setTimeout(resolve, ms);
    });
  }

  async init() {
    this.artyom = await new Artyom();

    await this.gptPage.init();
    await this.sleep(250);

    // Init the listening
    this.artyom.initialize({
      lang: 'en-US', // US english
      continuous: false, // Don't listen forever
      soundex: true, // Use the soundex algorithm to increase accuracy
      debug: true, // Show messages in the console
      // executionKeyword: 'send it', // TODO. Optional submit word
      listen: true, // Start to listen commands !

      // If providen, you can only trigger a command if you say its name
      // e.g to trigger Good Morning, you need to say "Jarvis Good Morning"
      // name: 'Leah', //TODO use it?
    });
  }

  async converse() {
    while (this.conversing) {
      this.logger.info('========== new conversation');
      const request: any = await this.listen();
      this.logger.info('request', request);
      if (request) {
        this.logger.info('========== start handleRequest');
        await this.handleRequest(request);
        this.logger.info('========== end handleRequest');
      }
      await this.sleep(500);
      this.logger.info('========== end conversation');
    }
  }

  async listen() {
    this.logger.info('------ starting listen');
    const sentences: string[] = [];
    let currInterim = '';
    let currFinal = '';
    const that = this;

    return new Promise(async (resolve) => {
      this.listening = true;
      this.dictation = await this.artyom.newDictation({
        continuous: false, // Enable continuous if HTTPS connection
        onResult: function (text: string, final: string) {
          console.log('inter:', text);
          console.log('final:', final);
          // Do something with the text
          if (currFinal !== final) {
            const newSentence = final.replace(currFinal, '');
            sentences.push(newSentence);
            currFinal = final;
            that.logger.info(`sending stop dictation in onresult`);
            that.stopDictation();
            resolve(sentences.join('. '));
          }
        },
        onStart: function () {
          console.log('Dictation started by the user');
        },
        onEnd: function () {
          console.log('Dictation stopped by the user');
          console.log(sentences);
          // Join the sentences into a paragraph.
          resolve(sentences.join('. '));
        },
      });

      this.logger.info('after dict artyom');
      this.dictation.start();
      for (let ii = 0; ii < 3; ii++) {
        if (currInterim !== '') {
          // Wait till they've started to speak
          await this.sleep(250); // keep checking
          ii = 0;
        }
        this.logger.info(`ii: ${ii}`);
        this.logger.info(`currInterim: ${currInterim}`);
        this.logger.info(`currFinal: ${currFinal}`);
        await this.sleep(1000); // keep checking
      }
    });
  }

  async stopDictation() {
    if (this.artyom && this.artyom.fatality) {
      this.logger.info('------ asked to stop dictation');
      this.listening = false;
      await this.artyom.fatality();
      this.dictation = null;
    }
  }
  async handleRequest(request: string) {
    await this.gptPage.sendMessage(request);
    const response = await this.gptPage.getMessage();
    console.log('response', response);
    if (response) {
      await this.artyom.say(response);
    }
    console.log('done speaking', response);
  }

  ngAfterViewInit() {}

  async run() {
    if (!this.talking) {
      await this.artyom.say('Hello');
      this.talking = true;
    } else {
      this.artyom.shutUp();
      await this.artyom.say('goodbye');
      this.talking = false;
      this.conversing = false;
      this.stopDictation();
    }
  }

  start() {
    this.conversing = true;
    this.converse();
  }

  async stop() {
    this.conversing = false;
    this.artyom.shutUp();
    await this.artyom.say('goodbye');
    this.talking = false;
    this.conversing = false;
    this.listening = false;
  }

  settings() {
    const dialogRef = this.dialog.open(SettingsComponent, {
      width: '70%',
    });
  }
}
