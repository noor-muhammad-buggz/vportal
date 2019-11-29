import { Component, OnInit, AfterViewInit } from "@angular/core";
import { GlobalState } from "../../global.state";
import { ZytoVendorService } from "../../services/zyto-vendor.service";
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DaterangepickerConfig } from "ng2-daterangepicker";

import * as moment from "moment";

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  dashboardData: any;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private zytoVendorService: ZytoVendorService,
    private authService: AuthService,
    public globalState: GlobalState
  ) {
    this.globalState.showLoader = true;
  }

  ngOnInit() {
    this.globalState.currentPage = 'dashboard';
    this.globalState.currentPageTitle = `VENDOR PORTAL`;
    let selectedDistributor:any = JSON.parse(localStorage.getItem('selectedDistributor'));
    let date: any = new Date();
    date = `${(date.getMonth() + 1)}/${date.getDate()}/${date.getFullYear()}`;
    this.globalState.currentPageSubTitle = `${selectedDistributor.Name} | ${date}`;

    const distributorID = localStorage.getItem("selectedDistributorId");
    this.zytoVendorService.GetDistributorsDashboardOverviewById(distributorID,this.authService.isDistributorAdmin()).subscribe(response => {
      this.dashboardData = response;
      if(this.authService.isDistributorAdmin() && this.dashboardData.Data.SalesOrders && this.dashboardData.Data.SalesOrders.Months){
        this.dashboardData.Data.SalesOrders.Months.map(item => {
          item.date = new Date(item.Year,item.Month - 1,1);
          //console.log(item.date);
          return item;
        });
      }
      this.globalState.showLoader = false;
    },error => {

    });
  }

  ngAfterViewInit() {
  }

}
