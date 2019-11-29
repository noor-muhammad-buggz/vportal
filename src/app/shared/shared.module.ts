import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccordionModule } from 'ngx-bootstrap';
import { ThemeModule } from '../@theme/theme.module';
import { CKEditorModule } from 'ng2-ckeditor';

import { ToasterService, ToasterConfig, Toast, BodyOutputType,ToasterModule } from 'angular2-toaster';

//import { UnAuthorizeComponent } from '../pages/un-authorize/un-authorize.component';
import { PageLoaderComponent } from '../components/page-loader/page-loader.component';
import { NullToStringPipe } from '../pipes/checkNull.pipe';
import { Auth0CallbackComponent } from '../components/auth0-callback/auth0-callback.component';
import { Daterangepicker } from 'ng2-daterangepicker';
import { OrderResolve } from '../pages/order-details/order-detail.resolve.service';
import { UtcDatePipe } from '../pipes/utcDate.pipe';
import { UTCToLocalDatePipe } from '../pipes/utcToLocalDate.pipe';
import { NotificationsComponent } from '../pages/components/notifications/notifications.component';
import { ProductResolve } from '../pages/product-detail/product-detail.resolve.service';
import { DistributorEmployeeResolve } from '../pages/account/distributor-employee.resolve.service';
import { DistributorLibraryManagerResolve } from '../pages/library-manager/distributor-library-manager.resolve.service';

import { FileUploadModule } from 'ng2-file-upload';

import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

@NgModule({
  declarations: [
    //UnAuthorizeComponent,
    PageLoaderComponent,
    Auth0CallbackComponent,
    NotificationsComponent,
    NullToStringPipe,
    UtcDatePipe,
    UTCToLocalDatePipe,
  ],
  imports: [CommonModule, NgbModule,AccordionModule.forRoot(), FormsModule, ReactiveFormsModule,RouterModule,ThemeModule.forRoot(),Daterangepicker,ToasterModule,CKEditorModule,FileUploadModule,
    SweetAlert2Module.forRoot({
    // buttonsStyling: false,
    // customClass: 'modal-content',
    // confirmButtonClass: 'btn btn-primary',
    // cancelButtonClass: 'btn'
    })
  ],
  providers: [OrderResolve,ProductResolve,DistributorEmployeeResolve,DistributorLibraryManagerResolve],
  exports: [
    CommonModule,
    RouterModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    //UnAuthorizeComponent,
    ThemeModule,
    PageLoaderComponent,
    NotificationsComponent,
    NullToStringPipe,
    Daterangepicker,
    UtcDatePipe,
    UTCToLocalDatePipe,
    CKEditorModule,
    FileUploadModule,
    SweetAlert2Module,
    AccordionModule
  ],
})
export class SharedModule {}
