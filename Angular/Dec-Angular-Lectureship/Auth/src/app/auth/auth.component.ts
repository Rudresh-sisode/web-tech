import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  isLoginMode = false;

  constructor(private authService:AuthService,private router:Router){

  }

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form:NgForm){

    debugger;
    console.log(form.value);
    if(!form.valid){
      console.log("Your form is not valid, please make it valid!");
      return;
    }

   
    const email = form.value.email;
    const password = form.value.password;
    
    let authObs: Observable<AuthResponseData>;

    if(this.isLoginMode){
      console.log("you are login already")
      authObs = this.authService.login(email,password);
    }
    else{
      authObs = this.authService.signup(email,password);
      // .subscribe({
      //   next:(response)=>{
      //     console.log(" auth response ",response);
      //   },
      //   error:(error)=>{
      //     console.log(" auth error response ",error);
      //   },
      //   complete:()=>{
      //     console.log(" auth completed response ");
      //   }
      // })

    }

    authObs.subscribe(
     (response)=>{
        console.log(" auth response ",response);
        this.router.navigate(['/recipes']);
        debugger;
      }

      
    )

     form.reset();

  }

}
