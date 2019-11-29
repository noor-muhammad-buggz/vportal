import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductAddComponent } from './product-add.component';
import { SharedModule } from '../../shared/shared.module';

import { routing } from './product-add.routing';

@NgModule({
    imports: [
        CommonModule, routing,SharedModule
    ],
    exports: [
    ],
    declarations: [ProductAddComponent]
})
export class ProductAddModule { }
