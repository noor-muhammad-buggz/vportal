import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './guards/auth.guard';
import { LogoutGuard } from './guards/logout.guard';
//import { UnAuthorizeComponent } from './pages/un-authorize/un-authorize.component';
import { Auth0CallbackComponent } from './components/auth0-callback/auth0-callback.component';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';

const routes: Routes = [
  { path: 'pages', loadChildren: 'app/pages/pages.module#PagesModule' },
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      // {
      //   path: '',
      //   component: NbLoginComponent,
      // },
      // {
      //   path: 'login',
      //   component: NbLoginComponent,
      // },
      // {
      //   path: 'register',
      //   component: NbRegisterComponent,
      // },
      {
        path: 'logout',
        component: NbLogoutComponent,
        canActivate: [LogoutGuard]
      },
      // {
      //   path: 'request-password',
      //   component: NbRequestPasswordComponent,
      // },
      // {
      //   path: 'reset-password',
      //   component: NbResetPasswordComponent,
      // },
    ],
  },
  {
    path: 'unauthorize',
    //component: UnAuthorizeComponent,
    loadChildren: './pages/un-authorize/un-authorize.module#UnAuthorizeModule',
    //pathMatch: 'full'
  },
  {
    path: 'callback',
    component: Auth0CallbackComponent,
    //pathMatch: 'full'
  },
  { path: '', redirectTo: 'pages/dashboard', pathMatch: 'full', canActivate: [] },
  { path: '**', redirectTo: 'pages/dashboard', canActivate: [] }
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
