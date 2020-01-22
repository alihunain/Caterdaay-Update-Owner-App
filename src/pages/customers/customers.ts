import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { ThreeService } from '../../services/three.service';
import { FourService } from '../../services/four.service';

import { OrderDetailPage } from '../order/order';

import * as globalVariable from "../../services/global";

@Component({
  selector: 'page-customers-detail',
  templateUrl: 'customers-detail.html',
})
export class CustomersDetailPage {
  customerDetail: any;
  customerOrders: any;

  imageURL : string = globalVariable.url1 + 'uploads/';


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private threeService: ThreeService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
    ) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    if (navParams.get("customerOrderData")){
      this.customerDetail = navParams.get("customerOrderData");
    }
    this.threeService.getCustomersOrdersList(this.customerDetail._id).subscribe((data) => {
      console.log(data.message);
      if(!data.error){
        this.customerOrders = data.message;
        loading.dismiss();
      }else{
        this.customerOrders = [];
        loading.dismiss();
      }
    },(err)=>{
      this.customerOrders = [];
      loading.dismiss();
      this.getToast('Unable to load data. Please check your Internet connection');
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

  openOrderDetail(id){
    this.navCtrl.push(OrderDetailPage, {
      orderData: this.customerOrders[id]
    });
    /*this.navCtrl.push(CustomersOrderDetailPage,{
      CustomersOrderDetail: this.customerOrders[id],
      CustomersDetail: this.customerDetail
    }); */
  }

  customerImage(img){
    let imgPath : any;
    if (typeof img == 'undefined' || img == null) {
      imgPath = "assets/imgs/profile.png";
    }else{
      imgPath = this.imageURL + img;
    }
    return imgPath;
  }
}