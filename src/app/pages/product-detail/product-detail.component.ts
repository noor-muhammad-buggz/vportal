import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone, LOCALE_ID, SimpleChanges, OnChanges } from '@angular/core';
import { GlobalState } from "../../global.state";
import { ZytoVendorProductService } from '../../services/zyto-vendor-product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import "rxjs/add/operator/toPromise";

import * as moment from "moment";
import * as _ from 'lodash';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit,OnChanges {
  productId: any;
  product: any;

  pagination: any;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private zytoVendorProductService: ZytoVendorProductService,
    public globalState: GlobalState,
    private formBuilder: FormBuilder,
    private zone: NgZone
  ) { }

  ngOnInit() {
    console.log("in product detail ngOnInit");
    this.globalState.currentPage = "product-detail";
    this.globalState.currentPageTitle = `VENDOR PORTAL`;
    let selectedDistributor: any = JSON.parse(
      localStorage.getItem("selectedDistributor")
    );
    let date: any = new Date();
    date = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    this.globalState.currentPageSubTitle = `${
      selectedDistributor.Name
    } | ${date}`;

    this.route.params.subscribe(params => {
      this.productId = params["id"]; // (+) converts string 'id' to a number
      // console.log('id:' + this.id);
    });

    this.route.data.forEach((data: { product: any }) => {
      console.log("product:", data.product);
      this.product = data.product;
      this.product.SalesPrice = _.find(this.product.SalesPrices, ['Currency', 'USD']);
      this.getPagination();
    });

  }

  getPagination(){
    let params, headers;
    if (localStorage.getItem("products-params") && localStorage.getItem("products-headers")) {
      params = JSON.parse(localStorage.getItem("products-params"));
      headers = JSON.parse(localStorage.getItem("products-headers"));

      const distributorID = localStorage.getItem("selectedDistributorId");
      this.zytoVendorProductService
        .GetPreviousAndNextProductsId(
          distributorID,
          this.productId,
          params,
          headers
        )
        .subscribe(
          response => {
            this.pagination = response;
          },
          error => {}
        );
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log('changes:',changes);
    // for (let propName in changes) {
    //   let chng = changes[propName];
    //   let cur  = JSON.stringify(chng.currentValue);
    //   let prev = JSON.stringify(chng.previousValue);
    //   this.changeLog.push(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    // }
  }

  updateProductStockStatus(checked) {
    console.log('in updateProductStockStatus',checked);
    this.globalState.showLoader = true;
    this.product.InStock = checked;
    let param = {
      instock: this.product.InStock
    };
    const distributorID = localStorage.getItem("selectedDistributorId");
    this.zytoVendorProductService
      .updateProductStockStatus(distributorID,this.productId, param)
      .subscribe(
        response => {
          this.globalState.showMessageEvent.emit({
            type: "success",
            title: "",
            content: "Product successfully updated"
          });
          this.globalState.showLoader = false;
        },
        error => {
          console.log(error);
          this.globalState.showMessageEvent.emit({
            type: "error",
            title: "",
            content: error || "Product update failed"
          });
          this.globalState.showLoader = false;
        }
      );
  }

  routeToNewLink(productId) {
    //console.log('productId',productId);
    if (productId)
      this.zone.run(() => {
        //this.router.navigate(["/pages/products"]).then(() => {
          this.router.navigate(["/pages/products", productId.Id, "product-detail"]);
        //});
      });
  }

}
