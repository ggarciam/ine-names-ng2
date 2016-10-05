import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {routing, RootComponent} from './routes';

import {DashboardComponent} from './dashboard';
import {NamesComponent} from './names';

@NgModule({
  imports: [
    BrowserModule,
    routing
  ],
  declarations: [
    RootComponent,
    DashboardComponent,
    NamesComponent
  ],
  bootstrap: [RootComponent]
})
export class AppModule {}
