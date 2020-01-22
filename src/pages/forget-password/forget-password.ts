import { Component  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  ToastController, NavController, NavParams, LoadingController } from 'ionic-angular';
import { OneService } from '../../services/one.service';


@Component({
  selector: 'page-forget-password',
  templateUrl: 'forget-password.html',
})
export class ForgetPasswordPage {
  forgetForm: FormGroup;
  formErrors = {
    'email': ''
  };
  validationMessages = {
    'email': {
      'required': 'Email is required.',
      'pattern': 'Invalid Email.'
    }
  };
  emailp: any = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private lf: FormBuilder,
    private oneService: OneService,
    public loadingCtrl: LoadingController) {
    this.forgetForm = this.lf.group({
      email: ['', [Validators.required, Validators.pattern(this.emailp)]],
    });
    this.forgetForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); 
  }
  onValueChanged(data?: any) {
    if (!this.forgetForm) { return; }
    const form = this.forgetForm;
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

  resetPassword() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.oneService.forgetPasswordOwner(this.forgetForm.value).subscribe((data) => {
        loading.dismiss();
        if (!data.error) {
          this.getToast('Reset code sent successfully. Check email address.');
          this.navCtrl.pop();
        } else {
          this.getToast(data.message);
          this.forgetForm.reset();
        }
      },(err) => {
        loading.dismiss();
        this.getToast('Unable to proceed request. Please check your Internet connection.');
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

}
