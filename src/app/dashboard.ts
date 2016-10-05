import {Component} from '@angular/core';

@Component({
  selector: 'ine-app',
  template: require('./dashboard.html')
})
export class DashboardComponent {
  public hello: string;

  constructor() {
    this.hello = 'Hello World!';
  }
}
