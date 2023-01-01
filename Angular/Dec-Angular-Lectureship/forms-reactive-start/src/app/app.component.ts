import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

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
        'email':new FormControl(null,[Validators.required, Validators.email]),
      }),
      'gender':new FormControl('male'),
      'hobbies': new FormArray([]),
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
  }

  forbiddenNames(control:FormControl):{[s:string]:boolean /** {'abc':true} */}{
    if(this.forbiddenUsernames.indexOf(control.value) !== -1){
      return {'nameIsForbidden':true}
    }
    return null;
    //if validation fail, you only return null rather not return false or anyother values
  }

}
