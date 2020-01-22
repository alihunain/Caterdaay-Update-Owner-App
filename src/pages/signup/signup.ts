import { Component } from '@angular/core';
import {  NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OneService } from './../../services/one.service';
import { TwoService } from './../../services/two.service';
import { LoginPage } from '../login/login';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  matchPassword : any;
  signupForm: FormGroup;
  emailp: any = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
  passwordp: any;
  formErrors = {
    /*'username': '',*/
    'email': '',
    'password': '',  
    'cpassword': '',  
  };

  validationMessages = {
    'email': {
      'required': 'Email is required.',
      'pattern': 'Please Enter a valid Email ID'
    },
    'password': {
      'required': 'Password is required.',
      'pattern': 'Password must contain 8-25 characters, 1 Uppercase, 1 Lowercase, 1 Number, and 1 Special Charecter'
    }, 
    'cpassword': {
      'required': 'Confirm password is required.',
    } 
  };
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, 
    private oneService: OneService,
    private twoService: TwoService,
    public loadingCtrl: LoadingController,
    private lf: FormBuilder,
    public toastCtrl: ToastController
  ) {
      this.twoService.getComplexity().subscribe(data=>{
      if(!data.error){
        this.passwordp = data.message[0].ownerpasscomplexity.regex;
        this.setpasswordmessage(data.message[0].ownerpasscomplexity.name);
        this.signupForm = this.lf.group({
          username: [''],
          email: ['', [Validators.required, Validators.pattern(this.emailp)]],
          password: ['', [Validators.required, Validators.pattern(this.passwordp)]],
          cpassword: ['', [Validators.required]],
        });
        this.signupForm.valueChanges.subscribe(data => this.onValueChanged(data));
        this.onValueChanged(); 
      
      }
    },(err)=>{
      this.getToast('Unable to load data. Please check your Internet connection');
    });
    
  }
  setpasswordmessage(name) {
    if (name == 'simplepassword') {
      this.validationMessages.password.pattern = 'Password must contain min 8 Digits alphanumeric only';
    }

    if (name == 'medium') {
      this.validationMessages.password.pattern = 'TBD';
    }

    if (name == 'complex') {
      this.validationMessages.password.pattern = 'TBD';
    }

    if (name == 'none') {
      this.validationMessages.password.pattern = '';
    }
  }

  onValueChanged(data?: any) {
    if (!this.signupForm) { return; }
    const form = this.signupForm;
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

  goToLoginPage(){
    this.navCtrl.pop();
  }
  doSignup(){
    this.signupForm.controls['username'].setValue(this.signupForm.controls['email'].value);

    if (this.signupForm.value.password != this.signupForm.value.cpassword){
      this.matchPassword = true;
    }else{
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();
      this.oneService.signup(this.signupForm.value).subscribe((data) => {
        loading.dismiss();
        if (!data.error) {
          this.getToast('Signup successfully. check your email to comfirm email address !');
          this.navCtrl.setRoot(LoginPage);
        } else {
          this.getToast('Bad Credential');
          this.signupForm.reset();
        }
      },(err) => {
        loading.dismiss();
        this.getToast('Unable to register! Please check your Internet connection.');
      });
    }
  }

  private getToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'top' //top,middle,bottom
    });
    toast.present();
  }
}
