import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AuthGuard } from "../guards/auth.guard";
import { UnAuthorizeComponent } from "./un-authorize/un-authorize.component";

const routes: Routes = [
    {
        path: "",
        component: PagesComponent,
        children: [
            {
                path: "dashboard",
                component: DashboardComponent,
                pathMatch: "full",
                canActivate: [AuthGuard]
            },
            {
                path: 'orders',
                loadChildren: './orders/orders.module#OrdersModule',
                canActivate: [AuthGuard]
            },
            {
                path: 'orders/:id/order-detail',
                loadChildren: './order-details/order-detail.module#OrderDetailModule',
                canActivate: [AuthGuard]
            },
            {
                path: 'support',
                loadChildren: './about/about.module#AboutModule',
                canActivate: [AuthGuard]
            },
            {
              path: 'products',
              loadChildren: './products/products.module#ProductsModule',
              canActivate: []
            },
            {
                path: 'products/:id/product-detail',
                loadChildren: './product-detail/product-detail.module#ProductDetailModule',
                canActivate: [AuthGuard]
            },
            {
              path: 'products/add',
              loadChildren: './product-add/product-add.module#ProductAddModule',
              canActivate: [AuthGuard]
            },
            {
              path: 'products/:id/update',
              loadChildren: './product-update/product-update.module#ProductUpdateModule',
              canActivate: [AuthGuard]
            },
            {
              path: 'account',
              loadChildren: './account/account.module#AccountModule',
              canActivate: [AuthGuard]
            },
            {
              path: 'library-manager',
              loadChildren: './library-manager/library-manager.module#LibraryManagerModule',
              canActivate: [AuthGuard]
            },
            {
              path: 'operators',
              loadChildren: './operators/operators.module#OperatorsModule',
              canActivate: [AuthGuard]
            },
            {
              path: "select-account",
              loadChildren:
                  "./distributor-selector/distributor-selector.module#DistributorSelectorModule"
            },
            {
                path: "",
                redirectTo: "dashboard",
                pathMatch: "full"
            }
            // {
            //   path: 'unauthorize',
            //   component: UnAuthorizeComponent,
            //   pathMatch: 'full'
            // },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
