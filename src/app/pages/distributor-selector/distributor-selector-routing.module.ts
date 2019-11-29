import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DistributorSelectorComponent } from './distributor-selector.component';

const routes: Routes = [{
    path: '',
    component: DistributorSelectorComponent,
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DistributorSelectorRoutingModule { }

export const routedComponents = [
    DistributorSelectorComponent
];
