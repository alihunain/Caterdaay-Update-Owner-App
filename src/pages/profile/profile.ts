import { Component } from '@angular/core';
import {  NavController, NavParams, LoadingController, ToastController, AlertController, Platform, ActionSheetController   } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { imageUrlupload } from "./../../services/global";
import { OneService } from "./../../services/one.service";
import { TwoService } from "./../../services/two.service";
import { ImageViewerController } from 'ionic-img-viewer';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
declare var google:any;

import * as globalVariable from "../../services/global";


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  owner: any;
  restaurant: any;
  lat: any;
  lng: any;
  marker: any;
  geocoder: any;

  imageURL : string = globalVariable.imageUrl;



  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController
    ) {
    if (localStorage.getItem('owner')){
      this.restaurant = JSON.parse(localStorage.getItem('owner'));
      this.owner = JSON.parse(localStorage.getItem('owner'))['ownerId'];

      setTimeout(() => {
        this.loadMap();
      }, 1000);
    }
  }

  ownerImage(img){
    let imgPath : any;
    if (typeof img == 'undefined' || img == null) {
      imgPath = "assets/imgs/profile.png";
    }else{
      imgPath = this.imageURL + img;
    }
    return imgPath;
  }

  ionViewDidLoad() {}
  
  loadMap() {    
    var options = {
      center: new google.maps.LatLng(this.restaurant.lat, this.restaurant.lng),
      zoom: 12
    }
    var map = new google.maps.Map(document.getElementById("map"), options)
    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(this.restaurant.lat, this.restaurant.lng),
      map:map
    });
  }
  goToPassword() {
    this.navCtrl.push(ChangePasswordPage);
  }
  goToEdit() {
    this.navCtrl.push(ProfileEditPage);
  }
  doLogout() {

  }
  viewIds() {
    this.navCtrl.push(ViewIdsPage);
  }
}

// edit profile component
@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html',
})
export class ProfileEditPage {
  owner : any;
  editlat: any;
  editlng:any;
  geocoder: any;
  marker: any;
  latlng: any;
  editForm: FormGroup;

  imageURL : string = globalVariable.imageUrl;


  public phoneRegex = /^[+]?\d+(\.\d+)?$/;
  emailp: any = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
  formErrors = {
    'username': '',
    'email': '',
    'ownerfirstname': '',
    'ownerlastname': '',
    'ownerphoneno': ''
  };
  validationMessages = {
    'ownerfirstname': {
      'required': 'Email is required.'
    },
    'ownerlastname': {
      'required': 'Email is required.'
    },
    'username': {
      'required': 'Username is required.',
      'minlength': 'Username must be at least 4 and maximum 64 characters long.',
      'maxlength': 'Username cannot be more than 64 characters long.',
      'pattern': 'Username cannot use Numberic, Special characters, Space Etc. '
    },
    'email': {
      'required': 'Email is required.',
      'pattern': 'Email not in well format.'
    },
    'ownerphoneno': {
      'required': 'Phone no. is required.',
      'minlength': 'Phone no. should minimum 4 digit.',
      'pattern': 'Password use only Numbers Digits'
    }
  };
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private lf: FormBuilder,
    private oneService: OneService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {
    
    this.editForm = this.lf.group({
      _id: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(64), Validators.pattern('[a-zA-Z ]*')]],
      ownerfirstname: ['', [Validators.required]],
      ownerlastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(this.emailp)]],
      ownerphoneno: ['', [Validators.required, Validators.pattern(this.phoneRegex)]],
      owneraddress: ['']
    });
    if (JSON.parse(localStorage.getItem('owner'))) {
      this.owner = JSON.parse(localStorage.getItem('owner'))['ownerId'];
      this.editForm.patchValue(this.owner); 
    }
    this.editForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }
  
  ionViewDidLoad() {
    this.EditMap();
  }

  ownerImage(img){
    let imgPath : any;
    if (img != null) {
      imgPath = this.imageURL + img;
    }
    if (typeof img == 'undefined' || img == null) {
      imgPath = "assets/imgs/profile.png";
    }
    return imgPath;
  }
  
  EditMap() {
    this.geocoder = new google.maps.Geocoder();
    if (this.geocoder) {
      this.geocoder.geocode({ 'address': this.editForm.controls.owneraddress.value }, (results, status) =>{
        if (status == google.maps.GeocoderStatus.OK) {
          this.editlat = results[0].geometry.location.lat();
          this.editlng = results[0].geometry.location.lng();
          var options = {
            center: new google.maps.LatLng(this.editlat, this.editlng),
            zoom: 12
          }
          var map = new google.maps.Map(document.getElementById("editmap"), options)

          this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(this.editlat, this.editlng),
            map: map,
            draggable: true
          });
          google.maps.event.addListener(this.marker, 'dragend',  (event) => {
            this.latlng = new google.maps.LatLng(this.marker.position.lat(), this.marker.position.lng());
            this.geocoder.geocode({ 'latLng': this.latlng }, (results, status) => {
              if (status == google.maps.GeocoderStatus.OK) {
                this.editForm.controls['owneraddress'].setValue(results[0].formatted_address);
              }
            });
          });
        }
      });
    } 
  }

  onValueChanged(data?: any) {
    if (!this.editForm) { return; }
    const form = this.editForm;
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
  
  profileUpdate(){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.oneService.editOwner(this.editForm.value).subscribe((data) => {
      if (!data.error) {
        localStorage.removeItem('owner');
        localStorage.setItem('owner', JSON.stringify(data.message));
        loading.dismiss();
        this.getToast('Profile updated successfully.');
        this.navCtrl.pop();
      } else {
        this.getToast(data.message);
      }
    });
  }

  private getToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top' //top,middle,bottom
    });
    toast.present();
  }

}

// change password
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  passwordForm: FormGroup;
  passwordp:any;
  fulldetail:any;
  oldmatch: any;
  MutchPassword: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private twoService: TwoService,
    private oneService: OneService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private lf: FormBuilder
    ) {
    this.passwordForm = this.lf.group({
      _id: ['', Validators.required],
      oldpassword: ['', Validators.required],
      password: ['', Validators.required],
      confirmpassword: ['', Validators.required],
      matchpass: ['', Validators.required],
      oldmatch: ['', Validators.required]
    });
    this.fulldetail = JSON.parse(localStorage.getItem('owner'));
    this.passwordForm.controls["_id"].setValue(this.fulldetail._id);

    this.twoService.getComplexity().subscribe(data => {
      if (!data.error) {
        this.passwordp = data.message[0].ownerpasscomplexity.regex;
        this.setpasswordmessage(data.message[0].ownerpasscomplexity.name);

        this.passwordForm.valueChanges.subscribe(data => this.onValueChanged(data));
        this.onValueChanged();
      }
    });
  }

  public oldpassword() {
    if (this.fulldetail.ownerId.password == this.passwordForm.value.oldpassword) {
      this.passwordForm.controls["oldmatch"].setValue(true);
      this.oldmatch = false;
    } else {
      this.passwordForm.controls["oldmatch"].setValue("");
      this.oldmatch = true;
    }
  }

  public matchpassword(type) {

    if (type == 'match') {
      if (this.passwordForm.value.password != '') {
        if (this.passwordForm.value.password == this.passwordForm.value.confirmpassword) {
          this.passwordForm.controls["matchpass"].setValue(true);
          this.MutchPassword = false;
        } else {
          this.passwordForm.controls["matchpass"].setValue("");
          this.MutchPassword = true;
        }
      }
    }else{
      if (this.passwordForm.value.confirmpassword != '') {
        if (this.passwordForm.value.password == this.passwordForm.value.confirmpassword) {
          this.passwordForm.controls["matchpass"].setValue(true);
          this.MutchPassword = false;
        } else {
          this.passwordForm.controls["matchpass"].setValue("");
          this.MutchPassword = true;
        }
      }


    }
  }

  setpasswordmessage(name) {
    if (name == 'simplepassword') {
      this.validationMessages.password['pattern'] = 'Password must contain min 8 Digits alphanumeric only';
    }

    if (name == 'medium') {
      this.validationMessages.password['pattern'] = 'TBD';
    }

    if (name == 'complex') {
      this.validationMessages.password['pattern'] = 'TBD';
    }

    if (name == 'none') {
      this.validationMessages.password['pattern'] = '';
    }
  }

  formErrors = {
    'password': ''
  };

  validationMessages = {
    'password': {
      'required': 'Password is required.'
    }
  };

  public onValueChanged(data?: any) {

    if (!this.passwordForm) { return; }
    const form = this.passwordForm;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  passwordUpdate(){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    var obj = { _id: this.fulldetail.ownerId._id, password: this.passwordForm.value.password };
    this.oneService.passwordEditOwner(obj).subscribe(
      (data) => {
        if (!data.error) {
          localStorage.removeItem('owner');
          localStorage.setItem('owner', JSON.stringify(data.message));
          loading.dismiss();
          this.getToast('Password updated successfully.');
          this.navCtrl.pop();
        } else {
          loading.dismiss();
          this.getToast(data.message);
        }
      },(err)=>{
        loading.dismiss();
        this.getToast('Unable to load data. Please check your Internet connection.');
      });
  }
  private getToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top' //top,middle,bottom
    });
    toast.present();
  }
}

// view ids
@Component({
  selector: 'page-view-ids',
  templateUrl: 'view-ids.html',
})
export class ViewIdsPage {
  governmentIds: any;
  imageURI: any;
  base64Image : any;
  imageFileName: any;
  _imageViewerCtrl: ImageViewerController;
  imageUrl: any = imageUrlupload;
  constructor(public navCtrl: NavController,
    public navParams: NavParams, 
    private transfer: FileTransfer,
    private camera: Camera,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public imageViewerCtrl: ImageViewerController,
    public platform: Platform,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController) {
    this.governmentIds= JSON.parse(localStorage.getItem('owner')).ownerId.ownergovids;
    this._imageViewerCtrl = imageViewerCtrl;
  }
  getImage() {
    this.presentActionSheet();
  }

 
  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Upload Government IDs',
      buttons: [
        {
          text: 'Camera',
          role: 'destructive',
          icon: 'camera',
          handler: () => {
            this.takePhoto(1);// 1 for camera
          }
        }, {
          text: 'Gallery',
          role: 'gallery',
          icon: 'images',
          handler: () => {
            this.takePhoto(0);// 1 for gallery
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  takePhoto(sourceType: number) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: sourceType,
    }

    this.camera.getPicture(options).then((imageData) => {
      this.imageURI  = imageData;
    }, (err) => {
      console.log(err)
      // Handle error
    });
  }
  
  uploadFile() {
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();

    const fileTransfer: FileTransferObject = this.transfer.create();
    let options: FileUploadOptions = {
      chunkedMode: false,
      fileKey: 'file',
      fileName: 'filename.jpg',
      params: { operatiune: 'uploadpoza' }
    }
    fileTransfer.upload(this.imageURI, 'https://www.caterdaay.com:4024/upload', options)
      .then((data) => {
        this.imageFileName = 'https://www.caterdaay.com:4024/uploads/ionicfile.jpg';
        loader.dismiss();
        this.presentToast("Image uploaded successfully");
      }).catch((err) => {
        loader.dismiss();
      });
  }
  
  viewImage(path){
    var imgUrl = this.imageUrl+'/'+path;
    const imageViewer = this._imageViewerCtrl.create(imgUrl);
    imageViewer.present();

  }
  deleteIds(id){
    let toast = this.toastCtrl.create({
      message: id,
      duration: 30000,
      position: 'top' //top,middle,bottom
    });
    toast.present();
  }
  
  presentToast(msg) { 
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}