import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';
import {AlertComponent} from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy{
  isLoginMode = false;
  error = null;

  @ViewChild(PlaceholderDirective,{static:false}) alertHost:PlaceholderDirective;

  private closeSub :Subscription;
  constructor(private authService:AuthService,private router:Router,private componentFactoryResolver:ComponentFactoryResolver){

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
       
      },
      (errorMessage)=>{
        this.showErrorAlert(errorMessage);
      }

      
    )

     form.reset();

  }

  showErrorAlert(errorMessage){

    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

    componentRef.instance.message = errorMessage;
    this.closeSub = componentRef.instance.close.subscribe(()=>{
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    })
  }
  
  onHandleError(){
      this.error = null;
    }

    ngOnDestroy(): void {
      if(this.closeSub){
        this.closeSub.unsubscribe();
      }
    }

}
