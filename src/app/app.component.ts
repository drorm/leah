import { Component } from '@angular/core';
import Artyom from 'artyom.js/build/artyom.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Leah: Language Educator And Helper';
  artyom = new Artyom();
  constructor() {
    this.artyom.say('Hello World');
  }
}
