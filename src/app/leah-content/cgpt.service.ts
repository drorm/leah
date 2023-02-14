/**
 * Send a request to ChatGPT and get the response
 * Adapted from https://github.com/taranjeet/chatgpt-api/blob/main/server.py
 * and others
 */

import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import { NGXLogger } from 'ngx-logger';
// This module can only be referenced with ECMAScript imports/exports by turning on the 'allowSyntheticDefaultImports' flag and referencing its default export.
import LanguageDetect from 'languagedetect';

/**
 * Adapted from https://github.com/taranjeet/chatgpt-api/blob/main/server.py
 * and others
 */
@Injectable({
  providedIn: 'root',
})
export class CgptService {
  textarea: any; // Textarea where the requests are sent
  totalMessages = 0; // total responses from the bot
  sentencesSpoken = 0; // total responses from the bot
  constructor(private logger: NGXLogger) {}
  languageDetect = new LanguageDetect();

  async init() {
    await this.getTextArea();
    if (!this.textarea) {
      this.logger.warn(
        "Please log in to OpenAI Chat. Press enter when you're done"
      );
      return;
    } else {
      this.languageDetect.setLanguageType('iso2');
      this.logger.debug('Logged in to ChatGPT');
    }
  }

  /**
   * Find the textarea where we need to put our requests
   */
  async getTextArea() {
    if (this.textarea) {
      return;
    }
    for (let ii = 0; ii < 5; ii++) {
      const textareas = $('textarea');
      this.logger.debug('textarea', textareas.length);
      if (textareas.length > 0) {
        this.logger.debug('found the textarea');
        this.textarea = textareas[0];
        return;
      }
      await this.sleep(1000);
    }
    return null;
  }

  /**
   * Update the textarea without submitting it.
   */
  updateTextArea(message: string) {
    $('textarea.m-0').val(message);
  }

  /**
   * Send a message to the bot
   */
  async sendMessage(message: string) {
    await this.getTextArea();
    // Send the message
    $('textarea.m-0').val(message);
    const submit = await $('textarea ~ button:enabled');
    if (submit) {
      this.logger.debug('found submit');
      submit.click();
    }
    return submit;
  }

  /**
   * get the last message that the bot sent, the response to our last requests.
   */
  async getMessage(leah: any) {
    let submit: any;
    let text: string | undefined = '';
    this.logger.debug('waiting for submit');
    await this.sleep(1000);
    // limit the number of tries so we're not stuck in this loop
    for (let ii = 0; ii < 100; ii++) {
      const pageElements = $("div[class*='text-base']").toArray();
      const numElements = pageElements.length;
      // first let's find the new element
      this.logger.info('totalMessages', this.totalMessages);
      if (numElements > this.totalMessages) {
        const response = pageElements.pop();
        text = response?.innerText;
        this.logger.info('found an element:', text);
        if (text && text.length > 0) {
          const lines = text.split('\n');
          let sentences = lines.filter((line) => line.length > 0); //
          // if there's more than one sentence,
          // and we haven't spoken it yet, we'll speak the last one
          if (sentences.length > 1 && sentences.length > this.sentencesSpoken) {
            const currentSentence = sentences[sentences.length - 2];
            await this.speakSentence(currentSentence, leah);
          }
          this.sentencesSpoken = sentences.length;
          submit = await $('textarea ~ button:enabled');
          if (submit.length > 0) {
            this.logger.info('got submit');
            if (response) {
              await this.speakSentence(sentences[sentences.length - 1], leah);
              this.totalMessages = pageElements.length;
              text = response.innerText;
              this.logger.info('text:', text);
              return text; // Found it
            }
          }
        }
      }
      this.logger.debug('no submit sleeping');
      await this.sleep(1000);
    }
    return ''; // Didn't get a response
  }

  /**
   * Speak a single sentence
   * @param sentence
   */
  async speakSentence(sentence: string, leah: any) {
    const lang = this.languageDetect.detect(sentence, 1)[0][0];
    this.logger.info(
      // We want to have a new sentence beore we speak the previous one
      'speak sentence:',
      sentence,
      'language:',
      lang
    );
    await leah.speak(sentence);
  }

  sleep(ms: number) {
    return new Promise((resolve) => {
      return setTimeout(resolve, ms);
    });
  }
}
