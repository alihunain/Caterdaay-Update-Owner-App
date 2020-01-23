import { Component } from '@angular/core';
import {  NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { ForgetPasswordPage } from '../forget-password/forget-password';
import { HomePage } from '../home/home';
/*import { SignupPage } from '../signup/signup';*/
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OneService } from './../../services/one.service';



import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
/*import { FirebaseListObservable } from 'angularfire2/database-deprecated';*/
import 'rxjs/add/operator/map';

import firebase from 'firebase';

declare var FCMPlugin : any;

/*import { AngularFirestore } from 'angularfire2/firestore';*/
import { Observable } from 'rxjs/Observable';




@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  emailp: any = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
  passwordp: any;
  formErrors = {
    'username': '',
    'password': ''
  };
  validationMessages = {
    'username': {
      'required': 'Email is required.',
      'pattern': 'Invalid Email ID'
    },
    'password': {
      'required': 'Password is required.'      
    }
  };

  firestore = firebase.database().ref('/restaurants');

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private oneService: OneService,
    public loadingCtrl: LoadingController,
    private lf: FormBuilder,
    public afd: AngularFireDatabase,
    public toastCtrl: ToastController
  ) {
    this.loginForm = this.lf.group({
      username: ['', [Validators.required,Validators.pattern(this.emailp)]],
      password: ['', Validators.required]
    });
    this.loginForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); 
  }
  onValueChanged(data?: any) {
    if (!this.loginForm) { return; }
    const form = this.loginForm;
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
  afterOwnerGet(userObj){
    
    console.log(userObj,"check it ");
    let that = this;
    FCMPlugin.getToken(function(token){
      
      console.log(token);
      that.AddTokenToDB(token,userObj);

     console.log( token );
    });
  }
  AddTokenToDB(token,that){
    let data = {_id:"none",fcmToken:[] };
    let temp =  that;
    console.log(temp,"temp inside function");
    data._id = temp.ownerId._id;
    let tokens = temp.ownerId.fcmToken;
    if(tokens == undefined){
      tokens = new Array();
    }
    if(tokens.includes(token)){
      return;
    }
 
    tokens.push(token);
    data.fcmToken = tokens;
    console.log(data);
    this.oneService.editOwner(data).subscribe((res)=>{
      console.log(res);
   
    })

  }
  goToFogetPage(){
    this.navCtrl.push(ForgetPasswordPage);
  }

  doLogin(){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.oneService.login(this.loginForm.value).subscribe((data) => {
        loading.dismiss();

        if (data.status) {
          this.storeRestaurantToken(data.data); 
          this.afterOwnerGet(data.data);
          localStorage.setItem('owner', JSON.stringify(data.data));
          this.navCtrl.setRoot(HomePage);
        } else {
          this.getToast('Bad Credential');
          /*this.loginForm.reset();*/
        }
      },
      (err) => {
        console.log(err);
        loading.dismiss();
        this.getToast('Unable to Login. Please check your Internet connection.');
      } 
    );
  }
  private getToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top' //top,middle,bottom
    });
    toast.present();
  }


  storeRestaurantToken(data){
    let itemRef = this.afd.object('restaurants');

    let pushtokens = [];

    itemRef.snapshotChanges().subscribe(action => {

      let arr = action.payload.val();

      let pushArr = [];

      for (var k in arr){
        if (arr.hasOwnProperty(k)) {
          pushArr.push({'key':k,'resId':arr[k].restaurantId})
        }
      }
      pushtokens = pushArr;
    });

    setTimeout(()=>{
      this.tokensetup().then((token) => {

        if (pushtokens && pushtokens.length > 0) {
          let indx = pushtokens.findIndex((mn)=> mn.resId == data._id)
          if (indx > -1) {
            this.updateToken(pushtokens[indx]['key'],token);
          }else{
            this.addToken(token,data._id)
          }
        }else{
          this.addToken(token,data._id)
        }
      })
    },5000)
  }

  tokensetup() {
    var promise = new Promise((resolve, reject) => {
      FCMPlugin.getToken(function(token){
        resolve(token);
      }, (err) => {
        reject(err);
      });
    })
    return promise;
  }

  addToken(t,id){
    this.afd.list(this.firestore).push({
      restaurantId: id,
      devtoken: t
    }).then(() => {
      console.log('Token stored');
    })
  }

  updateToken(key,t){
    this.afd.list(this.firestore).update(key, { devtoken: t }).then(() => {
      console.log('Token Updated');
    });
  }
}
