import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailComponent } from './product-detail.component';

import { routing } from './product-detail.routing';

@NgModule({
    imports: [
        CommonModule,
        routing
    ],
    declarations: [ProductDetailComponent]
})
export class ProductDetailModule { }
