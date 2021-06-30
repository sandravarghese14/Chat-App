import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  _url='http://localhost:3000/';

   constructor(private _http: HttpClient,
              private _router:Router) { }

              register(user: any){
                return this._http.post<any>(this._url+'user/signUp',user);
                //Post will return response as observable. Subscribe it in component
             }

             login(user: any){
              return this._http.post<any>(this._url+'user/signIn',user);
             }
          
           loggedIn(){
             return !!sessionStorage.getItem('token');
           }
          
           logOutUser(){
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('userId');
            sessionStorage.removeItem('username');
            this._router.navigate(['/']);
          
           }

          getUser(id: any) {
            return this._http.get<any>(this._url+"user/getUser/"+id); 
          }
}
