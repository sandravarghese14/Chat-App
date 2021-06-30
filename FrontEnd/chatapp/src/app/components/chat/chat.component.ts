//import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { Socket } from 'socket.io-client';
import { Router } from '@angular/router';
// import { Observable, Subscriber } from 'rxjs';
// import { tap, map, filter } from 'rxjs/operators';

import {AuthenticationService} from '../../services/authentication.service'
import {SocketService} from '../../services/socket.service' 
import {ActionService} from '../../services/action.service' 
import { NgForm } from '@angular/forms';
import { User } from 'src/app/classes/user';
import { identifierModuleUrl } from '@angular/compiler';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

        id:any;
        user:User ={
          username:'',
          email:'',
          password:'',
          image:'',
          contacts:[]
        }
        username = sessionStorage.getItem('username');
        onlineUserList:any =[];
        contactsList:Array<{name:string,isMuted: boolean, isBlocked: boolean,image?:string}>  =[];
        userList:any;
        message:string='';
        images:any;
        displayMyContacts=false;
        displayOnlineUsers=true;

       

  constructor(public _auth:AuthenticationService,private _socket:SocketService,private _router:Router,private _action:ActionService) { }

  ngOnInit(): void {
    this.id = sessionStorage.getItem('userId');
    this._auth.getUser(this.id).subscribe((data)=>{
      this.user=JSON.parse(JSON.stringify(data));
      console.log('LOGGED IN USER DATA-',this.user);
      // console.log('Contact Users-',this.user.contacts);
      this.contactsList=this.user.contacts;
      console.log('Contact Users-',this.contactsList);

    })
   

    console.log('Username from Component after Login:',this.username);
    this._socket.emit('loggedin',this.username);

    this._socket.listen('updateUserList').subscribe((data)=>{
      this.onlineUserList=JSON.parse(JSON.stringify(data));
      console.log('Users online:',this.onlineUserList);

     this._socket.listen('invite').subscribe((data) => {
       this._socket.emit('joinRoom',data);
     }) 

     this._socket.listen('response').subscribe((data) => {
      this.message =(JSON.parse(JSON.stringify(data))).mes;
      console.log(this.message);
    }) 

    // this._action.getContactsList(this.id)
    //     .subscribe((res) => {
    //       this.contactsList=JSON.parse(JSON.stringify(res))
    //       console.log('Contact Users-',this.contactsList);
    //     })
 
    
    })
   }  

    DisplayContacts(){
      this.displayMyContacts=true;
      this.displayOnlineUsers=false;
    }

    DisplayOnlineUsers(){
      this.displayMyContacts=false;
      this.displayOnlineUsers=true;
    }

    createRoom(withUser:any){
      var room = this.username+withUser.user;
      var roomalt=withUser.user+this.username;
      sessionStorage.setItem('toUser',withUser.user);
      sessionStorage.setItem('roomName',room+"."+roomalt);
      console.log('Creating room -',room,' with..',withUser);
      this._socket.emit('createRoom',{currentUser:this.username,withUser:withUser,room:room,roomalt:roomalt});
      this._router.navigate(['chat/room']);
    };

    createRoomwithContact(withUser:any){
      var room = this.username+withUser;
      var roomalt=withUser+this.username;
      sessionStorage.setItem('toUser',withUser);
      sessionStorage.setItem('roomName',room+"."+roomalt);
      this._socket.emit('createRoom',{currentUser:this.username,withUser:withUser,room:room,roomalt:roomalt});
      this._router.navigate(['chat/room']);
    }

    selectImage(event:any) {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        this.images = file;
      }
    }
  
    changeDP(dpForm:NgForm){
      const formData = new FormData();
      formData.append('file', this.images);
     this._action.uploadImage(formData)
     .subscribe(
      (res) => {console.log(res)
                this.user.image=res.filename;
                this._action.changeDP(this.user,this.id)
                .subscribe(
                  (res) => console.log('Sucessfully changed DP')
                )
                }
  )
    
}

}