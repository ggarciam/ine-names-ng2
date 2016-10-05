/// <reference path="../../typings/index.d.ts"/>

import {DashboardComponent} from './dashboard';
import {TestBed, async} from '@angular/core/testing';

describe('dashboard component', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent
      ]
    });
    TestBed.compileComponents();
  }));

  it('should render hello world', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    const dashboard = fixture.nativeElement;
    expect(dashboard.querySelector('h1').textContent).toBe('Hello World!');
  });
});
