import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';

import {SignupComponent} from './components/signup/signup.component';
import {HomeComponent} from './components/home/home.component'
import { ChatComponent } from './components/chat/chat.component';
import { ChatHomeComponent } from './components/chat/chat-home/chat-home.component';
import { ChatRoomComponent } from './components/chat/chat-room/chat-room.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'userRegister',component:SignupComponent},
  {path:'chat',component:ChatComponent,canActivate:[AuthGuard],
   children: [{path:'',component:ChatHomeComponent},
              {path:'room',component:ChatRoomComponent},
  ]}
                 
 ]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
