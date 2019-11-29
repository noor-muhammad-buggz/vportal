import { Routes, RouterModule } from '@angular/router';

import { OperatorsComponent } from './operators.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
	{
		path: '',
		component: OperatorsComponent,
	},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
