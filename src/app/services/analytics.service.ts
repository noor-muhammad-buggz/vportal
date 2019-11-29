import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AppInsights } from 'applicationinsights-js';

@Injectable()
export class AnalyticsService {

  private config: Microsoft.ApplicationInsights.IConfig = {
    instrumentationKey: environment.AppInsights.InstrumentalKey
  };

  constructor() {
    if (!AppInsights.config) {
      AppInsights.downloadAndSetup(this.config);
    }
  }

  TrackPageView(name?: string, url?: string, properties?: any,
    measurements?: any, duration?: number) {
    const accountId = localStorage.getItem('accountId'); //user_id
    const userprofile = JSON.parse(localStorage.getItem('userProfile'));
    // console.log('in analytics service : ',userprofile);
    let str:any = '';
    if(userprofile && userprofile.user_id && !accountId){
      AppInsights.setAuthenticatedUserContext(userprofile.user_id);
      str = {['user_Id']:  userprofile.user_id};
    } else if(!userprofile && accountId){
      AppInsights.setAuthenticatedUserContext('',accountId);
      str = {['user_AccountId']:  accountId};
    } else if(userprofile && userprofile.user_id && accountId){
      AppInsights.setAuthenticatedUserContext(userprofile.user_id,accountId);
      str = {['user_Id']:  userprofile.user_id,['user_AccountId']:  accountId};
    }
    AppInsights.trackPageView(name, url, str, measurements, duration);
  }

  TrackException(exception,handleAt,properties,measurements,secureityLevel){
    console.log('Track Exception');
    AppInsights.trackException(exception,handleAt,properties,measurements,secureityLevel);
  }

  logEvent(name: string, properties?: any, measurements?: any) {
    AppInsights.trackEvent(name, properties, measurements);
  }

} 
