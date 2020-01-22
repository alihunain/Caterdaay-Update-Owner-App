import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, ToastController, LoadingController, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { OrderPage,OrderDetailPage } from '../pages/order/order';
import { ProfilePage } from '../pages/profile/profile';
/*import { CustomersPage } from '../pages/customers/customers';*/
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { DriversPage } from '../pages/drivers/drivers';

import { ThreeService } from '../services/three.service';

import { Badge } from '@ionic-native/badge';
/*import { BackgroundMode } from '@ionic-native/background-mode';*/

declare var FCMPlugin : any;
declare var cordova : any;

import { Network } from '@ionic-native/network';
import { OneService } from '../services/one.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp { 
  @ViewChild(Nav) nav: Nav; 

  rootPage: any;
  loading: any;

  currentComponentPage: any;
  noConnection : boolean = false;

  pages: Array<{title: string, component: any}>;
  totalbudgeCount: any;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public alertCtrl: AlertController,
    private threeService: ThreeService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public app: App,
    private badge: Badge,
    /*private backgroundMode: BackgroundMode,*/
    private network: Network,
    public oneService:OneService
    ) {

    this.initializeApp();
  
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Profile', component: ProfilePage },
      { title: 'Orders', component: OrderPage },
      /*{ title: 'Customers', component: CustomersPage },*/
      { title: 'Drivers', component: DriversPage },
      { title: 'Logout', component: 'Logout' }
    ];
  }

  getCurrentPage(){
    setTimeout(()=>{
      let page = this.app.getActiveNavs();
      if (page.length > 0) {
        this.currentComponentPage = page[0].getViews()[0].name;
      }
    },1000)
  }

  noConnectionToast(){
    let toast = this.toastCtrl.create({
      message: 'Lost Internet connection!',
      duration: 3000,
      position:'bottom' //top,middle,bottom
    });
    toast.present();
    this.noConnection = true;
  }


  retry(event){
    this.noConnection = false;
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles'
    });
    this.loading.present();
    if (this.network['type'] == 'none') {
      this.noConnectionToast();
      this.loading.dismiss();
    }else{
      this.onConnectFunction();
    }
  }

  onConnectFunction(){
    setTimeout(()=>{
      this.loading.dismiss();
      this.noConnection = false;
      if (localStorage.getItem('owner')) {
        if (this.currentComponentPage == 'HomePage') {
          this.nav.setRoot(HomePage);
        }else if (this.currentComponentPage == 'ProfilePage') {
          this.nav.setRoot(ProfilePage);
        }else if (this.currentComponentPage == 'OrderPage') {
          this.nav.setRoot(OrderPage);
        }else if (this.currentComponentPage == 'DriversPage') {
          this.nav.setRoot(DriversPage);
        }else{
          this.nav.setRoot(HomePage);
        }

        this.getCurrentPage();

      }else{
        this.nav.setRoot(LoginPage);

        this.getCurrentPage();
      }
    },2000);

  }
//   async registerRequestPermission() {
//     try {
//       let isSupported = await this.badge.isSupported();
//       console.log("isSupported",isSupported);
//       let hasPermission = await this.badge.hasPermission();
//       console.log('app188hasPermission',hasPermission);
//       if (hasPermission) {
//         let permission = await this.badge.requestPermission();
//         console.log(permission);
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   }
//   setBadge(budgeNumber: number) {
    
 
//     this.badge.set(budgeNumber);
//    console.log("set Badge")
   
//  }
//   getBadge() {
//    console.log('get Badge');
//     this.badge.get().then(count => {
//      this.totalbudgeCount = count;
//    });
//  }
//   clearBadge() {
//    console.log('clearBadge');
//     this.badge.clear();
//  }
//   increaseBadge() {
//    console.log('increasing badge by 1');
//     this.badge.increase(1);
//  }
  initializeApp() {
    var _that = this;
    this.platform.ready().then(() => {
    //  this.registerRequestPermission();
      // if (typeof cordova != 'undefined') {
      //   cordova.plugins.notification.badge.hasPermission(function (granted) {
      //     /*alert('has Permission '+JSON.stringify(granted));*/
      //     if (!granted) {
      //       cordova.plugins.notification.badge.requestPermission(function (granted) {
      //           /*alert('req permission');*/
      //       });
      //     }
      //   });
      // }

      /*this.backgroundMode.enable();*/

      // this.statusBar.styleDefault();

      if (this.network['type'] == 'none') {
        this.noConnectionToast();
      }else{
        this.noConnection = false;
      }

      if (localStorage.getItem('owner')) {


        
        // this.splashScreen.hide();
        this.rootPage = HomePage;
        this.getCurrentPage();       
  setTimeout(()=>{
    this.statusBar.overlaysWebView(false);

    if(this.platform.is('android')){
      this.statusBar.styleLightContent();
    }else{
    this.statusBar.styleDefault();
    }console.log("this is cllaed")
    // this.statusBar.backgroundColorByName("white");
    this.statusBar.show();
    console.log(this.statusBar.isVisible,'status bar actived')
    this.splashScreen.hide();
  },2000);
      }else{
      //  this.splashScreen.hide();
        this.rootPage = LoginPage;
        this.getCurrentPage();
        
  setTimeout(()=>{
    this.statusBar.overlaysWebView(false);
    if(this.platform.is('android')){
      this.statusBar.styleLightContent();
    }else{
    this.statusBar.styleDefault();
    }
    // this.statusBar.styleDefault();
    console.log("this is cllaed")
    // this.statusBar.backgroundColorByName("white");
    this.statusBar.show();
    console.log(this.statusBar.isVisible,'status bar actived')
    this.splashScreen.hide();
  },2000);
      }

      if (typeof FCMPlugin != 'undefined') {
        FCMPlugin.onNotification(function(data){
         
          if (typeof cordova != 'undefined') {
            // cordova.plugins.notification.badge.increase(1, function (badge) {
            //   console.log("badge => " ,badge);
            // });
          }
          if(data.wasTapped){
            if (typeof cordova != 'undefined') {
              // cordova.plugins.notification.badge.decrease(1, function (badge) {
              //   console.log("badge => " ,badge);
              // });
            }
     //       _that.increaseBadge();
            _that.getOrder(data.orderId)
          }else{
       //     _that.clearBadge();
            if (typeof cordova != 'undefined') {
          //    cordova.plugins.notification.badge.clear();
            }
            let prompt = _that.alertCtrl.create({
              message: data.message,
              buttons: [
                {
                  text: 'OK',
                  handler: dataa => {
                    _that.getOrder(data.orderId);
                    // if(data.message && data.message.includes("pending")){

                    // }else{
                      

                    // }
                  }
                }
              ]
            });
            prompt.present();
          }
        });

        FCMPlugin.onTokenRefresh(function(token){
          console.log( token );
        });
      }

      let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
        this.noConnectionToast();
      });

      let connectSubscription = this.network.onConnect().subscribe(() => {
        this.noConnection = false;
        this.loading = this.loadingCtrl.create({
          spinner : 'bubbles'
        });
        this.loading.present();

        this.onConnectFunction();
      });


    });
  }
  UpdateToken(){
    let that = this;
    return new Promise((resolve,reject)=>{
      FCMPlugin.getToken(function(token){
        let t = token;
        let id = JSON.parse(localStorage.getItem("owner")).ownerId._id;
        that.oneService.getOwner(id).subscribe((res)=>{
          let token = res.message.fcmToken;
          let newToken = [];
          for(let i = 0; i < token.length;i++){
            if(token[i] != t){
              newToken.push(token[i]);
            }
            if(i+1 == token.length){
              let res = {
                _id:id,
                fcmToken:newToken
              }
              resolve(res);
            }
          }
        })
      })
    })
  }
  openPage(page) {
    if (page.component == 'Logout') {
      let prompt = this.alertCtrl.create({
        title: 'Logout',
        message: "Are you sure ?",
        buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'oK',
          handler: data => {
            this.UpdateToken().then((res)=>{
              this.oneService.editOwner(res).subscribe(()=>{
                localStorage.clear();
                this.nav.setRoot(LoginPage);
    
                this.getCurrentPage();
              })
         
            })
            
          }
        }
        ]
      });
      prompt.present();
    }else{
      this.nav.setRoot(page.component);

      this.getCurrentPage();
    }
  }

  doLogout(){
    let prompt = this.alertCtrl.create({
      title: 'Logout',
      message: "Are you sure ?",
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'oK',
          handler: data => {
            this.UpdateToken().then((res)=>{
              this.oneService.editOwner(res).subscribe(()=>{
                localStorage.removeItem('owner');
                this.nav.setRoot(LoginPage);
              })
         
            })
 
          }
        }
      ]
    });
    prompt.present();
  }

  getOrder(id){
    this.threeService.getOneOrder(id).subscribe((data)=>{
      if (!data.error) {
        this.nav.setRoot(OrderDetailPage, {
          orderData: data.message, noti:'noti'
        });
      }
    })
  }
  

}
