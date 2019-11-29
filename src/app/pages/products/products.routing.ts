import { Routes, RouterModule } from '@angular/router';

import { ProductsComponent } from './products.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
	{
		path: '',
		component: ProductsComponent,
	},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
