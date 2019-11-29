import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit
} from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { GlobalState } from "../../global.state";
import { ZytoVendorService } from "../../services/zyto-vendor.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormArray,
  FormControl
} from "@angular/forms";

import * as moment from "moment";
import * as _ from "lodash";
import { Observable } from 'rxjs/Rx';
import { AuthService } from '../../services/auth.service';

declare var $:any;

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"]
})
export class AccountComponent implements OnInit {
  accountDetail: any;
  userProfile:any;
  employee:any;

  employeeFirstName:any;
  employeeLastName:any;
  employeePhone:any;

  @ViewChild("vendorEditProfileModal") vendorEditProfileModal: ElementRef;
  closeResult: string;

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    public router: Router,
    private zytoVendorService: ZytoVendorService,
    public authService: AuthService,
    public globalState: GlobalState,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.accountDetail = JSON.parse(localStorage.getItem("accountDetail"));
    this.userProfile = JSON.parse(localStorage.getItem("userProfile"));
    this.globalState.currentPage = "account";
    this.globalState.currentPageTitle = `MY ACCOUNT`;
    const year = new Date(
      this.accountDetail.AggregateInfo.CreatedDate
    ).getFullYear();
    this.globalState.currentPageSubTitle = `Active Since ${year}`;

    this.route.data.forEach((data: { employee: any }) => {
      console.log("employee:", data.employee);
      this.employee = data.employee;
      let profile = JSON.parse(localStorage.getItem("userProfile"));
      if(this.employee.User.PictureFromUser != profile.user_metadata.picture){
        profile.user_metadata.picture = this.employee.User.PictureFromUser;
        localStorage.setItem("userProfile", JSON.stringify(profile));
      }

    });

  }

  showVendorEditProfileModal() {
    this.employeeFirstName = this.employee.DistributorEmployee.Name.FirstName;
    this.employeeLastName = this.employee.DistributorEmployee.Name.LastName;
    this.employeePhone = this.employee.DistributorEmployee.Phone;

    this.modalService
      .open(this.vendorEditProfileModal, { windowClass: "a_f_modal" })
      .result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  updateEmployee(closeModal) {
    if (!this.employeeFirstName || !this.employeeLastName) {
      this.globalState.showMessageEvent.emit({
        type: "error",
        title: "",
        content: "Please fill out all required fields."
      });
      setTimeout(() => {
        let el = $('.has-error:not(form):first');

        $('html,body').animate({scrollTop: ((el.offset() && el.offset().top || 0) - 100)}, 'slow', () => {
            el.focus();
        });
      }, 10);
      return;
    }

    let nameParam = {
      "Name": {
        "Prefix": "Mr.",
        "FirstName": this.employeeFirstName,
        "MiddleName": "",
        "LastName": this.employeeLastName
      }
    };
    let nameObserver = this.zytoVendorService.
    updateDistributorEmployeeName(this.employee.DistributorEmployee.Id,nameParam);

    let phoneParam = {
      "Phone": this.employeePhone
    };
    let phoneObserver = this.zytoVendorService.
    updateDistributorEmployeePhone(this.employee.DistributorEmployee.Id,phoneParam);
    let finalObserver;

    let isNameChanged = ((this.employeeFirstName != this.employee.DistributorEmployee.Name.FirstName) || (this.employeeLastName != this.employee.DistributorEmployee.Name.LastName));
    let isPhoneChanged = this.employeePhone != this.employee.DistributorEmployee.Phone;

    if(isNameChanged && isPhoneChanged){
      finalObserver = nameObserver.mergeMap(reponse => this.zytoVendorService.
          updateDistributorEmployeePhone(this.employee.DistributorEmployee.Id,phoneParam)
      );
    } else if(isNameChanged){
      finalObserver = nameObserver;
    }else if(isPhoneChanged){
      finalObserver = phoneObserver;
    }

    if(finalObserver){
      this.globalState.showLoader = true;
      finalObserver.subscribe(
        response => {
          this.employee.DistributorEmployee = response;
          this.globalState.showMessageEvent.emit({
            type: "success",
            title: "",
            content: "Account successfully updated"
          });
          this.globalState.showLoader = false;
          closeModal();
        },
        error => {
          console.log(error);
          this.globalState.showMessageEvent.emit({
            type: "error",
            title: "",
            content: "Account update failed"
          });
          this.globalState.showLoader = false;
        }
      );
    }else{
      closeModal();
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
}
