import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';

import {Post} from './post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts:Post[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchPosts();
   }

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    console.log(postData);
    this.http.post('https://myfirst-242709-default-rtdb.firebaseio.com/posts.json', postData)
    .subscribe(
      {
        next: (response) =>{
          console.log("response from backend ",response);
        },
        error: (error)=>{
          console.log("your error occured here ",error);
        },
        complete: ()=>{
          //pass done.
        }
      }
    )
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();

  }

  private fetchPosts(){
    this.http.get<{[key:string]:Post}>('https://myfirst-242709-default-rtdb.firebaseio.com/posts.json')
    .pipe(map((responseData : {[key:string]:Post}) =>{
      const postArray:Post[] = [];
      for(const key in responseData){
        if(responseData.hasOwnProperty(key)){
          postArray.push({...responseData[key], id:key});
        }
      }
      return postArray;
    }))
    .subscribe(
      {
        next:(posts)=>{
          console.log('get response ',posts);
          this.loadedPosts = posts
        },
        error:(error)=>{

        },
        complete:()=>{

        }
      }
    )
  }

  onClearPosts() {
    // Send Http request
  }
}
