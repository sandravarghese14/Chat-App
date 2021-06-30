import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import{ FormsModule} from '@angular/forms';
import {HttpClientModule,HttpInterceptor, HTTP_INTERCEPTORS} from '@angular/common/http';
// import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth.guard';

import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { ChatComponent } from './components/chat/chat.component';
import { ChatHomeComponent } from './components/chat/chat-home/chat-home.component';
import { ChatRoomComponent } from './components/chat/chat-room/chat-room.component';

import {SocketService} from '../app/services/socket.service';

// const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignupComponent,
    ChatComponent,
    ChatHomeComponent,
    ChatRoomComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
    // SocketIoModule.forRoot(config)
    
  ],
  providers: [SocketService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
