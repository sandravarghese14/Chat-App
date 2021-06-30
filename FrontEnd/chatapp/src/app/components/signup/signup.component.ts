import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/classes/user';

import {AuthenticationService} from '../../services/authentication.service'
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

      //User object
      User:User={
        username:'',
        email:'',
        password:'',
        contacts:[],
        image:''
      };
  
      errorMsg='';
      successMsg='';

  constructor(private _auth:AuthenticationService) { }

  ngOnInit(): void {
  }
  onSubmit(){

    console.log('Submitting sign up form..');
    this.errorMsg='';
    this._auth.register(this.User)
      .subscribe(
           data => {console.log('Success!',data);
                     this.errorMsg='';
                     this.successMsg =" User registered successfully! Please Login"},
            error =>{ switch(error.status){
                          case 401:
                            this.errorMsg="Email ID is already registered! Please login"
                            break;
                        case 404:
                          this.errorMsg="Username is already taken!"
                            break;
                        default:
                          this.errorMsg="Uknown Server-side Error"
                       }
     
                      }      
      )
   
  }

}
