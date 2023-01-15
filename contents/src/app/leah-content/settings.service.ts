import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  public static LISTEN_TIMEOUT = 3; // Number of seconds of silence before we respond
}
