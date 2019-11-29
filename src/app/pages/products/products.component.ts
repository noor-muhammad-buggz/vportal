import { Component, OnInit, AfterViewInit } from "@angular/core";
import { GlobalState } from "../../global.state";
import { ZytoVendorProductService } from "../../services/zyto-vendor-product.service";
import { ActivatedRoute, Router } from '@angular/router';
import { DaterangepickerConfig } from "ng2-daterangepicker";

import * as moment from "moment";
import * as _ from 'lodash';

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"]
})
export class ProductsComponent implements OnInit {
  products: any = [];
  params: any = {};

  statusList: any[];

  headers: any = {};

  continueToken: any = "";
  page:any = 1;
  showArchived: any;
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
    private zytoVendorProductService: ZytoVendorProductService,
    public globalState: GlobalState,
    private daterangepickerOptions: DaterangepickerConfig
  ) {
    this.globalState.showLoader = true;
  }

  ngOnInit() {
    localStorage.removeItem("product-ETag");
    this.globalState.currentPage = 'products';
    this.globalState.currentPageTitle = `VENDOR PORTAL`;
    let selectedDistributor:any = JSON.parse(localStorage.getItem('selectedDistributor'));
    let date: any = new Date();
    date = `${(date.getMonth() + 1)}/${date.getDate()}/${date.getFullYear()}`;
    this.globalState.currentPageSubTitle = `${selectedDistributor.Name} | ${date}`;

    this.statusList = [
      { value: "", name: "All" },
      { value: true, name: "In Stock" },
      { value: false, name: "Out of Stock" },
    ];

    this.params = {
      instock: this.statusList[0].value,
      // distributorId
      // accountId
      // clientId
      // distributorSalesOrderId
      // ids
      // createdOnOrAfter
      // createdBefore
      searchText: "",
      // sessionId
      //billingPaidDateOnOrAfter: "",
      //billingPaidDateBefore: "",
      // sort: "LastModified",
      sort: "Name",
      sortDescending: false
    };

    this.route
    .queryParams
    .subscribe(params => {
      console.log('in params');
      console.log(params);
      if(params['instock']){
        this.params.instock = params['instock'];
      }
    });
    this.params['archived'] = false;
    this.headers = {
      "max-item-count": "50"
    };

    this.reloadProducts();
  }

  reloadProducts() {
    console.log("this.params", this.params);
    if(!this.globalState.showLoader)
    this.globalState.showLoader = true;
    const distributorID = localStorage.getItem("selectedDistributorId");
    this.zytoVendorProductService
      .GetAllProductsByDistributorId(
        distributorID,
        this.params,
        this.headers
      )
      .subscribe(response => {
        console.log("in get products");
        console.log(response);
        console.log(response.headers.get("continuation-token"));
        this.continueToken = response.headers.get("continuation-token");
        response = response.json();
        this.products = response.map(product => {
          product.SalesPrice = _.find(product.SalesPrices, ['Currency', 'USD']);
          return product;
        });
        console.log('this.products:',this.products);
        this.globalState.showLoader = false;
      },error => {
        this.globalState.showLoader = false;
      });
  }

  updateProductStockStatus(product,checked) {
    console.log('in updateProductStockStatus',checked);
    this.globalState.showLoader = true;
    product.InStock = checked;
    let param = {
      instock: product.InStock
    };
    localStorage.setItem("product-ETag", product.ETag);
    const distributorID = localStorage.getItem("selectedDistributorId");
    this.zytoVendorProductService
      .updateProductStockStatus(distributorID,product.Id, param)
      .subscribe(
        response => {
          this.globalState.showMessageEvent.emit({
            type: "success",
            title: "",
            content: "Product successfully updated"
          });
          this.reloadProducts();
          // this.globalState.showLoader = false;
        },
        error => {
          console.log(error);
          this.globalState.showMessageEvent.emit({
            type: "error",
            title: "",
            content: "Product update failed"
          });
          this.globalState.showLoader = false;
        }
      );
  }

  ngAfterViewInit() {
  }

  changeArchived() {
    this.params['archived'] = (this.showArchived) ? '' : this.showArchived;
    console.log(this.params);
    this.reloadProducts();
  }
  // selectedDate(value: any, options?: any) {
  //   // this is the date the iser selected
  //   console.log(value);
  //   //this.options = {};
  //   this.options.start = value.start;
  //   this.options.end = value.end;
  //   this.options.label = value.label;

  //   console.log('toISOString:',value.start.toISOString());
  //   // let tempDate = value.start.toDate();
  //   // tempDate = new Date(tempDate.getUTCFullYear(), tempDate.getUTCMonth(), tempDate.getUTCDate(),  tempDate.getUTCHours(), tempDate.getUTCMinutes(), tempDate.getUTCSeconds());
  //   // console.log('from utc to ISO',tempDate.toISOString());
  //   // console.log('from utc to ISO',moment().utc(value.start.toISOString()).toString());

  //   // var tzoffset = new Date(value.start.toDate()).getTimezoneOffset() * 60000; //offset in milliseconds
  //   // var localISOTime = (new Date(Date.now() - tzoffset)).toISOString();
  //   // console.log('localISOTime:',localISOTime);


  //   this.params["billingPaidDateOnOrAfter"] = value.start.toISOString();
  //   this.params["billingPaidDateBefore"] = value.end.toISOString();

  //   this.reloadProducts();
  // }

  // calendarApplied(e: any) {

  // }

  // ClearDate(e: any) {
  //   this.params["billingPaidDateOnOrAfter"] = '';
  //   this.params["billingPaidDateBefore"] = '';
  //   this.reloadProducts();
  // }

  sortTable(sortField){
    this.params['sortDescending'] = (this.params['sort'] != sortField)? false : (this.params['sortDescending'] = !this.params['sortDescending']);
    this.params['sort'] = sortField;

    this.firstSalesProducts();
    // this.reloadProducts();
  }

  firstSalesProducts() {
    delete this.headers["continuation-token"];
    this.continueToken = null;
    this.page = 1;
    this.reloadProducts();
  }


  nextSalesProducts() {
    if (this.continueToken){
      this.headers["continuation-token"] = this.continueToken;
      this.page += 1;
    }
    this.reloadProducts();
  }

  searchProducts(){
    //if(this.params.searchText.length > 1){
      this.firstSalesProducts();
      this.reloadProducts();
    //}
  }

  stockFilterOrder(){
    this.firstSalesProducts();
    this.reloadProducts();
  }

  openProductDetailPage(productId){
    this.globalState.showLoader = true;
    this.headers["continuation-token"] = this.continueToken;
    localStorage.setItem('products-params',JSON.stringify(this.params));
    localStorage.setItem('products-headers',JSON.stringify(this.headers));
    this.router.navigate(['/pages/products',productId ,'product-detail']);
  }

  ngOnDestroy() {
  }

}
