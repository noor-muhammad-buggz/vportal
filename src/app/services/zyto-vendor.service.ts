import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, URLSearchParams, Response, ResponseContentType} from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/filter";

import { environment } from "../../environments/environment";

@Injectable()
export class ZytoVendorService {
  constructor(private http: Http,public router: Router) {}

  GetDistributorsById(userId) {
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("id_token")
    });

    const options = new RequestOptions({
      headers
    }); // Create a request option
    const url = environment.ApiBaseUrl.concat(
      `distributoremployees?userid=${userId}&archived=false`
    );

    return this.http
      .get(url, options)
      .map((response: Response) => response.json()) // ...and calling .json() on the response to return data
      .catch(this.handleError);
  }

  GetDistributorEmployeeWithDetailsById(distributorEmployeeId) {
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("id_token")
    });

    const options = new RequestOptions({
      headers
    }); // Create a request option
    const url = environment.ApiBaseUrl.concat(
      `distributoremployees/${distributorEmployeeId}/withdetails`
    );

    return this.http
      .get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem("employee-ETag", resp.DistributorEmployee.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  GetAllDistributorEmployeeWithDetailsById(distributorID,_params, maxCount = '', token= '') {
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("id_token")
    });
    headers.append('max-item-count', maxCount);
    headers.append('continuation-token', token);

    let params: URLSearchParams = new URLSearchParams();

    for (let key in _params) {
      params.set(key, _params[key]);
    }

    const options = new RequestOptions({
      search: params,
      headers
    }); // Create a request option

    const url = environment.ApiBaseUrl.concat(
      `distributoremployees/withdetails?distributorId=${distributorID}`
    );

    return this.http
      .get(url, options)
      .map((response: Response) => {
        // let resp: any;
        // resp = response.json();
        return response;
      })
      .catch(this.handleError);
  }

  GetDistributorsDetailsByIds(userIds) {
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("id_token")
    });

    const options = new RequestOptions({
      headers
    }); // Create a request option
    userIds = Array.isArray(userIds) ? userIds.join(",") : userIds;
    const url = environment.ApiBaseUrl.concat(`distributors?ids=${userIds}`);

    return this.http
      .get(url, options)
      .map((response: Response) => response.json()) // ...and calling .json() on the response to return data
      .catch(this.handleError);
  }

  GetDistributorsDashboardOverviewById(distributorID,isAdmin = false) {
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("id_token")
    });

    const options = new RequestOptions({
      headers
    }); // Create a request option

    let url;
    if(isAdmin){
      url = environment.ApiBaseUrl.concat(
        `reports/DistributorPortalOverview?distributorid=${distributorID}`
      );
    }else{
      url = environment.ApiBaseUrl.concat(
        `reports/DistributorPortalOverviewForEmployee?distributorid=${distributorID}`
      );
    }

    return this.http
      .get(url, options)
      .map((response: Response) => response.json()) // ...and calling .json() on the response to return data
      .catch(this.handleError);
  }

  GetAllSalesOrdersByDistributorId(distributorID, _params, _headers) {
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("id_token")
    });

    for (let key in _headers) {
      headers.append(key, _headers[key]);
    }
    // headers.append('max-item-count', '10');
    // headers.append('continuation-token', '');

    let params: URLSearchParams = new URLSearchParams();

    for (let key in _params) {
      params.set(key, _params[key]);
    }

    const options = new RequestOptions({
      search: params,
      headers
    }); // Create a request option

    const url = environment.ApiBaseUrl.concat(
      `salesorders/withdetails?distributorId=${distributorID}`
    );
    return (
      this.http
        .get(url, options)
        //.map((response: Response) => {headers:response.headers,body:response.json()}) // ...and calling .json() on the response to return data
        //.map((response: Response) => response.json()) // ...and calling .json() on the response to return data
        .catch(this.handleError)
    );
  }

  GetSalesOrdersById(orderID) {
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("id_token")
    });

    const options = new RequestOptions({
      headers
    }); // Create a request option

    const url = environment.ApiBaseUrl.concat(
      `salesorders/${orderID}/withdetails`
    );
    return this.http
      .get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem("saleOrder-ETag", resp.SalesOrder.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  GetPreviousAndNextSalesOrdersId(orderID,distributorID, _params, _headers) {
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
      `salesorders/${orderID}/previousIdandnextid?distributorId=${distributorID}`
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

  updateDistributorSaleOrderId(orderID, data) {

    const bodyString = JSON.stringify(data);
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("id_token"),
      "If-Match": localStorage.getItem("saleOrder-ETag")
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat(
      `salesorders/${orderID}/distributorsalesorderid`
    );
    return this.http
      .put(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem("saleOrder-ETag", resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  createSaleOrderFulfillment(orderID: any, body: any) {
    console.log('in createSaleOrderFulfillment');

    const bodyString = JSON.stringify(body);
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      "If-Match": localStorage.getItem("saleOrder-ETag")
    });
    const options = new RequestOptions({ headers });

    const url = environment.ApiBaseUrl.concat(`salesorders/${orderID}/shippingfulfillment/packages`);
    return this.http.post(url, bodyString, options)
    .map((response: Response) => {
      let resp: any;
      resp = response.json();
      localStorage.setItem("saleOrder-ETag", resp.ETag);
      return resp;
    })
      .catch(this.handleError);
  }

  updateSaleOrderFulfillment(orderID: any,fulfillmentID:any, body: any) {
    console.log('in updateSaleOrderFulfillment');

    const bodyString = JSON.stringify(body);
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      "If-Match": localStorage.getItem("saleOrder-ETag")
    });
    const options = new RequestOptions({ headers });
    
    const url = environment.ApiBaseUrl.concat(`salesorders/${orderID}/shippingfulfillment/packages/${fulfillmentID}`);
    return this.http.put(url, bodyString, options)
    .map((response: Response) => {
      let resp: any;
      resp = response.json();
      localStorage.setItem("saleOrder-ETag", resp.ETag);
      return resp;
    })
      .catch(this.handleError);
  }

  removeSaleOrderFulfillment(orderID: any,fulfillmentID:any) {
    console.log('in updateSaleOrderFulfillment');

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      "If-Match": localStorage.getItem("saleOrder-ETag")
    });
    const options = new RequestOptions({ headers });

    const url = environment.ApiBaseUrl.concat(`salesorders/${orderID}/shippingfulfillment/packages/${fulfillmentID}`);
    return this.http.delete(url, options)
    .map((response: Response) => {
      let resp: any;
      resp = response.json();
      localStorage.setItem("saleOrder-ETag", resp.ETag);
      return resp;
    })
      .catch(this.handleError);
  }

  GetLatestApplicationVersion(maxCount = '', continuation = '') {
    const headers = new Headers({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("id_token"),
      "max-item-count": maxCount,
      "continuation-token": continuation
    });

    const options = new RequestOptions({
      headers
    }); // Create a request option
    const url = environment.ApiBaseUrl.concat(
      `applications/DistributorPortal/applicationversions?archived=false&published=true`
    );

    return this.http
      .get(url, options)
      .map((response: Response) => response) // ...and calling .json() on the response to return data
      .catch(this.handleError);
  }

  updateDistributorEmployeeName(distributorEmployeeId, data) {
    const bodyString = JSON.stringify(data);
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("id_token"),
      "If-Match": localStorage.getItem("employee-ETag")
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat(
      `distributoremployees/${distributorEmployeeId}/name`
    );
    return this.http
      .put(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem("employee-ETag", resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  updateDistributorEmployeePhone(distributorEmployeeId, data) {
    const bodyString = JSON.stringify(data);
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("id_token"),
      "If-Match": localStorage.getItem("employee-ETag")
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat(
      `distributoremployees/${distributorEmployeeId}/phone`
    );
    return this.http
      .put(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem("employee-ETag", resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  updateDistributorEmployeeRole(distributorEmployeeId, data) {
    const bodyString = JSON.stringify(data);
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("id_token"),
      "If-Match": localStorage.getItem("employee-ETag")
    });

    console.log('In Role Update :', bodyString);


    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat(
      `distributoremployees/${distributorEmployeeId}/roles`
    );
    return this.http
      .put(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem("employee-ETag", resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }
  GetLibraryManager() {
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("id_token")
    });

    const options = new RequestOptions({
      headers
    }); // Create a request option
    const url = environment.ApiBaseUrl.concat(
      `administrators/withdetails?roles=ProductXAdministratorLibraryManager`
    );

    return this.http
      .get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        return resp;
      })
      .catch(this.handleError);
  }

  GetLibraryManagerByDistributorId(distributorID) {
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("id_token")
    });

    const options = new RequestOptions({
      headers
    }); // Create a request option
    const url = environment.ApiBaseUrl.concat(
      `administrators/withdetails?distributorId=${distributorID}&roles=ProductXAdministratorLibraryManager`
    );

    return this.http
      .get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        return resp;
      })
      .catch(this.handleError);
  }

  createEmployee(body: any) {
    const bodyString = JSON.stringify(body);
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token')
    });
    const options = new RequestOptions({ headers });

    const url = environment.ApiBaseUrl.concat(`distributoremployees/createwithuseremail`);
    return this.http.post(url, bodyString, options)
    .map((response: Response) => {
      let resp: any;
      resp = response.json();
      return resp;
    })
      .catch(this.handleError);
  }

  archiveEmployee(employeeId,data) {
    const bodyString = JSON.stringify(data);
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("id_token"),
      "If-Match": localStorage.getItem("employee-ETag")
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat(
      `distributoremployees/${employeeId}/archived`
    );
    return this.http
      .put(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem("employee-ETag", resp.ETag);
        return resp;
      })
      .catch(this.handleError);
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
