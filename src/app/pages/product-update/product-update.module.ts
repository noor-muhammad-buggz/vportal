import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductUpdateComponent } from './product-update.component';
import { SharedModule } from '../../shared/shared.module';

import { routing } from './product-update.routing';

@NgModule({
    imports: [
        CommonModule, routing,SharedModule
    ],
    exports: [
    ],
    declarations: [ProductUpdateComponent]
})
export class ProductUpdateModule { }
