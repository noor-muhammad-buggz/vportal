import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ZytoVendorProductService } from '../../services/zyto-vendor-product.service';
import { Observable } from 'rxjs/Rx';
import { GlobalState } from '../../global.state';

@Injectable()
export class ProductResolve implements Resolve<any> {

  constructor(private zytoVendorProductService: ZytoVendorProductService,public globalState:GlobalState,public router: Router) {}

  resolve(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
      this.globalState.showLoader = true;
    const distributorID = localStorage.getItem("selectedDistributorId");
    return this.zytoVendorProductService.GetProductById(distributorID,route.params.id).toPromise().then(product => {
      this.globalState.showLoader = false;
      return product;
    }).catch(error => {
      console.log('error',error);
      if(error.status == 404){
        this.router.navigateByUrl('/pages/products');
      }else{
        return null;
      }
    });
  }
}
