import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ZytoVendorService } from '../../services/zyto-vendor.service';
import { Observable } from 'rxjs/Rx';
import { GlobalState } from '../../global.state';

@Injectable()
export class DistributorEmployeeResolve implements Resolve<any> {

  constructor(private zytoVendorService: ZytoVendorService,public globalState:GlobalState,public router: Router) {}

  resolve(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
      this.globalState.showLoader = true;

    const employeeId = localStorage.getItem("accountId");
    return this.zytoVendorService.GetDistributorEmployeeWithDetailsById(employeeId).toPromise().then(employee => {
      this.globalState.showLoader = false;
      return employee;
    }).catch(error => {
      if(error.status == 404){
        this.router.navigateByUrl('/');
      }else{
        return null;
      }
    });
  }
}
