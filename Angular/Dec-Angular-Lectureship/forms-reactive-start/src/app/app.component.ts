import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  genders = ['male', 'female'];
  signupForm : FormGroup;
  forbiddenUsernames = ['Chirs','Ana'];

  ngOnInit(){
    this.signupForm = new FormGroup({
      'userData':new FormGroup({
        'username':new FormControl(null,[Validators.required,this.forbiddenNames.bind(this)]),
        'email':new FormControl(null,[Validators.required, Validators.email], this.forbiddenEmails),
      }),
      'gender':new FormControl('male'),
      'hobbies': new FormArray([]),
    });

    // this.signupForm.valueChanges.subscribe(
    //   (value)=>{
    //     console.log('V ~',value);
    //   }
    // )

    this.signupForm.statusChanges.subscribe(
      (value)=> console.log("S ~",value)
    )

    this.signupForm.setValue({
      'userData':{
        'username':'Rudresh',
        'email':'rudra@gmail.com'
      },
      'gender':'male',
      'hobbies':[]
    })

    this.signupForm.patchValue({
      'userData':{
        'username':'sohame'
      }
    })
  }

  onAddHobby(){
    const control = new FormControl(null,Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(control)
  }
 // it's a getter
  get controls(){
    return (this.signupForm.get('hobbies') as FormArray).controls;
  }

  getControls(){
    return (<FormArray>this.signupForm.get('hobbies'));
  }

  onSubmit(){
    console.log(this.signupForm);
    this.signupForm.reset();
  }

  forbiddenNames(control:FormControl):{[s:string]:boolean /** {'abc':true} */}{
    if(this.forbiddenUsernames.indexOf(control.value) !== -1){
      return {'nameIsForbidden':true}
    }
    return null;
    //if validation fail, you only return null rather not return false or anyother values
  }

  forbiddenEmails(control:FormControl):Promise<any> | Observable<any>{
    const promise = new Promise<any>((resolve,reject)=>{
      setTimeout(()=>{
        if(control.value === 'test@test.com'){
          resolve({'emailIsForbidden':true})
        }
        else{
          resolve(null)
        }
      },1500)
    });
    return promise;
  }

}
