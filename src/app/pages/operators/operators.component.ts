import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ZytoVendorService } from '../../services/zyto-vendor.service';
import { GlobalState } from '../../global.state';
import { FormGroup, AbstractControl,ValidatorFn, FormBuilder, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';

import * as _ from 'lodash';
declare var $:any;

@Component({
    selector: 'app-operators',
    templateUrl: './operators.component.html',
    styleUrls: ['./operators.component.scss']
})
export class OperatorsComponent implements OnInit {
    @ViewChild("vendorAddOperatorModal") vendorAddOperatorModal: ElementRef;
    closeResult: string;

    operators:any[];
    operatorForm: FormGroup;

    editMode: boolean = false;
    employee:any;
    employeeID: any;
    perPage: any = 20;
    // currentPage: any;
    continueToken: any = "";
    page:any = 1;

    constructor(
      private route: ActivatedRoute,
      public router: Router,
      private zytoVendorService: ZytoVendorService,
      public globalState: GlobalState,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
    ) {
      this.globalState.showLoader = true;
    }

    ngOnInit() {
      this.globalState.currentPage = "operators";
      this.globalState.currentPageTitle = `Operators`;
      this.globalState.currentPageSubTitle = ``;

      this.reloadOperators();

      this.operatorForm = this.formBuilder.group({
        // FirstName: ["", Validators.compose([Validators.required])],
        // LastName: ["", Validators.compose([Validators.required])],
        Email: ["", Validators.compose([Validators.required,Validators.email])],
        // Phone: [""],
        ProductXDistributorEmployeeAdmin: [""],
      });
    }

    reloadOperators() {
      if(!this.globalState.showLoader)
      this.globalState.showLoader = true;
      const distributorID = localStorage.getItem("selectedDistributorId");
      this.zytoVendorService
        .GetAllDistributorEmployeeWithDetailsById(
          distributorID,
          {
            archived:false
          },
          this.perPage,
          this.continueToken
        )
        .subscribe(response => {
          console.log("in reloadOperators");
          console.log(response);
          this.continueToken = response.headers.get("continuation-token");
          this.operators = response.json();
          this.globalState.showLoader = false;
        },error => {
          this.globalState.showLoader = false;
        });
    }

    reset(){
      this.editMode = false;
      this.operatorForm.reset();
    }
   
    firstOperators() {
      this.continueToken = null;
      this.page = 1;
      this.reloadOperators();
    }

    nextOperators() {
      if (this.continueToken){
        this.page += 1;
      }
      this.reloadOperators();
    }

    saveOperator(ModalClose) {
      console.log("in saveOperator", this.operatorForm);
      for (const c in this.operatorForm.controls) {
        this.operatorForm.controls[c].markAsTouched();
      }

      if (!this.operatorForm.valid) {
        this.globalState.showMessageEvent.emit({
          type: "error",
          title: "",
          content: "Please fill out all required fields."
        });
        setTimeout(() => {
          let el = $('.has-error:not(form):first');

          $('html,body').animate({scrollTop: (el.offset().top - 100)}, 'slow', () => {
              el.focus();
          });
        }, 10);
        return;
      }

      const distributorID = localStorage.getItem("selectedDistributorId");

      if (!this.editMode) {
        this.globalState.showLoader = true;
        let params = {
          "DistributorId": distributorID,
          "UserEmail": this.operatorForm.controls['Email'].value,
          "Roles": (this.operatorForm.controls['ProductXDistributorEmployeeAdmin'].value == false || this.operatorForm.controls['ProductXDistributorEmployeeAdmin'].value == '' || this.operatorForm.controls['ProductXDistributorEmployeeAdmin'].value == null) ? [] : ["ProductXDistributorEmployeeAdmin"]
          // "Name": {
          //   "Prefix": "",
          //   "FirstName": this.operatorForm.controls['FirstName'].value,
          //   "MiddleName": "",
          //   "LastName": this.operatorForm.controls['LastName'].value
          // },
          // "Phone": this.operatorForm.controls['Phone'].value
        };
        this.zytoVendorService
        .createEmployee(params)
        .subscribe(
          response => {
            if (response.ETag)
              localStorage.setItem("employee-ETag", response.ETag);

              this.globalState.showMessageEvent.emit({
                type: "success",
                title: "",
                content: "Operator successfully created"
              });

              this.operatorForm.reset();
              ModalClose();

              setTimeout(() => {
                this.continueToken = null;
                this.page = 1;
                this.reloadOperators();
              }, 5000);
          },
          error => {
            console.log(error);
            this.globalState.showMessageEvent.emit({
              type: "error",
              title: "",
              content: (Array.isArray(error)? error.join(', ') : error) || "Operator save failed"
            });
            //this.operatorForm.reset();
            this.globalState.showLoader = false;
          }
        );
      }else{
        this.updateEmployee(ModalClose);
      }

    }

    updateEmployee(closeModal) {
      this.globalState.showLoader = true;
      localStorage.setItem("employee-ETag", this.employee.DistributorEmployee.ETag);
      // let nameParam = {
      //   "Name": {
      //     "Prefix": "",
      //     "FirstName": this.operatorForm.controls['FirstName'].value,
      //     "MiddleName": "",
      //     "LastName": this.operatorForm.controls['LastName'].value
      //   }
      // };
      // let nameObserver = this.zytoVendorService.
      // updateDistributorEmployeeName(this.employee.DistributorEmployee.Id,nameParam);

      // let phoneParam = {
      //   "Phone": this.operatorForm.controls['Phone'].value
      // };
      // let phoneObserver = this.zytoVendorService.
      // updateDistributorEmployeePhone(this.employee.DistributorEmployee.Id,phoneParam);

      let rolesParam = {
        "Roles": (this.operatorForm.controls['ProductXDistributorEmployeeAdmin'].value == false || this.operatorForm.controls['ProductXDistributorEmployeeAdmin'].value == '' || this.operatorForm.controls['ProductXDistributorEmployeeAdmin'].value == null) ? [] : [
          "ProductXDistributorEmployeeAdmin"
        ]
      };
      let roleObserver = this.zytoVendorService.
      updateDistributorEmployeeRole(this.employee.DistributorEmployee.Id,rolesParam);
      console.log('roleObserver:',roleObserver);


      let finalObserver;

      // let isNameChanged = ((this.operatorForm.controls['FirstName'].value != this.employee.DistributorEmployee.Name.FirstName) || (this.operatorForm.controls['LastName'].value != this.employee.DistributorEmployee.Name.LastName));
      // let isPhoneChanged = this.operatorForm.controls['Phone'].value != this.employee.DistributorEmployee.Phone;
      let isRoleChanged = !_.isEqual(rolesParam.Roles,this.employee.DistributorEmployee.Roles);

      // if(isNameChanged && isPhoneChanged && isRoleChanged){
      //   finalObserver = nameObserver.mergeMap(response =>
      //     this.zytoVendorService.updateDistributorEmployeePhone(this.employee.DistributorEmployee.Id,phoneParam).mergeMap(response2 =>
      //       this.zytoVendorService.updateDistributorEmployeeRole(this.employee.DistributorEmployee.Id,rolesParam)
      //     )
      //   );
      // }
      // else if(isNameChanged && isPhoneChanged){
      //   finalObserver = nameObserver.mergeMap(response =>
      //     this.zytoVendorService.updateDistributorEmployeePhone(this.employee.DistributorEmployee.Id,phoneParam)
      //   );
      // }
      // else if(isNameChanged && isRoleChanged){
      //   finalObserver = nameObserver.mergeMap(response =>
      //     this.zytoVendorService.updateDistributorEmployeeRole(this.employee.DistributorEmployee.Id,rolesParam)
      //   );
      // }
      // else if(isPhoneChanged && isRoleChanged){
      //   finalObserver = phoneObserver.mergeMap(response =>
      //     this.zytoVendorService.updateDistributorEmployeeRole(this.employee.DistributorEmployee.Id,rolesParam)
      //   );
      // }
      // else if(isNameChanged){
      //   finalObserver = nameObserver;
      // }else if(isPhoneChanged){
      //   finalObserver = phoneObserver;
      // }else 
      if(isRoleChanged){
        console.log('roleObserver:',roleObserver);
        finalObserver = roleObserver;
      }

      if(finalObserver){
        finalObserver.subscribe(
          response => {
            this.employee.DistributorEmployee = response;
            this.globalState.showMessageEvent.emit({
              type: "success",
              title: "",
              content: "Operator successfully updated"
            });
            this.globalState.showLoader = false;
            this.continueToken = null;
            this.page = 1;
            this.reloadOperators();
            closeModal();
          },
          error => {
            console.log(error);
            this.globalState.showMessageEvent.emit({
              type: "error",
              title: "",
              content: (Array.isArray(error)? error.join(', ') : error) || "Operator update failed"
            });
            this.globalState.showLoader = false;
          }
        );
      }else{
        this.globalState.showLoader = false;
        closeModal();
      }
    }

    showVendorAddOperatorModal() {
        this.modalService
            .open(this.vendorAddOperatorModal, { windowClass: "a_f_modal" })
            .result.then(
                result => {
                    this.reset();
                    this.closeResult = `Closed with: ${result}`;
                },
                reason => {
                  this.reset();
                    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                }
            );
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

    updateEmployeeRole(emp,checked) {
      console.log('in updateEmployeeRole',emp,checked);
      this.globalState.showLoader = true;
      emp.DistributorEmployee.Roles = (checked)? [
        "ProductXDistributorEmployeeAdmin"
      ] : [];
      let rolesParam = {
        "Roles":emp.DistributorEmployee.Roles
      };
      localStorage.setItem("employee-ETag", emp.DistributorEmployee.ETag);
      //const distributorID = localStorage.getItem("selectedDistributorId");
      this.zytoVendorService
        .updateDistributorEmployeeRole(emp.DistributorEmployee.Id, rolesParam)
        .subscribe(
          response => {
            this.globalState.showMessageEvent.emit({
              type: "success",
              title: "",
              content: "Operator successfully updated"
            });
            this.globalState.showLoader = false;
            this.reloadOperators();
          },
          error => {
            console.log(error);
            this.globalState.showMessageEvent.emit({
              type: "error",
              title: "",
              content: "Operator update failed"
            });
            this.globalState.showLoader = false;
          }
        );
    }

    removeEmployee(employee) {
      localStorage.setItem("employee-ETag", employee.DistributorEmployee.ETag);
      // var r = confirm("Are you sure you want to delete it?");
      // if (r == true) {
        let params = {
          "Archived": true
        };
        this.globalState.showLoader = true;
        this.zytoVendorService
          .archiveEmployee(employee.DistributorEmployee.Id, params)
          .subscribe(
            response => {
              this.globalState.showMessageEvent.emit({
                type: "success",
                title: "",
                content: "Operator successfully removed"
              });
              this.globalState.showLoader = false;
              this.continueToken = null;
              this.page = 1;
              this.reloadOperators();
            },
            error => {
              console.log(error);
              this.globalState.showMessageEvent.emit({
                type: "error",
                title: "",
                content: (Array.isArray(error)? error.join(', ') : error) ||  "Operator removal failed"
              });
              this.globalState.showLoader = false;
            }
          );
      // } else {
      // }
    }

    editEmployee(employeeData) {
      console.log('employeeData:',employeeData);
      this.employee = employeeData;
      this.editMode = true;
      this.operatorForm.patchValue({
        // FirstName:employeeData.DistributorEmployee.Name.FirstName,
        // LastName:employeeData.DistributorEmployee.Name.LastName,
        Email:(employeeData.User && employeeData.User.Email)? employeeData.User.Email : '',
        // Phone:employeeData.DistributorEmployee.Phone,
        ProductXDistributorEmployeeAdmin:employeeData.DistributorEmployee.Roles,
      });
      this.modalService
      .open(this.vendorAddOperatorModal, { windowClass: "a_f_modal" })
      .result.then(
          result => {
            this.reset();
              this.closeResult = `Closed with: ${result}`;
          },
          reason => {
            this.reset();
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
      );
    }


}
