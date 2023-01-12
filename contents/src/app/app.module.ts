import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSliderModule } from '@angular/material/slider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { createCustomElement } from '@angular/elements';

import { LeahContentComponent } from './leah-content/leah-content.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [AppComponent, LeahContentComponent, SettingsComponent],
  imports: [
    BrowserModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSliderModule,
    MatGridListModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatSelectModule,
    DragDropModule,
    NgxWebstorageModule.forRoot(),
    LoggerModule.forRoot({
      level: NgxLoggerLevel.INFO,
    }),
  ],
  exports: [MatFormFieldModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private injector: Injector) {
    const leahContent = createCustomElement(LeahContentComponent, {
      injector,
    });
    customElements.define('leah-content', leahContent);
  }
  ngDoBootstrap() {}
}
