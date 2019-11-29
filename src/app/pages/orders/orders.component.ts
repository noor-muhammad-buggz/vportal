import { Component, OnInit, AfterViewInit } from "@angular/core";
import { GlobalState } from "../../global.state";
import { ZytoVendorService } from "../../services/zyto-vendor.service";
import { ActivatedRoute, Router } from '@angular/router';
import { DaterangepickerConfig } from "ng2-daterangepicker";

import * as moment from "moment";
import * as _ from 'lodash';

declare var $:any;

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"]
})
export class OrdersComponent implements OnInit {
  orders: any = [];
  params: any = {};

  statusList: any[];

  headers: any = {};

  continueToken: any = "";
  page:any = 1;

  options: any = {
    autoUpdateInput: false,
    locale: {
      format: "MM/DD/YYYY",
      cancelLabel: "Clear"
    },
    alwaysShowCalendars: false,
    start: moment().subtract(1, "month"),
    end: moment(),
    startDate: moment().subtract(1, "month"),
    endDate: moment(),
    parentEl:'.layout',
    cancelClass: "btn-danger"
  };

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private zytoVendorService: ZytoVendorService,
    public globalState: GlobalState,
    private daterangepickerOptions: DaterangepickerConfig
  ) {
    this.globalState.showLoader = true;
  }

  ngOnInit() {

    this.globalState.currentPage = 'orders';
    this.globalState.currentPageTitle = `VENDOR PORTAL`;
    let selectedDistributor:any = JSON.parse(localStorage.getItem('selectedDistributor'));
    let date: any = new Date();
    date = `${(date.getMonth() + 1)}/${date.getDate()}/${date.getFullYear()}`;
    this.globalState.currentPageSubTitle = `${selectedDistributor.Name} | ${date}`;

    this.statusList = [
      { value: "Shipped,Paid,Delivered", name: "All" },
      { value: "Shipped", name: "Fulfilled" },
      { value: "Paid", name: "Unfulfilled" },
      { value: "Delivered", name: "Delivered" }
    ];

    this.params = {
      statuses: this.statusList[0].value,
      // distributorId
      // accountId
      // clientId
      // distributorSalesOrderId
      // ids
      // createdOnOrAfter
      // createdBefore
      searchText: "",
      // sessionId
      billingPaidDateOnOrAfter: "",
      billingPaidDateBefore: "",
      sort: "BillingPaidDate",
      sortDescending: true
    };

    this.route
    .queryParams
    .subscribe(params => {
      console.log('in params');
      console.log();
      if(params['status']){
        let itemSelected = _.find(this.statusList,item => item.name == params['status']);
        this.params.statuses = (itemSelected)? itemSelected.value : '';
      }
    });

    this.headers = {
      "max-item-count": "50"
    };

    this.reloadSaleOrders();
  }

  reloadSaleOrders() {
    console.log("this.params", this.params);
    if(!this.globalState.showLoader)
    this.globalState.showLoader = true;
    const distributorID = localStorage.getItem("selectedDistributorId");
    this.zytoVendorService
      .GetAllSalesOrdersByDistributorId(
        distributorID,
        this.params,
        this.headers
      )
      .subscribe(response => {
        console.log("in get sale orders");
        console.log(response);
        console.log(response.headers.get("continuation-token"));
        this.continueToken = response.headers.get("continuation-token");
        // if(this.continueToken){
        //   this.page = 1;
        // }
        this.orders = response.json();
        this.globalState.showLoader = false;
      },error => {
        this.globalState.showLoader = false;
      });
  }

  ngAfterViewInit() {
    // if (/Edge/.test(navigator.userAgent)) {
    //   setTimeout(() => {
    //     this.orders = this.orders;
    //   }, 100);
    // }
  }


  selectedDate(value: any, options?: any) {
    // this is the date the iser selected
    console.log(value);
    //this.options = {};
    this.options.start = value.start;
    this.options.end = value.end;
    this.options.label = value.label;

    console.log('toISOString:',value.start.toISOString());
    // let tempDate = value.start.toDate();
    // tempDate = new Date(tempDate.getUTCFullYear(), tempDate.getUTCMonth(), tempDate.getUTCDate(),  tempDate.getUTCHours(), tempDate.getUTCMinutes(), tempDate.getUTCSeconds());
    // console.log('from utc to ISO',tempDate.toISOString());
    // console.log('from utc to ISO',moment().utc(value.start.toISOString()).toString());

    // var tzoffset = new Date(value.start.toDate()).getTimezoneOffset() * 60000; //offset in milliseconds
    // var localISOTime = (new Date(Date.now() - tzoffset)).toISOString();
    // console.log('localISOTime:',localISOTime);


    this.params["billingPaidDateOnOrAfter"] = value.start.toISOString();
    this.params["billingPaidDateBefore"] = value.end.toISOString();

    this.firstSalesOrders();
    this.reloadSaleOrders();
  }

  calendarApplied(e: any) {

  }

  ClearDate(e: any) {
    this.params["billingPaidDateOnOrAfter"] = '';
    this.params["billingPaidDateBefore"] = '';
    this.firstSalesOrders();
    this.reloadSaleOrders();
  }

  sortTable(sortField){
    this.params['sortDescending'] = (this.params['sort'] != sortField)? false : (this.params['sortDescending'] = !this.params['sortDescending']);
    this.params['sort'] = sortField;
    this.firstSalesOrders();
    this.reloadSaleOrders();
  }

  firstSalesOrders() {
    delete this.headers["continuation-token"];
    this.continueToken = null;
    this.page = 1;
    this.reloadSaleOrders();
  }


  nextSalesOrders() {
    if (this.continueToken){
      this.headers["continuation-token"] = this.continueToken;
      this.page += 1;
    }
    this.reloadSaleOrders();
  }

  searchOrders(){
    //if(this.params.searchText.length > 1){
      this.firstSalesOrders();
      this.reloadSaleOrders();
    //}
  }

  openOrderDetailPage(orderId){
    this.globalState.showLoader = true;
    this.headers["continuation-token"] = this.continueToken;
    localStorage.setItem('params',JSON.stringify(this.params));
    localStorage.setItem('headers',JSON.stringify(this.headers));
    this.router.navigate(['/pages/orders',orderId ,'order-detail']);
  }

  statusFilterOrder(){
    this.firstSalesOrders();
    this.reloadSaleOrders();
  }

  ngOnDestroy() {
  }

}
