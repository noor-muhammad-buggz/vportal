import { Routes, RouterModule } from '@angular/router';

import { AccountComponent } from './account.component';
import { ModuleWithProviders } from '@angular/core';
import { DistributorEmployeeResolve } from './distributor-employee.resolve.service';

export const routes: Routes = [
	{
		path: '',
    component: AccountComponent,
    resolve: {
      employee: DistributorEmployeeResolve,
    }
	},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
