import { Injectable } from '@angular/core';
import {RouterStateSnapshot, ActivatedRouteSnapshot, Router, CanActivate} from '@angular/router';

import { AuthService } from '../services/auth.service';
import { ZytoVendorService } from '../services/zyto-vendor.service';
@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
      private authService: AuthService,
      private router: Router,
      private zytoVendorService:ZytoVendorService
    ) { }

    canActivate(
      next:  ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ) {
        console.log('in canActivate');
        console.log('next', next);
        console.log('state', state);
        console.log('this.authService.isAuthenticated()',this.authService.isAuthenticated());

        if (this.authService.isAuthenticated()&& localStorage.getItem('distributorAccount')) {
            if(localStorage.getItem('selectedDistributor')){
              return true;
            }else{
              let distributorAccounts = JSON.parse(
                localStorage.getItem("distributorAccount")
              );
              distributorAccounts = Array.isArray(distributorAccounts)
                ? distributorAccounts
                : [distributorAccounts];

                let ids = distributorAccounts.map(item => item = item.DistributorId);

              return this.zytoVendorService
              .GetDistributorsDetailsByIds(ids)
              .toPromise()
              .then(
                response => {
                  console.log(response);
                  localStorage.setItem("distributorAccountDetails",JSON.stringify(response));
                  if(response.length == 1){
                    localStorage.setItem("selectedDistributor", JSON.stringify(response[0]));
                    localStorage.setItem("selectedDistributorId",response[0].Id);
                    return true;
                  }else{
                    this.router.navigate(["/pages/select-account"]);
                  }
                },
                err => {
                  console.log(err);
                  return false;
                }
              );
            }
        }else{
          localStorage.clear()
          this.authService.login();
        }
        console.log('unauthenticated navigating to login');
        return false;
    }
}
