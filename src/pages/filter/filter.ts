import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
})
export class FilterPage {
  paymentType : any;
  statusType : any;
  filterObj : any = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
    ) {
    this.paymentType = navParams.get('paymentType');
    this.statusType = navParams.get('statusType');
  }

  choose(type){
    console.log(type);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  doFilter(type){
    if (type == 'reset') {
      delete this.paymentType;
      delete this.statusType;
      /*this.filterObj = {};*/
    }else{

      // if (typeof this.paymentType != 'undefined') {
      //   this.filterObj['paymentType'] = this.paymentType;
      // }

      if (typeof this.statusType != 'undefined') {
        this.filterObj['statusType'] = this.statusType;
      }

      this.viewCtrl.dismiss(this.filterObj);
    }
  }
}
