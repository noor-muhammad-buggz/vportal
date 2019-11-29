import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistributorSelectorComponent } from './distributor-selector.component';

import { DistributorSelectorRoutingModule, routedComponents } from './distributor-selector-routing.module';

@NgModule({
    imports: [
        CommonModule,
        DistributorSelectorRoutingModule
    ],
    declarations: [
        ...routedComponents,
    ]
})
export class DistributorSelectorModule { }
