import { Routes, RouterModule } from '@angular/router';

import { OrdersComponent } from './orders.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
	{
		path: '',
		component: OrdersComponent,
	},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
