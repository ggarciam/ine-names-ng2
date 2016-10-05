import {Component} from '@angular/core';

@Component({
  selector: 'ine-app',
  template: require('./hello.html')
})
export class HelloComponent {
  public hello: string;

  constructor() {
    this.hello = 'Hello World!';
  }
}
