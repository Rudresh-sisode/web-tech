import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private activatedSub:Subscription;
  constructor(private  userService:UserService) {}

  ngOnInit() {}

  this.activatedSub = this.userService.activatedEmmitSubject.subscribe(didActive=>{
    this.userActive = didActive
  })

  ngOnDestroy(){
    
  }
}
