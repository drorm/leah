import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  speech: any;
  voices = [];
  volume = 1; //A float that represents the volume value, between 0 (lowest) and 1 (highest.)
  rate = 1; //A float representing the rate value. It can range between 0.1 (lowest) and 10 (highest), with 1 being the default
  pitch = 1; // A float representing the pitch value. It can range between 0 (lowest) and 2 (highest), with 1 being the default

  constructor(private logger: NGXLogger) {}

  async init(language = 'en', country = 'us') {
    const that = this;
    this.speech = window.speechSynthesis;
    this.logger.info('init speech');
    this.speech.onvoiceschanged = function () {
      that.voices = that.speech.getVoices();
      this.logger.info(this.voices);
    };
    this.speech.lang = `${language}-${country}`;
  }

  async speak(text: string) {
    try {
      this.logger.info('speaking', text);
      const utterance = new SpeechSynthesisUtterance(text);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      this.logger.error(e);
    }
  }

  stop() {
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
