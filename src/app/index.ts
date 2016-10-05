import 'hammerjs';
import '@angular/forms';
import {NgModule}               from '@angular/core';
import {BrowserModule}          from '@angular/platform-browser';
import {routing, RootComponent} from './routes';
import {MaterialModule}         from '@angular/material';


import {DashboardComponent} from './dashboard';
import {NamesComponent} from './names';

@NgModule({
  imports: [
    BrowserModule,
    routing,
    MaterialModule.forRoot()
  ],
  declarations: [
    RootComponent,
    DashboardComponent,
    NamesComponent
  ],
  providers: [MaterialModule],
  bootstrap: [RootComponent]
})
export class AppModule {}
