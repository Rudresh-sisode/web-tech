import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { FormsModule } from '@angular/forms';//required for template driven approches
import { FormGroup, ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
    // FormsModule,//require for template driven approches
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
