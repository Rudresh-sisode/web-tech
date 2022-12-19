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
        if(count > 4){
          observable.error(new Error('Count is Greater 3!'));
        }
        count++;
      },1000)
    })
  }

  customeIntervalObserable.pipe(filter(data=>{
    return data > 0
  }), map(data=>{
    return 'round '+(data + 1)
  })).subscribe(data=>{
    console.log('your data ',data);
  })

}