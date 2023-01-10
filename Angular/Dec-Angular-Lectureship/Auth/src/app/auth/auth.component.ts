import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  isLoginMode = true;

  constructor(private authService:AuthService){

  }

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form:NgForm){

    console.log(form.value);
    if(!form.valid){
      console.log("Your form is not valid, please make it valid!");
      return;
    }

   
    const email = form.value.email;
    const password = form.value.password;
    if(this.isLoginMode){
      console.log("you are login already")
    }
    else{
      this.authService.signup(email,password)
      .subscribe({
        next:(response)=>{
          console.log(" auth response ",response);
        },
        error:(error)=>{
          console.log(" auth error response ",error);
        },
        complete:()=>{
          console.log(" auth completed response ");
        }
      })

    }
     form.reset();

  }

}
