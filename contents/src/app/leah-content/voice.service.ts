import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { UtilService } from './util.service';
import { SettingsService } from '../settings/settings.service';

/**
 * VoiceService handles speech recognition capability provided in *Google Chrome*.
 * https://developer.chrome.com/blog/voice-driven-web-apps-introduction-to-the-web-speech-api/
 * https://wicg.github.io/speech-api/#speechreco-section
 */
declare var webkitSpeechRecognition: any;

// From https://github.com/DefinitelyTyped/DefinitelyTyped/blob/20217c8228ad3837045c450e389fe92e8598cdd7/types/dom-speech-recognition/index.d.ts
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: SpeechRecognitionErrorCode;
  readonly message: string;
}

type SpeechRecognitionErrorCode =
  | 'aborted'
  | 'audio-capture'
  | 'bad-grammar'
  | 'language-not-supported'
  | 'network'
  | 'no-speech'
  | 'not-allowed'
  | 'service-not-allowed';

@Injectable({
  providedIn: 'root',
})
export class VoiceService {
  private recognition: any;
  private voices: any;
  private done = false;
  private retries = 2; // retry 2 more times if speech is not detected. Each try is around 8 seconds

  constructor(
    private logger: NGXLogger,
    private utilService: UtilService,
    private settingsService: SettingsService
  ) {}

  init(language: string, country: string) {
    this.logger.debug('init VoiceService');
    if ('webkitSpeechRecognition' in window) {
      this.logger.debug('got  webkitSpeechRecognition');
      this.recognition = new webkitSpeechRecognition();
      const userListenLang = this.settingsService.userSettings.listenLang;
      this.logger.debug(userListenLang);
      this.recognition.lang = userListenLang;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
      this.recognition.continuous = true;
      this.done = false;
    } else {
      this.logger.error('Speech recognition not supported in this browser');
    }
  }

  async fetch(updateTextArea?: Function): Promise<any> {
    let currFinal = '';
    let fullTranscript = '';
    let speechStarted = false;
    let speaking = false;

    return new Promise(async (resolve, reject) => {
      const that = this;
      if (this.recognition) {
        this.recognition.onend = (event: SpeechRecognitionEvent) => {
          this.done = true;
          that.logger.debug('recognition.onend:', fullTranscript);
          resolve(fullTranscript);
        };

        /*
         * See https://developer.chrome.com/blog/voice-driven-web-apps-introduction-to-the-web-speech-api/
         * The recognition has two kinds of results: interim and final.
         * As it hears words, it makes guesses at what they are, these are the interim results.
         * These can change as it collects more words.
         * When it decides what a sentence/phrase is, it's final, and moves on to the next one.
         * The sentences are put put into a "result" object, and the conversation has an array of results.
         * See https://wicg.github.io/speech-api/#dom-speechrecognitionevent-results
         */
        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
          speechStarted = true;
          const results = event.results;
          that.logger.debug('results', event.results);
          for (let ii = event.resultIndex; ii < event.results.length; ++ii) {
            if (that.done) {
              break;
            }
            const currResult = event.results[ii];
            if (currResult.isFinal) {
              fullTranscript += currResult[0].transcript;
              that.logger.info('onresult fullTranscript', fullTranscript);
              speaking = false;
            } else {
              if (updateTextArea) {
                updateTextArea(fullTranscript + currResult[0].transcript);
              }
              that.logger.debug(
                'onresult interim_transcript',
                currResult[0].transcript
              );
              speaking = true;
            }
          }
        };

        this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          switch (event.error) {
            case 'not-allowed':
              that.logger.error('Permission to use microphone was denied');
              reject('Permission to use microphone was denied');
              break;
            case 'service-not-allowed':
              that.logger.error('Microphone is not available');
              reject('Microphone is not available');
              break;
            case 'no-speech':
              that.logger.error('No speech was detected, try again');
              if (that.retries > 0) {
                //We keep trying until we reach the limit
                that.logger.debug(`Try #${that.retries}`);
                that.retries--;
              } else {
                reject('No speech was detected, try again');
              }
              break;
            default:
              that.logger.error('An error occurred: ' + event.error);
              reject('An error occurred: ' + event.error);
              break;
          }
        };
        this.recognition.start();
        this.logger.debug(`starting recognition`);
        for (let ii = 0; ii < UtilService.LISTEN_TIMEOUT; ii++) {
          if (!speechStarted || speaking) {
            // Wait till they've started to speak
            await UtilService.sleep(500); // keep checking
            ii = 0;
          }
          that.logger.debug(`ii: ${ii} fullTranscript: ${fullTranscript}`);
          await UtilService.sleep(1000); // keep checking
        }
        this.stop();
      } else {
        reject('Speech recognition not supported in this browser');
      }
    });
  }

  stop() {
    if (this.recognition) {
      this.logger.debug('stop request');
      this.recognition.stop();
    }
  }
}
