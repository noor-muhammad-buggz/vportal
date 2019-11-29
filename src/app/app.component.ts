/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { AuthService } from './services/auth.service';
import { environment } from "../environments/environment";
import { GlobalState } from './global.state';

//disable console logs
// if(environment.production){
//   console.dir  = () => {};
//   console.log = () => {};
// }

@Component({
  selector: 'ngx-app',
  template: `
  <ngx-notifications></ngx-notifications>
  <router-outlet></router-outlet>
  <app-page-loader [showOverlay]="true" *ngIf="globalState.showLoader"></app-page-loader>
  `,
})
export class AppComponent implements OnInit {

  constructor(private analytics: AnalyticsService,public authService: AuthService,public globalState: GlobalState) {
    console.dir('IN APP Component');
    this.authService.handleAuthentication();
    this.removeAllTemporaryLocalStorageData();
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
  }

  removeAllTemporaryLocalStorageData(){
    localStorage.removeItem('params');
    localStorage.removeItem('headers');

    localStorage.removeItem('products-params');
    localStorage.removeItem('products-headers');
  }
}
