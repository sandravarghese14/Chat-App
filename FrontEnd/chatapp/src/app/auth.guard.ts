import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {AuthenticationService} from './services/authentication.service'

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private _authService:AuthenticationService,
    private _router:Router) {}

  canActivate(): boolean {
    if(this._authService.loggedIn()){
      return true;
    } else {
      alert('Please login to continue!');
      this._router.navigate(['/']);
      return false;
    }
  }

  
}
