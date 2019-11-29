import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone, LOCALE_ID } from '@angular/core';
import { GlobalState } from "../../global.state";
import { ZytoVendorProductService } from '../../services/zyto-vendor-product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import "rxjs/add/operator/toPromise";

import * as moment from "moment";
import * as _ from 'lodash';

import '../product-add/ckeditor.loader';
import 'ckeditor';

import { environment } from "../../../environments/environment";
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
declare var $:any;

const ageValidation = (control: AbstractControl): {[key: string]: boolean} => {
  const min_age = control.get('MinimumAllowedAge');
  const max_age = control.get('MaximumAllowedAge');
  if (max_age.value && min_age.value) {
    return (parseInt(max_age.value) >= parseInt(min_age.value)) ? null : { invalidAge: true };
  }else{
    return null;
  }
};

@Component({
  selector: "app-product-update",
  templateUrl: "./product-update.component.html",
  styleUrls: ["./product-update.component.scss"]
})
export class ProductUpdateComponent implements OnInit {
  productId: any;
  product: any;
  productForm: FormGroup;
  description: any;

  doseOptions: any[];

  ckEditorConfig = {
    extraPlugins: "divarea",
    height: "220",
    toolbar: [
      [
        "Format",
        "Font",
        "FontSize",
        "-",
        "Undo",
        "Redo",
        "-",
        "Cut",
        "Copy",
        "Paste",
        "-",
        "Bold",
        "Italic",
        "Underline",
        "StrikeThrough",
        "-",
        "NumberedList",
        "BulletedList",
        "-",
        "JustifyLeft",
        "JustifyCenter",
        "JustifyRight",
        "JustifyBlock"
      ]
    ]
  };

  productImage: any;
  allowedMimeType = ['image/png', 'image/jpeg'];
  maxFileSize = 6 * 1024 * 1024; //6 Mb
  fileUploaderOptions = {
    authToken: "Bearer " + localStorage.getItem("id_token"),
    url: "",
    allowedMimeType: this.allowedMimeType,
    maxFileSize: this.maxFileSize,
    maxWidth:5000,
    maxHeight:5000
  };
  uploader: FileUploader = new FileUploader(this.fileUploaderOptions);
  uploadFailed = false;

  postRequest: any = {};

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private zytoVendorProductService: ZytoVendorProductService,
    public globalState: GlobalState,
    private formBuilder: FormBuilder
  ) {
    this.uploader.onWhenAddingFileFailed = (item, filter, options) =>
      this.onWhenAddingFileFailed(item, filter, options);
    this.uploader.onAfterAddingFile = item => this.onAfterAddingFile(item);
  }

  ngOnInit() {
    this.globalState.currentPage = "order-detail";
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
      // //console.log('id:' + this.id);
    });

    this.route.data.forEach((data: { product: any }) => {
      //console.log("product:", data.product);
      this.product = data.product;
      this.intializeProductEditPage();
    });
  }

  intializeProductEditPage() {
    this.doseOptions = [
      "Tablespoon",
      "Teaspoon",
      "Capsule",
      "Drop",
      "Ounce",
      "Tablet",
      "Piece",
      "Spray",
      "Scoop",
      "Milliliter",
      "Packet",
      "Bottle",
      "Milligram",
      "Gram",
      "Second",
      "Minute",
      "Treatment",
      "Session",
      "Appointment",
      "Perle",
      "Wafer",
      "Microgram",
      "InternationalUnit"
    ];

    this.productForm = this.formBuilder.group({
      Id: ["", Validators.compose([Validators.required])],
      Name: ["", Validators.compose([Validators.required])],
      Description: [""],
      SalesPrices: this.formBuilder.array([this.initSalePrice(0)]),
      PurchaseInfo: this.formBuilder.group({
        Price:this.formBuilder.group({
          Amount: [null, Validators.compose([Validators.pattern(/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/)])],
          Currency: ["USD"],
        })
      }),
      Dosage: this.formBuilder.group({
        Amount:this.formBuilder.group({
          Numerator: [null, Validators.compose([Validators.pattern(/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/)])],
          Denominator: [1, Validators.compose([Validators.pattern('^[0-9]*$')])],
        }),
        Type: [null],
        TimesPerDay:[null, Validators.compose([Validators.pattern('^[0-9]*$')])],
      }),
      Weight: [null, Validators.compose([Validators.pattern(/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/)])],
      ClientRestrictions: this.formBuilder.group({
        AgeRestriction:this.formBuilder.group({
          MinimumAllowedAge: [null, Validators.compose([Validators.pattern('^[0-9]*$')])],
          MaximumAllowedAge: [null, Validators.compose([Validators.pattern('^[0-9]*$')])],
        },{ validator:ageValidation }),
        GenderRestriction: ['', Validators.compose([Validators.required])]
      }),
      Dimensions:this.formBuilder.group({
        Length: [null,Validators.compose([Validators.pattern(/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/)])],
        Width: [null,Validators.compose([Validators.pattern(/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/)])],
        Height: [null,Validators.compose([Validators.pattern(/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/)])],
      }),
      Archived: [''],
      ContraindicationNote: ["",Validators.compose([Validators.maxLength(2000)])],
      InternalNote: ["",Validators.compose([Validators.maxLength(2000)])]
    });

    this.productForm.controls["Description"].valueChanges.subscribe(value => {
      this.description = value;
    });

    let fields = ['Name','Description','ClientRestrictions','Dimensions','Weight','SalesPrices','PurchaseInfo','Dosage','InternalNote', 'Archived', 'ContraindicationNote'];
    fields.forEach(fieldName => {
      this.productForm.controls[fieldName].valueChanges.subscribe(value => {
        let mainData = {};
        let key = `Change${fieldName}Request`;
          mainData[key] = {};
          mainData[key][fieldName] = value;
          this.postRequest = _.merge(this.postRequest, mainData);
      });
    });



    //upload files
    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      if (status === 200) {
        if (item.isSuccess) {
        }
      }else{
        this.uploadFailed = true;
        this.globalState.showMessageEvent.emit({
          type: "error",
          title: "Image Upload",
          content: (Array.isArray(response)? response.join(', ') : (response.Message || response)) || "Product image failed to upload"
        });
      }
    };

    this.uploader.onCompleteAll = () => {
      this.afterProductSaved();
    };

    
    this.product.SalesPrices = this.product.SalesPrices || [];
    this.product.Dimensions = this.product.Dimensions || {};
    this.product.PurchaseInfo = this.product.PurchaseInfo || {};
    if(this.product.ClientRestrictions && this.product.ClientRestrictions.GenderRestriction !== "MalesOnly" && this.product.ClientRestrictions.GenderRestriction !== "FemalesOnly") {
      this.product.ClientRestrictions.GenderRestriction = "NULL";
    }

    if(this.product.ClientRestrictions) {
      this.product.ClientRestrictions.AgeRestriction = this.product.ClientRestrictions.AgeRestriction || {};
    }
    this.product.ClientRestrictions = this.product.ClientRestrictions || {};
    this.product.Dosage = this.product.Dosage || {};
    this.product.Archived = this.product.Archived;
    console.log(this.product);
    this.productForm.patchValue(this.product);
    this.productId = this.product.Id;
    this.productImage = (this.product.Image)? this.product.Image.Html.Url : '';
  }

  initSalePrice(index = 0, patchValue = null){
    const salePriceGroup = this.formBuilder.group({
      Amount: [null, Validators.compose([Validators.pattern(/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/)])],
      Currency: ["USD"],
    })

    if (patchValue) salePriceGroup.patchValue(patchValue);

    return salePriceGroup
  }

  setAsTouched(group: FormGroup | FormArray) {
    group.markAsTouched();
    for (let i in group.controls) {
      if (group.controls[i] instanceof FormControl) {
        group.controls[i].markAsTouched();
      } else {
        this.setAsTouched(group.controls[i]);
      }
    }
  }

  updateValueAndValidity(group: FormGroup | FormArray) {
    group.updateValueAndValidity()
    for (let i in group.controls) {
      if (group.controls[i] instanceof FormControl) {
        group.controls[i].updateValueAndValidity();
      } else {
        this.updateValueAndValidity(group.controls[i]);
      }
     }
  }

  saveProduct() {
    //console.log("in saveProduct", this.productForm);
    let params = _.cloneDeep(this.postRequest);
    console.log(params);

    //console.log('before this.productForm.value:',params);

    if(!params.ChangeSalesPricesRequest.SalesPrices["0"].Amount){
      delete params['ChangeSalesPricesRequest'];
    }

    if(!params.ChangePurchaseInfoRequest.PurchaseInfo.Price.Amount){
      delete params['ChangePurchaseInfoRequest'];
    }

    if(!params.ChangeDosageRequest.Dosage.Amount.Numerator && !params.ChangeDosageRequest.Dosage.Type && !params.ChangeDosageRequest.Dosage.TimesPerDay){
      delete params['ChangeDosageRequest'];
      let group:any = this.productForm.controls["Dosage"];
      group.controls['Amount'].controls['Numerator'].clearValidators();
      group.controls['Type'].clearValidators();
      group.controls['TimesPerDay'].clearValidators();
      this.updateValueAndValidity(group);
    }else{
      let group:any = this.productForm.controls["Dosage"];
      group.controls['Amount'].controls['Numerator'].setValidators([Validators.required,Validators.pattern(/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/)]);
      group.controls['Type'].setValidators([Validators.required]);
      group.controls['TimesPerDay'].setValidators([Validators.required,Validators.pattern('^[0-9]*$')]);
      this.updateValueAndValidity(group);
    }

    // if(!params.ChangeClientRestrictionsRequest.ClientRestrictions.AgeRestriction.MinimumAllowedAge && !params.ChangeClientRestrictionsRequest.ClientRestrictions.AgeRestriction.MaximumAllowedAge && !params.ChangeClientRestrictionsRequest.ClientRestrictions.GenderRestriction){
    //   delete params['ChangeClientRestrictionsRequest'];
    //   let group:any = this.productForm.controls["ClientRestrictions"];
    //   group.controls['AgeRestriction'].controls['MinimumAllowedAge'].clearValidators();
    //   group.controls['AgeRestriction'].controls['MaximumAllowedAge'].clearValidators();
    //   group.controls['GenderRestriction'].clearValidators();
    //   this.updateValueAndValidity(group);
    // }else{
    //   let group:any = this.productForm.controls["ClientRestrictions"];
    //   group.controls['AgeRestriction'].controls['MinimumAllowedAge'].setValidators([Validators.required,Validators.pattern('^[0-9]*$')]);
    //   group.controls['AgeRestriction'].controls['MaximumAllowedAge'].setValidators([Validators.required,Validators.pattern('^[0-9]*$')]);
    //   group.controls['GenderRestriction'].setValidators([Validators.required]);
    //   this.updateValueAndValidity(group);
    // }

    if(params.ChangeDimensionsRequest.Dimensions.Length || params.ChangeDimensionsRequest.Dimensions.Width || params.ChangeDimensionsRequest.Dimensions.Height){
      let group:any = this.productForm.controls["Dimensions"];
      group.controls['Height'].setValidators([Validators.required,Validators.pattern(/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/)]);
      group.controls['Length'].setValidators([Validators.required,Validators.pattern(/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/)]);
      group.controls['Width'].setValidators([Validators.required,Validators.pattern(/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/)]);
      this.updateValueAndValidity(group);
    }else{
      delete params['ChangeDimensionsRequest'];
      let group:any = this.productForm.controls["Dimensions"];
      group.controls['Height'].clearValidators();
      group.controls['Length'].clearValidators();
      group.controls['Width'].clearValidators();
      this.updateValueAndValidity(group);
    }

    if(params.ChangeWeightRequest.Weight == null || typeof params.ChangeWeightRequest.Weight == 'undefined'){
      delete params['ChangeWeightRequest'];
    }

    //console.log('after this.productForm.value:',params);

    this.setAsTouched(this.productForm);

    if (!this.productForm.valid) {
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

    if(params.ChangeClientRestrictionsRequest.ClientRestrictions.GenderRestriction == "NULL") {
      params.ChangeClientRestrictionsRequest.ClientRestrictions.GenderRestriction = "";
    }

    const distributorID = localStorage.getItem("selectedDistributorId");

    this.globalState.showLoader = true;

    this.zytoVendorProductService
      .updateProduct(distributorID, this.productId, params)
      .subscribe(
        response => {
          if (response.ETag)
            localStorage.setItem("product-ETag", response.ETag);

          //console.log("this.uploader:", this.uploader);
          let productImageUploadURL = environment.ApiBaseUrl.concat(
            `distributors/${distributorID}/distributorproducts/${
              response.Id
            }/image/upload`
          );
          this.uploader.options.url = productImageUploadURL;
          if (this.uploader.queue.length > 0) {
            //console.log("this.uploader:", this.uploader);
            //this.uploader.uploadAll();
            this.uploader.queue.forEach((item, index) => {
              item.url = productImageUploadURL;
              item.withCredentials = false;
              //console.log("item:", item);
              item.upload();
              //console.log('item.isUploading:' + item.isUploading);
            });
          } else {
            this.afterProductSaved();
          }
        },
        error => {
          //console.log(error);
          this.globalState.showMessageEvent.emit({
            type: "error",
            title: "",
            content: error || "Product update failed"
          });
          this.globalState.showLoader = false;
        }
      );
  }

  restForm() {}

  onDescriptionChange(value) {
    this.productForm.controls["Description"].patchValue(value);
  }
  
  afterProductSaved() {
    this.globalState.showMessageEvent.emit({
      type: "success",
      title: "",
      content: "Product successfully updated"
    });
    if(!this.uploadFailed){
      this.router.navigate(['/pages/products',this.productId ,'product-detail']);
    }else{
      this.uploadFailed = false;
    }
    this.globalState.showLoader = false;
  }


  removeImage($event) {
    event.stopPropagation();

    var r = confirm("Are you sure you want to remove this image?");
    if (r == true) {
      const distributorID = localStorage.getItem("selectedDistributorId");
      this.zytoVendorProductService
        .removeProductImage(distributorID, this.productId)
        .subscribe(
          response => {
            if (response.ETag)
              localStorage.setItem("product-ETag", response.ETag);
            this.globalState.showMessageEvent.emit({
              type: "success",
              title: "",
              content: "Product image removed successfully"
            });
            this.productImage = null;
            this.product.Image = null;
          },
          error => {
            //console.log(error);
            this.globalState.showMessageEvent.emit({
              type: "error",
              title: "",
              content: "Product image removal failed"
            });
            this.globalState.showLoader = false;
          }
        );
    } else {
    }
  }

  imageInputChanged(fileInput: any) {
    var timer = setTimeout(() => {
      this.previewInputImage(fileInput.target.files[0], "#preview-");
      clearTimeout(timer);
    }, 500);
  }

  previewInputImage(file, selector) {
    let reader = new FileReader();

    reader.onload = (e: any) => {
      //$(selector).attr('src', e.target.result);
      this.productImage = e.target.result;
    };

    reader.readAsDataURL(file);
  }

  onWhenAddingFileFailed(item: FileLikeObject, filter: any, options: any) {
    let errorMessage;
    switch (filter.name) {
      case "fileSize":
        errorMessage = `Maximum upload size exceeded (6 MB allowed)`;
        break;
      case "mimeType":
        const allowedTypes = this.allowedMimeType.join();
        errorMessage = `Type "${
          item.type
        } is not allowed. Allowed types: "${allowedTypes}"`;
        break;
        case "imageDimension":
        errorMessage = `Dimension exceeded - Maximum allowed image dimensions are 5000px(w) x 5000px(h)`;
        break;
      default:
        errorMessage = `Unknown error (filter is ${filter.name})`;
    }
    this.globalState.showMessageEvent.emit({
      type: "error",
      title: "",
      content: errorMessage
    });
    this.productImage = (this.product.Image)? this.product.Image.Html.Url : '';
    $('#fileInput').val('');
  }

  onAfterAddingFile(fileItem) {
    this.getImageDimension(fileItem._file).then((imgFile) => {
      if(imgFile.naturalWidth > this.fileUploaderOptions.maxWidth || imgFile.naturalHeight > this.fileUploaderOptions.maxHeight){
        let errorMessage = `Dimension exceeded - Maximum allowed image dimensions are 5000px(w) x 5000px(h)`;
        this.globalState.showMessageEvent.emit({
          type: "error",
          title: "",
          content: errorMessage
        });
        this.uploader.removeFromQueue(fileItem);
        this.productImage = (this.product.Image)? this.product.Image.Html.Url : '';
        $('#fileInput').val('');
      }else{
        this.previewInputImage(fileItem._file, "");
      }
    }).catch((error) => {
      this.uploader.removeFromQueue(fileItem);
      this.productImage = (this.product.Image)? this.product.Image.Html.Url : '';
      $('#fileInput').val('');
    })
  }

  getImageDimension(imageFile): Promise<any> {
    return new Promise(function (resolve, reject) {
      const fr = new FileReader;
      fr.onload = function () {
        const image = new Image();
          image.onload = function () {
              resolve(image);
          };
          image.onerror = function (error) {
            reject(error);
          }
          image.src = fr.result;
      };
      fr.onerror = function (error) {
        reject(error);
      }
      fr.readAsDataURL(imageFile);
    });
  }

  /**
   * Deep diff between two object, using lodash
   * @param  {Object} object Object compared
   * @param  {Object} base   Object to compare with
   * @return {Object}        Return a new object who represent the diff
   */
  difference(object, base) {
    function changes(object, base) {
      return _.transform(object, function(result, value, key) {
        if (!_.isEqual(value, base[key])) {
          result[key] =
            _.isObject(value) && _.isObject(base[key])
              ? changes(value, base[key])
              : value;
        }
      });
    }
    return changes(object, base);
  }
}
