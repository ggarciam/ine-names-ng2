/// <reference path="../../typings/index.d.ts"/>

import {Component} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DashboardComponent} from './dashboard';
import {NamesComponent} from './names';

@Component({
  selector: 'ine-root',
  template: require('./routes.html')
})
export class RootComponent {}

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'names',
    component: NamesComponent
  }
];

export const routing = RouterModule.forRoot(routes);
