/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CoreModule } from './@core/core.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ThemeModule } from './@theme/theme.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthGuard } from './guards/auth.guard';
import { LogoutGuard } from './guards/logout.guard';
import { AuthService } from './services/auth.service';
import { ZytoVendorService } from './services/zyto-vendor.service';
import { ZytoVendorProductService } from './services/zyto-vendor-product.service';
import { SharedModule } from './shared/shared.module';
import { AnalyticsService } from './services/analytics.service';

import { GlobalState } from './global.state';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    AppRoutingModule,

    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    SharedModule
  ],
  bootstrap: [AppComponent],
  providers: [
    AuthGuard,
    LogoutGuard,
    AuthService,
    ZytoVendorService,
    ZytoVendorProductService,
    AnalyticsService,
    GlobalState,
    { provide: APP_BASE_HREF, useValue: '/' },
  ],
})
export class AppModule {
}
