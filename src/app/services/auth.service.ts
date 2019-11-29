import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import "rxjs/add/operator/filter";
import { Observable } from "rxjs/Rx";
import * as auth0 from "auth0-js";

import { environment } from "../../environments/environment";

import { ZytoVendorService } from "./zyto-vendor.service";

@Injectable()
export class AuthService {
  auth0 = new auth0.WebAuth(environment.auth);

  constructor(
    public router: Router,
    private zytoVendorService: ZytoVendorService
  ) {}

  login(): void {
    console.log("in login");
    this.auth0.authorize({
      state: `'ur='${environment.auth.redirectUri}`
    });
  }

  handleAuthentication(): void {
    console.log("in handleAuthentication");
    //throw new Error("Something went badly wrong!");
    this.auth0.parseHash((err, authResult) => {
      console.log("in parseHash");
      if (authResult && authResult.accessToken && authResult.idToken) {
        console.log("in parseHash step 1");
        window.location.hash = "";
        console.log("authResult:", authResult);
        this.setSession(authResult);

        const self = this;
        this.getProfile((err, profile) => {
          console.log("profile:", profile);

          // if(!profile){
          //   profile = {};
          // }
          // profile.roles = [];

          if (
            profile &&
            profile.roles &&
            profile.roles.indexOf("ProductXDistributorEmployee") == -1 &&
            profile.roles.indexOf("ProductXDistributorEmployeeAdmin") == -1
          ) {
            //console.log('in here 1');
            this.router.navigate(["/unauthorize"]);
          } else {
            if (profile && profile.sub) {
              //console.log("in here 2");
              let zytoOperation: Observable<any>;
              zytoOperation = this.zytoVendorService.GetDistributorsById(
                profile.sub
              );

              zytoOperation.subscribe(
                response => {
                  console.log(response);
                  console.log(response && Array.isArray(response) && response.length > 1);
                  console.log(response && response[0]);
                  if (
                    response &&
                    Array.isArray(response) &&
                    response.length > 1
                  ) {
                    //console.log("in here 3");
                    localStorage.setItem(
                      "distributorAccount",
                      JSON.stringify(response)
                    );
                  } else if (response && response[0]) {
                    //console.log("in here 4");
                    localStorage.setItem(
                      "distributorAccount",
                      JSON.stringify(response)
                    );
                    localStorage.setItem("accountId", response[0].Id);
                    localStorage.setItem("eTag", response[0].ETag);
                    localStorage.setItem(
                      "accountDetail",
                      JSON.stringify(response[0])
                    );
                  }
                  this.router.navigate(["/pages/dashboard"]);
                  //this.router.navigate(["/"]);
                },
                err => {
                  console.log(err);
                  this.router.navigate(["/"]);
                }
              );
            } else {
              this.router.navigate(["/"]);
            }
          }
        });
      } else if (err) {
        console.log("in parseHash step 2");
        this.router.navigate(["/"]);
        //authService.login();
        console.log(err);
        console.log(
          `Error: ${err.error}. Check the console for further details.`
        );
      } else {
        console.log("in parseHash step 3");
        if (!this.isAuthenticated()) {
          this.login();
        }
      }
    });
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", expiresAt);
  }

  logout(): void {
    console.log("in logout");
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("userProfile");

    localStorage.removeItem("distributorAccount");
    localStorage.removeItem("distributorAccountDetails");
    localStorage.removeItem("selectedDistributor");
    localStorage.removeItem("selectedDistributorId");
    localStorage.removeItem("eTag");

    localStorage.removeItem("accountId");
    localStorage.removeItem("accountDetail");
    localStorage.clear()
    // Go back to the home route
    //this.router.navigate(['/']);

    this.auth0.logout({
      returnTo: environment.baseURL,
      clientID: environment.auth.clientID,
      federated: true
    });
    //let url = 'https://' + environment.auth0_Domain + '/v2/logout?returnTo=' + encodeURIComponent(environment.baseURL) + '&clientID=' + environment.auth.clientID  + '&federated=true';
    //window.location.href = url;
  }

  isAuthenticated(): boolean {
    console.log("in isAuthenticated");
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    return new Date().getTime() < expiresAt;
  }

  getProfile(_callback): void {
    console.log("in getProfile");
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      throw new Error("Access token must exist to fetch profile");
    }

    const self = this;
    if (localStorage.getItem("userProfile") !== null) {
      const profile = JSON.parse(localStorage.getItem("userProfile"));
      _callback(null, profile);
    } else {
      this.auth0.client.userInfo(accessToken, (err, profile) => {
        if (profile) {
          if (!profile.user_metadata) {
            let metaKey = environment.zytoAccountURL + "user_metadata";
            profile.user_metadata = profile[metaKey] || {};
            delete profile[metaKey];
          }
          localStorage.setItem("userProfile", JSON.stringify(profile));
        }
        _callback(err, profile);
      });
    }
  }

  isDistributorAdmin(){
    let profile = (localStorage.getItem('userProfile')) ? JSON.parse(localStorage.getItem('userProfile')) : null;
    if(profile){
      return (profile.roles && profile.roles.indexOf("ProductXDistributorEmployeeAdmin") > -1)
    }
    return false;
  }

}
