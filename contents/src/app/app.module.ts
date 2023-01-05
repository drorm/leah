import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSliderModule } from '@angular/material/slider';
import { MatGridListModule } from '@angular/material/grid-list';

import { createCustomElement } from '@angular/elements';

import { LeahContentComponent } from './leah-content/leah-content.component';

@NgModule({
  declarations: [AppComponent, LeahContentComponent],
  imports: [
    BrowserModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSliderModule,
    MatGridListModule,
  ],
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
