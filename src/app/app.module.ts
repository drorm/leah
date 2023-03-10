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
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyModule } from '@ngx-formly/core';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { createCustomElement } from '@angular/elements';

import { LeahContentComponent } from './leah-content/leah-content.component';
import { SettingsComponent } from './settings/settings.component';
import { DialogComponent } from './dialog/dialog.component';
import { PromptsComponent } from './prompts/prompts.component';
import { CreatePromptDialog } from './prompts/create-prompt-dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LeahContentComponent,
    SettingsComponent,
    DialogComponent,
    PromptsComponent,
    CreatePromptDialog,
  ],
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
    MatCardModule,
    MatTableModule,
    MatSelectModule,
    DragDropModule,
    FormlyMaterialModule,
    FormlyModule.forRoot({
      validationMessages: [
        { name: 'required', message: 'This field is required' },
      ],
    }),
    FormsModule,
    ReactiveFormsModule,
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
