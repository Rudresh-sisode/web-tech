import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { OnChangedComponentComponent } from './on-changed-component/on-changed-component.component';

@NgModule({
  declarations: [
    AppComponent,
    OnChangedComponentComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
