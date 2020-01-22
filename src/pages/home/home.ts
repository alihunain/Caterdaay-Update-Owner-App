import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { ThreeService } from '../../services/three.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  owner: any;
  orders: any = { total: [], weekly: [], yesterday: [], today: [], tomarrow: [] };
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private threeService: ThreeService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
    ) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    if (localStorage.getItem('owner')) {
      this.owner = JSON.parse(localStorage.getItem('owner'));
    }
    this.threeService.getOrders(this.owner._id).subscribe((data) => {
      if (!data.error) {
        console.log(data.message);
        this.orders.total = this.getTotalOrders(data.message);
        this.orders.today = this.getTodayOrders(data.message);
        this.orders.yesterday = this.getYesterdayOrders(data.message);
        this.orders.tomarrow = this.getTomarrowOrders(data.message);
        this.orders.weekly = this.getWeeklyOrders(data.message);
        loading.dismiss();
      }else{
        loading.dismiss();
        this.getToast('Something went wrong! Please try again.')
      }
    },(err)=>{
      loading.dismiss();
      this.getToast('Unale to load data. Please check your Internet connection.');
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

  getTotalOrders(data){
    return data.length;
  }

  getTomarrowOrders(data){
    return data.filter((data) => {
      var date1 = new Date(data.ordertiming.create);
      var today = new Date();
      var date2 = new Date(new Date().getFullYear(), today.getMonth(), today.getDate() + 1);
      return date1.toLocaleDateString() == date2.toLocaleDateString();
    }).length;
  }

  getYesterdayOrders(data){
    return data.filter((data) => {
      var date1 = new Date(data.ordertiming.create);
      var today = new Date();
      var date2 = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
      return date1.toLocaleDateString() == date2.toLocaleDateString();
    }).length;
  }
  
  getTodayOrders(data){
    return data.filter((data) => {
      var date1 = new Date(data.ordertiming.create);
      var date2 = new Date();
      return date1.toLocaleDateString() == date2.toLocaleDateString();
    }).length;
  }
  getWeeklyOrders(data) {
    var today = new Date();
    var lastweek = new Date(new Date().getFullYear(), today.getMonth(), today.getDate() - 7);
    var weeklyData = [];
    data.forEach((item) => {
      var date1 = new Date(item.ordertiming.create);
      if (date1.toLocaleDateString() >= lastweek.toLocaleDateString() && date1.toLocaleDateString() <= today.toLocaleDateString()) {
        weeklyData.push(data);
      }
    });
    return weeklyData.length;
  }

}
