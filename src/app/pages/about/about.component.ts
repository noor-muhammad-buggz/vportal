import { Component, OnInit, AfterViewInit } from "@angular/core";
import { GlobalState } from "../../global.state";
import { ZytoVendorService } from "../../services/zyto-vendor.service";


import * as moment from "moment";

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"]
})
export class AboutComponent implements OnInit, AfterViewInit {
  aboutData: any;
  isFirstOpen:boolean = true;
  continuationToken: any;
  throttle = 2;
  scrollDistance = 1;
  scrollUpDistance = 2;

  constructor(
    private zytoVendorService: ZytoVendorService,
    public globalState: GlobalState
  ) {
    this.globalState.showLoader = true;
  }

  ngOnInit() {
    this.zytoVendorService.GetLatestApplicationVersion('10').subscribe(
      response => {
        let headers = response.headers;
        this.continuationToken = headers.get('continuation-token');
        let year:any = '';

        if(response.json().length > 0){
          this.aboutData = response.json();
          let date = moment(this.aboutData[0].ReleaseDate).utc(true).toDate();
          year = date.getFullYear();
        }
        this.globalState.currentPage = "about";
        this.globalState.currentPageTitle = "Support";
        // this.globalState.currentPageTitle = ``;
        this.globalState.currentPageSubTitle = ``;
        this.globalState.showLoader = false;
      },
      error => {}
    );
  }

  ngAfterViewInit(){}

  onScrollDown(ev) {
    let history = this.aboutData;
    console.log('scrolled down!!', this.continuationToken);
    if (this.continuationToken != null) {
      this.zytoVendorService.GetLatestApplicationVersion('10', this.continuationToken).subscribe(response => {
        let headers = response.headers;
        this.continuationToken = headers.get('continuation-token');
        response = response.json();
        response.forEach(element => {
          this.aboutData.push(element);
        });
      });
    }
    console.log(this.aboutData);
  }

}
