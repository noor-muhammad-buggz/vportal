import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperatorsComponent } from './operators.component';
import { routing } from './operators.routing';
import { SharedModule } from '../../shared/shared.module';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

@NgModule({
  imports: [
    CommonModule,
    routing,
    SharedModule,
    SweetAlert2Module
  ],
  declarations: [OperatorsComponent]
})
export class OperatorsModule { }
