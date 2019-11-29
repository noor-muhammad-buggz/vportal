import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ZytoVendorService } from '../../services/zyto-vendor.service';

import * as _ from 'lodash';
import { GlobalState } from '../../global.state';
@Component({
    selector: "app-distributor-selector",
    templateUrl: "./distributor-selector.component.html",
    styleUrls: ["./distributor-selector.component.scss"]
})
export class DistributorSelectorComponent implements OnInit {
    distributorAccountsDetails: any;

    constructor(public router: Router, private zytoVendorService: ZytoVendorService, public globalState: GlobalState) { }

    ngOnInit() {
        this.globalState.currentPage = "select-account";
      this.globalState.currentPageTitle = ``;
      this.globalState.currentPageSubTitle = ``;
        console.log('in distributor selection ngOnInit');
        this.globalState.showSidebar = false;
        console.log('this.globalState.showSidebar:', this.globalState.showSidebar);
        let distributorAccounts = JSON.parse(
            localStorage.getItem("distributorAccount")
        );
        distributorAccounts = Array.isArray(distributorAccounts)
            ? distributorAccounts
            : [distributorAccounts];

        let ids = distributorAccounts.map(item => item = item.DistributorId);
        console.log(distributorAccounts);
        console.log(ids);

        this.zytoVendorService
            .GetDistributorsDetailsByIds(ids)
            .subscribe(
                response => {

                    console.log(response);
                    this.distributorAccountsDetails = response;
                    localStorage.setItem("distributorAccountDetails", JSON.stringify(response));

                },
                err => {
                    console.log(err);
                }
            );
    }

    selectAccount(distributor) {
        localStorage.setItem("selectedDistributor", JSON.stringify(distributor));
        localStorage.setItem("selectedDistributorId", distributor.Id);

        let distributorAccounts = JSON.parse(
            localStorage.getItem("distributorAccount")
        );
        if (distributorAccounts) {
            let selectedDistributorAccount = _.find(distributorAccounts, function (
                item: any
            ) {
                return item.DistributorId == distributor.Id;
            });
            console.log('selectedDistributorAccount:', selectedDistributorAccount);
            localStorage.setItem("accountId", selectedDistributorAccount.Id);
            localStorage.setItem("eTag", selectedDistributorAccount.ETag);
            localStorage.setItem(
                "accountDetail",
                JSON.stringify(selectedDistributorAccount)
            );
        }
        this.router.navigate(["/pages/dashboard"]).then(() => {
            this.globalState.showSidebar = true;
        });
    }
}
