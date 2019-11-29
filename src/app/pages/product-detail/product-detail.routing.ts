import { Routes, RouterModule } from '@angular/router';

import { ProductDetailComponent } from './product-detail.component';
import { ModuleWithProviders } from '@angular/core';
import { ProductResolve } from './product-detail.resolve.service';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
    {
        path: '',
        component: ProductDetailComponent,
        resolve: {
          product: ProductResolve,
        }
    },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
