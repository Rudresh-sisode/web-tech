import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChange{
  title = 'on-init-hook';

  constructor() {
    console.log('AppComponent: Constructor');
  }

  ngOnInit() {
    this.title = 'on-init-hook';
    console.log('AppComponent: ngOnInit');
  }
}
