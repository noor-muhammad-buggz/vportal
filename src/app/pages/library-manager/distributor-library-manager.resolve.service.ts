import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ZytoVendorService } from '../../services/zyto-vendor.service';
import { Observable } from 'rxjs/Rx';
import { GlobalState } from '../../global.state';

@Injectable()
export class DistributorLibraryManagerResolve implements Resolve<any> {

    constructor(private zytoVendorService: ZytoVendorService, public globalState: GlobalState, public router: Router) { }

    resolve(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        this.globalState.showLoader = true;

        const distributorID = localStorage.getItem("selectedDistributorId");
        return this.zytoVendorService.GetLibraryManager().toPromise().then(libraryManager => {
            console.log('libraryManager:', libraryManager);
            this.globalState.showLoader = false;
            return libraryManager;
        }).catch(error => {
            if (error.status == 404) {
                this.router.navigateByUrl('/');
            } else {
                return null;
            }
        });
    }
}
