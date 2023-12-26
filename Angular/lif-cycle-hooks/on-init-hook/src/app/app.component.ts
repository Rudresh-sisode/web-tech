import { Component, OnChanges, OnInit, Input,SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges{
  title = 'on-init-hook';

  @Input() inputMessage: string;

  constructor() {
    console.log('AppComponent: Constructor');
  }

  ngOnInit() {
    this.title = 'on-init-hook';
    console.log('AppComponent: ngOnInit');
  }

  ngOnChanges(changed:SimpleChanges) {
    console.log('AppComponent: ngOnChanges');
    if(changed.inputMessage){
      console.log('AppComponent: ngOnChanges: inputMessage: ', changed.inputMessage.currentValue);
    }
  }
}
