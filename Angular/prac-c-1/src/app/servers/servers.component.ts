import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {

  allowNewServer = false;
  serverCreationStatus = "no server was created!"
  serverName = 'testServer';
  constructor() { }

  ngOnInit(): void {
    setTimeout(()=>{
      this.allowNewServer = true;
    },2000)
  }

  onCreateServer(){
    this.serverCreationStatus = 'server was created!';
  }

  onUpdateServerName(value:any){
    console.log(typeof value, (<HTMLInputElement>value.target).value)
    this.serverName = (<HTMLInputElement>value.target).value;
  }
}

/**
 * Learning Notes OF Events
 * Bindable Properties and Events
 * 
 * How do you know to which Properties or Events of HTML Elements 
 * you may bind? You can basically bind to all Properties and Events - 
 * a good idea is to console.log()  the element you're interested in to 
 * see which properties and events it offers.
 * 
 * Important: For events, you don't bind to onclick but only 
 * to click (=> (click)).
 * 
 * The MDN (Mozilla Developer Network) offers nice lists of all properties 
 * and events of the element you're interested in. Googling for 
 * YOUR_ELEMENT properties  or YOUR_ELEMENT events  should yield nice results.
 * 
 */