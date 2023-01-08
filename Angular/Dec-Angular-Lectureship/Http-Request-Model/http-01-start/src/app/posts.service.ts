import { HttpClient } from '@angular/common/http';
import {Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import {Subject} from 'rxjs';

import {Post} from './post.model';

@Injectable({providedIn:'root'})


export class PostService{
    constructor(private http:HttpClient){

    }

    error = new Subject<string>();

    createAndStorePost( title:string,content:string){
        let postData = {title:title,content:content};
        this.http.post('https://myfirst-242709-default-rtdb.firebaseio.com/posts.json', postData)
        .subscribe(
            {
                next: (response) =>{
                console.log("response from backend ",response);
                },
                error: (error)=>{
                console.log("your error occured here ",error);
                this.error.next(error.message);
                },
                complete: ()=>{
                //pass done.
                }
            }
        )
    }

    fetchPosts(){
        return this.http.get<{[key:string]:Post}>('https://myfirst-242709-default-rtdb.firebaseio.com/posts.json')
        .pipe(map((responseData : {[key:string]:Post}) =>{
          const postArray:Post[] = [];
          for(const key in responseData){
            if(responseData.hasOwnProperty(key)){
              postArray.push({...responseData[key], id:key});
            }
          }
          return postArray;
        }))
    }

    onClearPosts(){
        return this.http.delete('https://myfirst-242709-default-rtdb.firebaseio.com/posts.json');
    }
}