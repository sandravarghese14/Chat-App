import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Router} from '@angular/router';
import { User } from '../classes/user';

@Injectable({
  providedIn: 'root'
})
export class ActionService {


  _url='http://localhost:3000/';

  constructor(private _http: HttpClient,
             private _router:Router) { }

  loadChatHistory(room:any){
    
    var roomopts=room.split('.');
    var rooms:any={
         room:roomopts[0],
         roomalt:roomopts[1]
    }
    console.log('Loading chat..',rooms)
     return this._http.post<any>(this._url+'msg/load',rooms);
  }           

  uploadImage(formData:any){
    return this._http.post<any>(this._url+'file', formData);

  }

  searchUser(username:any){
    return this._http.post<any>(this._url+'user/searchUser',{username:username});
  }

  changeDP(user:User,id:any){
    return this._http.post<any>(this._url+'user/changeDP/'+id,user);
  }

  addContact(user:User,id:any){
    return this._http.post<any>(this._url+'user/addContact/'+id,user);
  }

  blockUser(toUser: string | null, id: string | null) {
    return this._http.post<any>(this._url+'user/blockUser/'+id,{toUser:toUser});
  }

  unblockUser(toUser: string | null, id: string | null) {
    return this._http.post<any>(this._url+'user/unblockUser/'+id,{toUser:toUser});
  }

  muteUser(toUser: string | null, id: string | null) {
    return this._http.post<any>(this._url+'user/muteUser/'+id,{toUser:toUser});
  }

  unmuteUser(toUser: string | null, id: string | null) {
    return this._http.post<any>(this._url+'user/unmuteUser/'+id,{toUser:toUser});
  }


}
