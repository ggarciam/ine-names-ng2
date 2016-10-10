import 'hammerjs';
import '@angular/forms';
import {NgModule}               from '@angular/core';
import {BrowserModule}          from '@angular/platform-browser';
import {routing, RootComponent} from './routes';
import {MaterialModule}         from '@angular/material';
import {HttpModule}             from '@angular/http';
import {FormsModule}            from '@angular/forms';


import {DashboardComponent}     from './dashboard';
import {NamesComponent}         from './names';
import {NamesService}           from './names.service';

@NgModule({
  imports: [
    BrowserModule,
    routing,
    HttpModule,
    MaterialModule.forRoot(),
    FormsModule
  ],
  declarations: [
    RootComponent,
    DashboardComponent,
    NamesComponent
  ],
  providers: [
    MaterialModule,
    NamesService
  ],
  bootstrap: [RootComponent]
})
export class AppModule {}
