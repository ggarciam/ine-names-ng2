/// <reference path="../../typings/index.d.ts"/>

import {Component} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HelloComponent} from './hello';
import {NamesComponent} from './names';

@Component({
  selector: 'ine-root',
  template: require('./routes.html')
})
export class RootComponent {}

export const routes: Routes = [
  {
    path: '',
    component: HelloComponent
  },
  {
    path: 'names',
    component: NamesComponent
  }
];

export const routing = RouterModule.forRoot(routes);
