import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  speech: any;
  stopRequest = false;
  voices = [];
  volume = 1; // The volume value, between 0 (lowest) and 1 (highest.)
  rate = 1; // The rate value, between 0.1 (lowest) and 10 (highest), with 1 being the default
  pitch = 1; // The pitch value, between 0 (lowest) and 2 (highest), with 1 being the default

  constructor(private logger: NGXLogger) {}

  async init(language = 'en', country = 'us') {
    const that = this;
    this.speech = window.speechSynthesis;
    this.speech.cancel(); // Reset
    this.logger.info('init speech');
    this.speech.onvoiceschanged = function () {
      that.voices = that.speech.getVoices();
      that.logger.info(this.voices);
    };
    this.speech.lang = `${language}-${country}`;
  }

  async speak(text: string) {
    const that = this;
    return new Promise(async (resolve, reject) => {
      /*
       * need to break into sentences to handle Chrome's stupid bug
       * https://stackoverflow.com/questions/21947730/chrome-speech-synthesis-with-longer-texts
       */

      // From https://stackoverflow.com/questions/18914629/split-string-into-sentences-in-javascript
      const sentences = text
        .replace(/(\.+|\:|\!|\?)(\"*|\'*|\)*|}*|]*)(\s|\n|\r|\r\n)/gm, '$1$2|')
        .split('|');
      try {
        for (const sentence of sentences) {
          await this.speakSentence(sentence);
          if (this.stopRequest) {
            // We got a request to stop
            this.stopRequest = false;
            break;
          }
        }
        resolve(null);
      } catch (e) {
        this.logger.error(e);
      }
    });
  }

  async speakSentence(text: string) {
    return new Promise(async (resolve, reject) => {
      this.logger.info('speaking', text);
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
      console.log(utterance); // Do not remove. bug: onend won't fire if we don't have this here.
      utterance.onend = (event) => {
        this.logger.info('onend');
        resolve(event);
      };
    });
  }

  stop() {
    this.stopRequest = true;
    if (this.speech) {
      this.logger.info('Cancel speak');
      this.speech.cancel();
    }
  }

  pause() {
    if (this.speech) {
      this.logger.info('pause speak');
      this.speech.pause();
    }
  }

  resume() {
    if (this.speech) {
      this.logger.info('resume speak');
      this.speech.resume();
    }
  }
}
