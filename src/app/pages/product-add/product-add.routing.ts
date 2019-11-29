import { Routes, RouterModule } from '@angular/router';

import { ProductAddComponent } from './product-add.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
    {
        path: '',
        component: ProductAddComponent,
    },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
