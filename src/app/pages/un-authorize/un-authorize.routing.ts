import { Routes, RouterModule } from '@angular/router';

import { UnAuthorizeComponent } from './un-authorize.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
    {
        path: '',
        component: UnAuthorizeComponent,
    },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
