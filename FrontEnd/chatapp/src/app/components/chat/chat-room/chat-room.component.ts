import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {Moment} from 'moment';  

import {SocketService} from '../../../services/socket.service'
import {ActionService} from '../../../services/action.service' 
import {Message} from '../../../classes/message';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/classes/user';
import * as moment from 'moment';



@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {

  // message:Chatmessage
  id = sessionStorage.getItem('userId');
  username = sessionStorage.getItem('username');
  toUser = sessionStorage.getItem('toUser');
  user:User ={
    username:'',
    email:'',
    password:'',
    image:'',
    contacts:[]
  }
  
  room=sessionStorage.getItem('roomName');
  messageArray:Array<Message>=[];
  images:any;
  updatedImage:any;
  newMessage='';
  forwardedMessage:string='';
  forwardedImage:any;


  isBlocked:boolean | undefined;
  isMuted:boolean | undefined;
  contactsList: { name: string; isMuted: boolean; isBlocked: boolean; }[] | undefined;
  
  constructor(private _socket:SocketService,private _router:Router,private _action:ActionService,public _auth:AuthenticationService,) { 
   
  }

  ngOnInit(): void {

    this._auth.getUser(this.id).subscribe((data)=>{
      this.user=JSON.parse(JSON.stringify(data));
      console.log('LOGGED IN USER DATA-',this.user);
      // console.log('Contact Users-',this.user.contacts);
      this.contactsList=this.user.contacts;
      console.log('Contact Users-',this.contactsList);
      this.contactsList.forEach(element => {
          if(element.name==this.toUser){
            console.log('Contact Details-',element)
            this.isBlocked=element.isBlocked;
            this.isMuted=element.isMuted;
          }      
      });

    })

    this._action.loadChatHistory(this.room).subscribe((chats) =>{
      console.log('chats history',chats)
      this.messageArray=JSON.parse(JSON.stringify(chats));
      this.messageArray.forEach(element => {
        element.date = moment().format('lll');
      });
    })

    this._socket.listen('newMessage').subscribe((data) =>{   
    var newmsg=JSON.parse(JSON.stringify(data));
    var msg={
        from:newmsg.from,
        to:newmsg.to,
        message:newmsg.message,
        image:newmsg.image,
        room:newmsg.room,
        isForwarded:false,
        date:(new Date()).toString()
    }
      this.messageArray.push(msg);    
    })
    //   this._socket.listen('newMessage'){
    //     this._action.loadChatHistory(this.room).subscribe((chats) =>{
    //       this.messageArray=JSON.parse(JSON.stringify(chats));
    //   })
    // })
    // this._socket.listen('typing').subscribe((data) => this.updateFeedback(data));
    // this._socket.listen('chat').subscribe((data) => this.updateMessage(data));
  }

   sendMessage(){
     console.log('new message-', this.newMessage);
     if(this.images){
      const formData = new FormData();
      formData.append('file', this.images);
     this._action.uploadImage(formData)
     .subscribe(
      (res) => {console.log(res)
                this.images='';
                this.updatedImage=res.filename;
                console.log(this.updatedImage);
                this._socket.emit('sendMessage', {room: this.room, message:this.newMessage, from: this.username,to:this.toUser,image:this.updatedImage,isForwarded:false});
              },
      (err) => console.log(err)
     )} 
    
     else{
      this._socket.emit('sendMessage', {room: this.room, message:this.newMessage, from: this.username,to:this.toUser,image:null,isForwarded:false});
     }
  }

  selectImage(event:any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.images = file;
    }
  }

  blockUser(){
    var res=confirm('Are you sure you want to block the user?');
    if(res){
      this.isBlocked=!this.isBlocked;
      this._action.blockUser(this.toUser,this.id)
      .subscribe((res) => {
        console.log('Blocked!');
      })    
    }
  
  }
  unblockUser(){
    this.isBlocked=!this.isBlocked;
    this._action.unblockUser(this.toUser,this.id)
    .subscribe((res) => {
      console.log('UnBlocked!');
    })    
  }
  muteUser(){
    var res=confirm('Are you sure you want to mute the user?');
    if(res){
      this.isMuted=!this.isMuted;
      this._action.muteUser(this.toUser,this.id)
      .subscribe((res) => {
        console.log('Muted!')
      })       
    }
  }
  unmuteUser(){
    this.isMuted=!this.isMuted;
    this._action.unmuteUser(this.toUser,this.id)
    .subscribe((res) => {
      console.log('Unmuted!');
    })    
  }
  closeChat(){
    this._router.navigate(['/chat']);
  }

  saveForwardData(message:any){
    console.log('Forwarding data..',message);
    this.forwardedMessage=message.message;
    this.forwardedImage=message.image;

  }

  forwardMessage(i:any){
    console.log('forwarding to..',i.name,this.forwardedMessage,this.forwardedImage);

      var room = this.username+i.name;
      var roomalt=i.name+this.username;
      var rooms=room+"."+roomalt;
      this._socket.emit('sendMessage', {room:rooms, message:this.forwardedMessage, from: this.username,to:i.name,image:this.forwardedImage,isForwarded:true});
      alert('Successfully Forwarded!')
    };
  


  // saveForwardData(msg:any){
  //   


  // }

  // updateMessage(data:any){
  //   this.feedback='';
    
  // }

  // updateFeedback(data:any){

  // }
}


