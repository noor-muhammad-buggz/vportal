import { Routes, RouterModule } from '@angular/router';

import { LibraryManagerComponent } from './library-manager.component';
import { ModuleWithProviders } from '@angular/core';
import { DistributorLibraryManagerResolve } from './distributor-library-manager.resolve.service';

export const routes: Routes = [
	{
		path: '',
    component: LibraryManagerComponent,
    resolve: {
      libraryManager: DistributorLibraryManagerResolve,
    }
	},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
