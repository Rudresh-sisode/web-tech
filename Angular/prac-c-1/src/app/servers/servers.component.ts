import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {

  allowNewServer = false;
  serverCreationStatus = "no server was created!"
  constructor() { }

  ngOnInit(): void {
    setTimeout(()=>{
      this.allowNewServer = true;
    },2000)
  }

  onCreateServer(){
    this.serverCreationStatus = 'server was created!';
  }

}
