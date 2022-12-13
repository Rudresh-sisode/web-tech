import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const customeIntervalObserable = Observable.create(observable=>{
      let count = 0;

      setInterval(()=>{
        observable.next(count)
        count++;
      },1000)
    })
  }

  customeIntervalObserable.subscribe(data=>{
    console.log('your data ',data);
  })

}