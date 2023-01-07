/**
 * Send a request to ChatGPT and get the response
 * Adapted from https://github.com/taranjeet/chatgpt-api/blob/main/server.py
 * and others
 */

import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import { NGXLogger } from 'ngx-logger';

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
  constructor(private logger: NGXLogger) {}

  async init() {
    await this.getTextArea();
    if (!this.textarea) {
      this.logger.info('Please log in to OpenAI Chat');
      this.logger.info("Press enter when you're done");
      this.logger.info('Logged in');
      return;
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
      this.logger.info('textarea', textareas.length);
      if (textareas.length > 0) {
        this.logger.info('found the textarea');
        this.textarea = textareas[0];
        return;
      }
      await this.sleep(1000);
    }
    return null;
  }

  /**
   * Send a message to the bot
   */
  async sendMessage(message: string) {
    await this.getTextArea();
    // Send the message
    await this.sleep(1000);
    $('textarea.m-0').val(message);
    /*
    const submit = await $('textarea ~ button:enabled');
    if (submit) {
      this.logger.info('found submit');
      submit.click();
    }
    return submit;
   */
  }

  /**
   * get the last message that the bot sent, the response to our last requests.
   */
  async getMessage() {
    let submit: any;
    let text = '';
    this.logger.info('waiting for submit');
    await this.sleep(1000);
    // limit the number of tries so we're not stuck in this loop
    for (let ii = 0; ii < 200; ii++) {
      submit = await $('textarea ~ button:enabled');
      if (submit.length > 0) {
        this.logger.info('got submit');
        const pageElements = $("div[class*='text-base']").toArray();
        const numElements = pageElements.length;
        // first let's find the new element
        console.log('totalMessages', this.totalMessages);
        if (numElements > this.totalMessages) {
          console.log('found one');
          const response = pageElements.pop();
          console.log('response', response);
          if (response) {
            this.totalMessages = pageElements.length;
            text = response.innerText;
            this.logger.info('text:', text);
            return text; // Found it
          }
        }
      }
      this.logger.info('no submit sleeping');
      await this.sleep(500);
    }
    return ''; // Didn't get a response
  }

  sleep(ms: number) {
    return new Promise((resolve) => {
      return setTimeout(resolve, ms);
    });
  }
}