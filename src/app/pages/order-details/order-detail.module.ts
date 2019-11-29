import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { OrderDetailComponent } from './order-detail.component';
import { routing } from './order-detail.routing';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		routing,
    SharedModule,
    SweetAlert2Module
	],
	declarations: [
		OrderDetailComponent
	]
})
export class OrderDetailModule { }
