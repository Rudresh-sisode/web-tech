import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from './custom.validators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  // constructor (public ){

  // }
  projectForm:FormGroup ;

  ngOnInit(){
    this.projectForm = new FormGroup({
      'projectName':new FormControl(null,[Validators.required,CustomValidators.invalidProjectName],CustomValidators.asyncInvalidProjectName),
      'email':new FormControl(null,[Validators.required,Validators.email]),
      'projectStatus':new FormControl('critical')
    })
  }

  onSubmit(){
    console.log(this.projectForm.value);
  }


}
