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

@Component({
    selector: "app-library-manager",
    templateUrl: "./library-manager.component.html",
    styleUrls: ["./library-manager.component.scss"]
})
export class LibraryManagerComponent implements OnInit {
    accountDetail: any;
    userProfile: any;
    libraryManager: any;
    libraryManagers: any;

    // employeeFirstName:any;
    // employeeLastName:any;
    // employeePhone:any;

    @ViewChild("vendorEditProfileModal") vendorEditProfileModal: ElementRef;
    closeResult: string;

    constructor(
        private modalService: NgbModal,
        private route: ActivatedRoute,
        public router: Router,
        private zytoVendorService: ZytoVendorService,
        public globalState: GlobalState,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        //this.accountDetail = JSON.parse(localStorage.getItem("accountDetail"));
        //this.userProfile = JSON.parse(localStorage.getItem("userProfile"));
        this.globalState.currentPage = "library-manager";
        this.globalState.currentPageTitle = `Library Manager`;
        this.globalState.currentPageSubTitle = ``;

        console.log('this.route.data', this.route.data);
        this.libraryManagers = this.route.snapshot.data['libraryManager'];
        console.log("libraryManager:", this.libraryManagers);



        this.route.data.forEach((data: { libraryManager: any }) => {
            console.log("libraryManager:", data.libraryManager);
            this.libraryManager = data.libraryManager;
        });

    }

}
