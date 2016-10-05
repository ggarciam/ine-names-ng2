import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {routing, RootComponent} from './routes';

import {HelloComponent} from './hello';
import {NamesComponent} from './names';

@NgModule({
  imports: [
    BrowserModule,
    routing
  ],
  declarations: [
    RootComponent,
    HelloComponent,
    NamesComponent
  ],
  bootstrap: [RootComponent]
})
export class AppModule {}
