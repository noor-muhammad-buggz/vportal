import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, URLSearchParams, Response, ResponseContentType} from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/filter";

import { environment } from "../../environments/environment";


@Injectable()
export class ZytoVendorProductService {
  constructor(private http: Http,public router: Router) {}

  GetAllProductsByDistributorId(distributorID, _params, _headers) {
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("id_token")
    });

    for (let key in _headers) {
      console.log("key:", key);
      console.log("_params[key]", _headers[key]);
      headers.append(key, _headers[key]);
    }
    // headers.append('max-item-count', '10');
    // headers.append('continuation-token', '');

    console.log("_params:", _params);
    let params: URLSearchParams = new URLSearchParams();

    for (let key in _params) {
      console.log("key:", key);
      params.set(key, _params[key]);
    }
    console.log("params:", params);

    const options = new RequestOptions({
      search: params,
      headers
    }); // Create a request option

    const url = environment.ApiBaseUrl.concat(
      `distributors/${distributorID}/distributorproducts`
    );
    return (
      this.http
        .get(url, options)
        //.map((response: Response) => {headers:response.headers,body:response.json()}) // ...and calling .json() on the response to return data
        //.map((response: Response) => response.json()) // ...and calling .json() on the response to return data
        .catch(this.handleError)
    );
  }

  GetProductById(distributorID,productID) {
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("id_token")
    });

    const options = new RequestOptions({
      headers
    }); // Create a request option

    const url = environment.ApiBaseUrl.concat(
      `distributors/${distributorID}/distributorproducts/${productID}`
    );
    return this.http
      .get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem("product-ETag", resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  updateProductStockStatus(distributorID,productID, data) {

    const bodyString = JSON.stringify(data);
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("id_token"),
      "If-Match": localStorage.getItem("product-ETag")
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat(
      `distributors/${distributorID}/distributorproducts/${productID}/instock`
    );
    return this.http
      .put(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem("product-ETag", resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  createProduct(distributorID,productID: any, body: any) {
    console.log('in createSaleOrderFulfillment');

    const bodyString = JSON.stringify(body);
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      "If-Match": localStorage.getItem("saleOrder-ETag")
    });
    const options = new RequestOptions({ headers });

    const url = environment.ApiBaseUrl.concat(`distributors/${distributorID}/distributorproducts/${productID}`);
    return this.http.post(url, bodyString, options)
    .map((response: Response) => {
      let resp: any;
      resp = response.json();
      localStorage.setItem("product-ETag", resp.ETag);
      return resp;
    })
      .catch(this.handleError);
  }

  updateProduct(distributorID,productID, data) {
    const bodyString = JSON.stringify(data);
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("id_token"),
      "If-Match": localStorage.getItem("product-ETag")
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat(
      `distributors/${distributorID}/distributorproducts/${productID}/bulkchange`
    );
    return this.http
      .post(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem("product-ETag", resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  removeProductImage(distributorID,productID) {
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("id_token"),
      "If-Match": localStorage.getItem("product-ETag")
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat(
      `distributors/${distributorID}/distributorproducts/${productID}/image`
    );
    return this.http
      .delete(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem("product-ETag", resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  GetPreviousAndNextProductsId(distributorID, productID, _params, _headers) {
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("id_token")
    });

    for (let key in _headers) {
      //console.log("key:", key);
      //console.log("_params[key]", _headers[key]);
      headers.append(key, _headers[key]);
    }

    //console.log("_params:", _params);
    let params: URLSearchParams = new URLSearchParams();

    for (let key in _params) {
      //console.log("key:", key);
      params.set(key, _params[key]);
    }
    //console.log("params:", params);

    const options = new RequestOptions({
      search: params,
      headers
    }); // Create a request option

    const url = environment.ApiBaseUrl.concat(
      `distributors/${distributorID}/distributorproducts/${productID}/previousIdandNextId`
    );
    return (
      this.http
        .get(url, options)
        .map((response: Response) => {
          let resp: any;
          resp = response.json();
          return resp;
        })
        .catch(this.handleError)
    );
  }

  handleError(error: any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.Message || JSON.stringify(body);
      errMsg = err;
      //errMsg = (err.Message)? err.Message : `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
