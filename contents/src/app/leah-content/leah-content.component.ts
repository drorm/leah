import { Component } from '@angular/core';
import Artyom from 'artyom.js/build/artyom.js';
import { CgptService } from './cgpt.service';
import { NGXLogger } from 'ngx-logger';

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
  running = false;
  artyom: any;

  constructor(private gptPage: CgptService, private logger: NGXLogger) {
    this.init();
    this.artyom = new Artyom();
  }

  sleep(ms: number) {
    return new Promise((resolve) => {
      return setTimeout(resolve, ms);
    });
  }

  async listen() {
    await this.sleep(250);

    this.artyom.initialize({
      lang: 'en-US', // GreatBritain english
      continuous: false, // Listen forever
      soundex: true, // Use the soundex algorithm to increase accuracy
      debug: true, // Show messages in the console
      executionKeyword: 'submit it',
      listen: true, // Start to listen commands !

      // If providen, you can only trigger a command if you say its name
      // e.g to trigger Good Morning, you need to say "Jarvis Good Morning"
      name: 'Leah',
    });

    console.log('voices', this.artyom.getVoices());
    const sentences: string[] = [];
    let prevFinal = '';
    return new Promise(async (resolve) => {
      const dictation = await this.artyom.newDictation({
        continuous: false, // Enable continuous if HTTPS connection
        onResult: function (text: string, final: string) {
          // Do something with the text
          if (prevFinal !== final) {
            const newSentence = final.replace(prevFinal, '');
            sentences.push(newSentence);
            prevFinal = final;
          }
          console.log('inter:', text);
          console.log('final:', final);
        },
        onStart: function () {
          console.log('Dictation started by the user');
        },
        onEnd: function () {
          alert('Dictation stopped by the user');
          console.log(sentences);
          // Join the sentences into a paragraph.
          const response = sentences.join('. ');
          resolve(response);
        },
      });
      this.logger.info('after dict artyom');
      dictation.start();
    });
  }

  async init() {
    await this.gptPage.init();
    const request: any = await this.listen();
    this.logger.info('request', request);
    this.handleRequest(request);
  }

  async handleRequest(request: string) {
    await this.gptPage.sendMessage(request);
    const response = await this.gptPage.getMessage();
    console.log('response', response);
    if (response) {
      this.artyom.say(response);
    }
  }

  ngAfterViewInit() {}
  run() {
    if (!this.running) {
      this.artyom.say(
        "It is not possible to know for certain what color cats dream in, as we have no way of directly observing the dreams of cats or other animals. Dreams are a product of the brain's activity during sleep, and they are thought to be a way for the brain to process and consolidate memories, as well as to practice skills and behaviors that are important for survival."
      );
      this.running = true;
    } else {
      this.artyom.shutUp();
      this.artyom.say('goodbye');
      this.running = false;
    }
  }
}
