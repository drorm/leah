import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { SettingsService } from '../settings/settings.service';

/**
 * SpeechService provides a simple way to use the SpeechSynthesis capability provided in modern browsers.
 */
@Injectable({
  providedIn: 'root',
})

/*
 * Speak the text that's passed in
 * Resources:
 * https://wicg.github.io/speech-api/#tts-section
 * https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
 * https://github.com/microsoft/TypeScript/blob/main/lib/lib.dom.d.ts has the SpeechSynthesis definitions, so we get them for free
 */
export class SpeechService {
  speech: any;
  stopRequest = false;
  voices: SpeechSynthesisVoice[] = [];
  volume = 1; // The volume value, between 0 (lowest) and 1 (highest.)
  rate = 1; // The rate value, between 0.1 (lowest) and 10 (highest), with 1 being the default
  pitch = 1; // The pitch value, between 0 (lowest) and 2 (highest), with 1 being the default
  userSettings: any;
  voice: SpeechSynthesisVoice = {
    default: false,
    lang: 'en-US',
    localService: false,
    name: 'Google US English',
    voiceURI: 'Google US English',
  };

  /**
   * constructor for the SpeechService
   * @param logger - An instance of the NGXLogger for logging
   * @param settingsService - An instance of the settings service for getting the user's desired settings
   */
  constructor(
    private logger: NGXLogger,
    private settingsService: SettingsService
  ) {}

  /**
   * Initializes the speech synthesis by setting the speech property to the window's speechSynthesis.
   */
  async init() {
    this.userSettings = this.settingsService.userSettings;
    this.logger.debug(this.userSettings);
    this.speech = window.speechSynthesis;
    this.speech.cancel(); // Reset it to take care of bugs in the Chrome's engine
    this.logger.debug('init speech');
  }

  /**
   * Get the list of voices available. The drop down in settings gets populated by this list
   * Returns a promise that resolves to an array of SpeechSynthesisVoice objects, representing the available voices for speech synthesis.
   */
  async getVoices() {
    const that = this;
    return new Promise(async (resolve, reject) => {
      const that = this;
      window.speechSynthesis.onvoiceschanged = function () {
        const availableVoices = window.speechSynthesis.getVoices();
        that.voices = availableVoices;
        that.logger.info('Available Speak Voices', availableVoices);
        resolve(availableVoices);
      };
    });
  }

  /*
   * Speaks the provided text using the SpeechSynthesis API, using the user's desired voice and settings.
   * @param text - The text to be spoken
   * 1. Find the voice the user chose; us-en, es-es, etc.
   * 2. Break the text into sentences.
   * 3. Call speakSentence to do the actual speaking
   */
  async speak(text: string) {
    const userVoice = this.userSettings.voice;
    const that = this;
    return new Promise(async (resolve, reject) => {
      // Find out voice in the list of available voices
      const foundVoice = that.voices.filter(function (
        voice: SpeechSynthesisVoice
      ) {
        return voice.lang.toUpperCase() === userVoice.toUpperCase();
      })[0];
      that.voice = foundVoice;
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
            // We got a request to stop, so skip the other sentences
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

  /**
   * Speaks a single sentence using the SpeechSynthesis API and the user's desired voice and settings.
   * @param text - The sentence to be spoken
   */
  async speakSentence(text: string) {
    const that = this;
    return new Promise(async (resolve, reject) => {
      this.logger.debug('speaking', text);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = that.voice;
      this.logger.debug('voice', that.voice);
      utterance.rate = that.userSettings.speed;
      window.speechSynthesis.speak(utterance);
      console.log(utterance); // Do not remove. bug: onend won't fire if we don't have this here.
      utterance.onend = (event) => {
        this.logger.debug('onend');
        resolve(event);
      };
    });
  }

  stop() {
    this.stopRequest = true;
    if (this.speech) {
      this.speech.cancel();
    }
  }

  pause() {
    if (this.speech) {
      this.speech.pause();
    }
  }

  resume() {
    if (this.speech) {
      this.speech.resume();
    }
  }
}
