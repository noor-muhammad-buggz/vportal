import { Injectable, EventEmitter, Inject, ReflectiveInjector } from "@angular/core";
import {DOCUMENT} from '@angular/platform-browser';
import { Subject } from "rxjs/Subject";
import {
  Router,
  NavigationEnd,
  NavigationStart,
  Event,
  NavigationError,
  NavigationCancel,
  RoutesRecognized
} from "@angular/router";

import { environment } from "../environments/environment";
import { AnalyticsService } from './services/analytics.service';

@Injectable()
export class GlobalState {
  enabledDebug: boolean = !environment.production;

  private _data = new Subject<Object>();
  private _dataStream$ = this._data.asObservable();

  private _subscriptions: Map<string, Function[]> = new Map<
    string,
    Function[]
  >();

  showLoader: boolean = false;
  showSidebar: boolean = true;

  currentPage: string;
  currentPageTitle: string = 'Vendor Portal';
  currentPageSubTitle: string;
  currentPageSubTitleClasses: string;

  state: any;

  showMessageEvent: EventEmitter<any> = new EventEmitter();

  orderFilters: any = {};

  constructor(private router: Router,public analyticsService: AnalyticsService) {
    const self = this;
    //this._dataStream$.subscribe(data => this._onEvent(data));
    this.currentPage = "";
    this.router.events
      .filter(event => event instanceof NavigationStart)
      .subscribe((event: any) => {
        console.log("in global route change subscribe:");
      });

      this.router.events
      .filter(event => event instanceof NavigationStart)
      .subscribe((event: any) => {
        console.log("in global route change subscribe 2:");
        if (event instanceof NavigationStart) {
          const injector = ReflectiveInjector.resolveAndCreate([AnalyticsService]); 
          this.analyticsService = injector.get(AnalyticsService); 
        
          this.analyticsService.TrackPageView(event.url,event.url)
          const dashboard_page_regex = /dashboard/i;
        }
        else if ( event instanceof NavigationEnd ) {}
        else if ( event instanceof NavigationError || event instanceof NavigationCancel ) {
          self.showLoader = false;
          this.analyticsService.TrackException(JSON.stringify(event), event.url, '', '', 'Navigation');
          console.log('in NavigationCancel');
          console.log(this.state);
        }
      });

  }

  // notifyDataChanged(event, value) {
  //   const current = this._data[event];
  //   if (current !== value) {
  //     this._data[event] = value;

  //     this._data.next({
  //       event,
  //       data: this._data[event]
  //     });
  //   }
  // }

  // subscribe(event: string, callback: Function) {
  //   const subscribers = this._subscriptions.get(event) || [];
  //   subscribers.push(callback);

  //   this._subscriptions.set(event, subscribers);
  // }

  // _onEvent(data: any) {
  //   const subscribers = this._subscriptions.get(data["event"]) || [];

  //   subscribers.forEach(callback => {
  //     callback.call(null, data["data"]);
  //   });
  // }

  // showMessage(type,message,title){
  //     if(type == 'error'){
  //       this.toastrService.error(message,title);
  //     }else if(type == 'success'){
  //       this.toastrService.success(message,title);
  //     }else{
  //       this.toastrService.info(message,title);
  //     }
  // }

}
