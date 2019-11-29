import { Routes, RouterModule } from '@angular/router';

import { ProductUpdateComponent } from './product-update.component';
import { ModuleWithProviders } from '@angular/core';
import { ProductResolve } from '../product-detail/product-detail.resolve.service';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
    {
        path: '',
        component: ProductUpdateComponent,
        resolve: {
          product: ProductResolve,
        }
    },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
