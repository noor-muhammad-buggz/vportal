import { Injectable } from '@angular/core';
import {RouterStateSnapshot, ActivatedRouteSnapshot, Router, CanActivate} from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable()
export class LogoutGuard implements CanActivate {

    constructor(
      private authService: AuthService,
      private router: Router,
    ) { }

    canActivate(
      next:  ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ) {
      //due to theme limitation implemented logout guard to logout user from app
        console.log('in canActivate');
        console.log('next', next);
        console.log('state', state);
        console.log('this.authService.isAuthenticated()',this.authService.isAuthenticated());

        if (this.authService.isAuthenticated()) {
            this.authService.logout();
            return false;
        }else{
          this.authService.login();
        }
        return false;
    }
}
