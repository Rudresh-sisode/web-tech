import { Component, OnInit,OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';

import {Post} from './post.model';
import { PostService } from './posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts:Post[] = [];
  isFetching = false;
  error = null;
  private errorSub : Subscription;
  constructor(private http: HttpClient,private postService:PostService) { }

  ngOnInit() {

    this.errorSub = this.postService.error.subscribe(errorMessage=>{
      this.error = errorMessage
    })

    this.fetchPosts();
   }

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    console.log(postData);
    this.postService.createAndStorePost(postData.title,postData.content);
    
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();

  }

 

  private fetchPosts(){
    this.isFetching = true;
    this.postService.fetchPosts()
    .subscribe(
      {
        next:(posts)=>{
          this.isFetching = false;
          console.log('get response ',posts);
          this.loadedPosts = posts
        },
        error:(error)=>{
          this.isFetching = false;
        },
        complete:()=>{

        }
      }
    )
  }

  onClearPosts() {
    this.postService.onClearPosts()
    .subscribe({
      next:()=> { console.log("post deleted");
     
      this.loadedPosts = [];
      this.isFetching = true;
    },
      error:()=>{},
      complete:()=>{}
    })
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }
}
