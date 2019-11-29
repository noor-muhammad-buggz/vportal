import { Routes, RouterModule } from '@angular/router';

import { OrderDetailComponent } from './order-detail.component';
import { ModuleWithProviders } from '@angular/core';
import { OrderResolve } from './order-detail.resolve.service';

export const routes: Routes = [
	{
		path: '',
    component: OrderDetailComponent,
    resolve: {
      order: OrderResolve,
    }
	},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
