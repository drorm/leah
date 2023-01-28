import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
 public static LISTEN_TIMEOUT = 3; // Number of seconds of silence before we respond
  constructor() {}

  static sleep(ms: number) {
    return new Promise((resolve) => {
      return setTimeout(resolve, ms);
    });
  }
}
