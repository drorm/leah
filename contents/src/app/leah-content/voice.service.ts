import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { UtilService } from './util.service';
import { SettingsService } from './settings.service';

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

  constructor(private logger: NGXLogger, private utilService: UtilService) {}

  init(language: string, country: string) {
    this.logger.info('init VoiceService');
    if ('webkitSpeechRecognition' in window) {
      this.logger.info('got  webkitSpeechRecognition');
      this.recognition = new webkitSpeechRecognition();
      this.recognition.lang = language + '-' + country; //TODO
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
      this.recognition.continuous = true;
    } else {
      console.log('Speech recognition not supported in this browser');
    }
  }

  async fetch(): Promise<any> {
    let currFinal = '';
    let fullTranscript = '';
    let speechStarted = false;
    let speaking = false;

    return new Promise(async (resolve, reject) => {
      if (this.recognition) {
        this.recognition.onend = (event: SpeechRecognitionEvent) => {
          console.log('recognition.onend');
          console.log(fullTranscript);
          resolve(fullTranscript);
        };

        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
          speechStarted = true;
          const results = event.results;
          this.logger.debug('results', event.results);
          for (let ii = event.resultIndex; ii < event.results.length; ++ii) {
            if (event.results[ii].isFinal) {
              fullTranscript += event.results[ii][0].transcript;
              console.log('onresult fullTranscript', fullTranscript);
              speaking = false;
            } else {
              speaking = true;
            }
          }
        };

        this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          switch (event.error) {
            case 'not-allowed':
              console.log('Permission to use microphone was denied');
              reject('Permission to use microphone was denied');
              break;
            case 'service-not-allowed':
              console.log('Microphone is not available');
              reject('Microphone is not available');
              break;
            case 'no-speech':
              console.log('No speech was detected, try again');
              reject('No speech was detected, try again');
              break;
            default:
              console.log('An error occurred: ' + event.error);
              reject('An error occurred: ' + event.error);
              break;
          }
        };
        this.recognition.start();
        for (let ii = 0; ii < SettingsService.LISTEN_TIMEOUT; ii++) {
          if (!speechStarted || speaking) {
            // Wait till they've started to speak
            await UtilService.sleep(500); // keep checking
            ii = 0;
          }
          console.log(`ii: ${ii}`);
          console.log(`fullTranscript: ${fullTranscript}`);
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
      this.logger.info('stop request');
      this.recognition.stop();
    }
  }
}
