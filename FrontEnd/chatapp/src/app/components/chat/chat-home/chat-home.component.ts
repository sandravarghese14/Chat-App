import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/classes/user';
import {ActionService} from '../../../services/action.service';

@Component({
  selector: 'app-chat-home',
  templateUrl: './chat-home.component.html',
  styleUrls: ['./chat-home.component.css']
})
export class ChatHomeComponent implements OnInit {

   id:any;
   searchUser:any;
   results: User[] = [];

  constructor( private _action:ActionService) { }

  ngOnInit(): void {
    this.id = sessionStorage.getItem('userId');
  }
  
  onSubmit(){
    console.log('Searching for..',this.searchUser)
    this._action.searchUser(this.searchUser)
    .subscribe((res) => {
      this.results = JSON.parse(JSON.stringify(res));
      console.log('Search results-',this.results);
    })
    
  }

  addContact(user:User){
    var ans = confirm('Do you want to add this user to your contact?');
    if (ans) {
    this._action.addContact(user,this.id)
    .subscribe((res) => {
      console.log('Successfully added to contact!');
      alert('Successfully added to contact!');
    })
  }
        
  }

}
