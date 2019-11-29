import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ZytoVendorService } from '../../services/zyto-vendor.service';
import { Observable } from 'rxjs/Rx';
import { GlobalState } from '../../global.state';

@Injectable()
export class OrderResolve implements Resolve<any> {

  constructor(private zytoVendorService: ZytoVendorService,public globalState:GlobalState,public router: Router) {}

  resolve(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
      this.globalState.showLoader = true;
    return this.zytoVendorService.GetSalesOrdersById(route.params.id).toPromise().then(order => {
      this.globalState.showLoader = false;
      return order;
    }).catch(error => {
          console.log('error',error);
          if(error.status == 404){
            this.router.navigateByUrl('/pages/orders');
          }else{
            return null;
          }
        });
  }
}
