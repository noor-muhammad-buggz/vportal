import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ProductsComponent } from './products.component';
import { routing } from './products.routing';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		routing,
		SharedModule
	],
	declarations: [
		ProductsComponent
	]
})
export class ProductsModule { }
