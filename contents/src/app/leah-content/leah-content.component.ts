import { Component } from '@angular/core';
import Artyom from 'artyom.js/build/artyom.js';

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
  constructor() {
    this.artyom = new Artyom();
  }

  run() {
    if (!this.running) {
      this.artyom.say('hello');
      this.running = true;
    } else {
      this.artyom.say('goodbye');
      this.running = false;
    }
  }
}
