import { Badge } from '@ionic-native/badge';
import { Component  } from '@angular/core';
import { SlicePipe, DatePipe } from '@angular/common';
import { NavController, NavParams, ModalController, LoadingController, ToastController, AlertController  } from 'ionic-angular';
import { FilterPage } from '../filter/filter';
import { CustomersDetailPage } from '../customers/customers';
import { OneService } from '../../services/one.service';
import { ThreeService } from '../../services/three.service';
import { FourService } from '../../services/four.service';
declare var moment : any ;
import * as globalVariable from "../../services/global";


import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
/*import { FirebaseListObservable } from 'angularfire2/database-deprecated';*/
import 'rxjs/add/operator/map';

import firebase from 'firebase';

/*declare var FCMPlugin : any;*/

/*import { AngularFirestore } from 'angularfire2/firestore';*/
import { Observable } from 'rxjs/Observable';
declare var google: any;


@Component({
    selector: 'page-order',
    templateUrl: 'order.html',
})
export class OrderPage {
    type: string = "all";
    owner: any;
    tempOrders:any;
    orders:any;
    todayOrders: any;
    customersOrders: any;

    paymentType: any;
    statusType: any;

    imageURL : string = globalVariable.url1 + 'uploads/';
    ionViewWillEnter    () {
        console.log("HERERRE")
        this.getOrders();
    }
    ionViewDidLoad() {
        this.getOrders();
    }
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public modalCtrl: ModalController,
        private threeService: ThreeService,
        private fourService: FourService,
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController
        ) {


        if (localStorage.getItem('owner')){
            this.owner = JSON.parse(localStorage.getItem('owner'));
        }
        this.getOrders();
    }

    getOrders(){
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();
        this.threeService.getOrders(this.owner._id).subscribe((data) => {
            if (!data.error) {
                this.orders = data.message;
                this.tempOrders = data.message;

                this.todayOrders = data.message.filter((data) => {
                    var date1 = new Date(data.ordertiming.create);
                    var date2 = new Date();
                    return date1.toLocaleDateString() == date2.toLocaleDateString();
                });
                console.log(this.todayOrders);
                var customers = [];
                /*var restaurants = [];*/
                data.message.forEach((data) => {
                    if (customers.indexOf(data.customerid) == -1) {
                        customers.push(data.customerid)
                    }
                    /*if (restaurants.indexOf(data.restaurantid) == -1) {
                        restaurants.push(data.restaurantid)
                    }*/
                });
                var obj = { "ids": customers }
                this.fourService.getCustomersOrders(obj).subscribe((data) => {
                    if (!data.error) {
                        this.customersOrders = data.message;
                        loading.dismiss();
                    }else{
                        this.customersOrders = [];
                        loading.dismiss();
                    }
                },(err)=>{
                    this.customersOrders = [];
                    loading.dismiss();
                });
            }
        },(err)=>{
            let toast = this.toastCtrl.create({
                message: 'Unable to load Orders! Please check your Internet connection.',
                duration: 3000,
                position: 'top' //top,middle,bottom
            });
            toast.present();
            loading.dismiss();
        });
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
    formatDate(obj) {
        if(obj){
        return obj.toString().replace(/\s/g, "T");
        }else{
            return obj;
        }
    }
    doRefresh(refresher) {
        setTimeout(() => {
            this.getOrders();
            
            if (typeof this.paymentType != 'undefined' || typeof this.statusType != 'undefined') {
                let toast = this.toastCtrl.create({
                    message: 'Applied Filter Removed!',
                    duration: 3000,
                    position: 'top' //top,middle,bottom
                });
                toast.present();

                delete this.paymentType;
                delete this.statusType;
            }


            refresher.complete();


        }, 2000);
    }


    openFilter() {
        let modal = this.modalCtrl.create(FilterPage,{
            paymentType : this.paymentType , statusType : this.statusType
        });
        modal.onDidDismiss(data => {
            if (typeof data != 'undefined') {
         
                this.statusType = data['statusType'];
                console.log(this.statusType);
               
                    if (typeof data['statusType'] != 'undefined') {
                        console.log("i am in")
                        this.orders = this.tempOrders.filter((data1)=>{
                            console.log(data1.status +" == " + this.statusType ,"     checker");
                            console.log();
                            return data1.status == this.statusType
                        });
                    }else{
                        this.orders = this.tempOrders;
                    }
              

                this.todayOrders = this.orders.filter((data) => {
                    var date1 = new Date(data.ordertiming.create);
                    var date2 = new Date();
                    return date1.toLocaleDateString() == date2.toLocaleDateString();
                });
            }
        });


        modal.present();
    }

    goToCustomerOrderDetail(id){
        console.log(this.customersOrders[id]);
        this.navCtrl.push(CustomersDetailPage, {
            customerOrderData: this.customersOrders[id]
        });
    }

    openDetail(id) {
        this.navCtrl.push(OrderDetailPage, {
            orderData: this.orders[id]
        });
    }

} 

@Component({
    selector: 'page-order-detail',
    templateUrl: 'order-detail.html',
})
export class OrderDetailPage {
    fromNoti: any;
    orderDetail: any = {};
    loading: any;
    customerData: any;
    total:any;
    driver:any;
    rating:any;
    avgRating:any;
    currentDate:any;

    imageURL : string = globalVariable.imageUrl;

    /*items: Observable<any[]>;*/

    firebaseOrders = [];

    stage : number;

    taxAmmount : any;

    firestore = firebase.database().ref('/orders');
    SubTotal: number = 0 ;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private oneService: OneService,
        private threeService: ThreeService,
        private fourService: FourService,
        public modalCtrl: ModalController,
        public afd: AngularFireDatabase,
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController,
        public alertCtrl: AlertController,
        ) {
        this.orderDetail = navParams.get("orderData");

        let owner = JSON.parse(localStorage.getItem('owner'));
            console.log(this.orderDetail,'262');
            
        if (this.orderDetail['ordertiming']['type'] == 'now') {
            if (typeof owner['mindeliveryime'] != 'undefined' && owner['mindeliveryime'] != null && owner['mindeliveryime'] != '' && parseInt(owner['mindeliveryime']) > 0) {
                console.log('258',this.orderDetail['ordertiming']['datetime'])
                this.orderDetail['ordertiming']['datetime'] = this.addMinTime(owner['mindeliveryime']);
            }
        }

        if (typeof this.orderDetail.driverDetail != 'undefined') {
            this.getDriver();
        }

        this.getTaxAmmount();
        this.SubTotal = this.orderDetail.total  - this.taxAmmount - this.orderDetail.deliveryCharges ; 
        this.getStage(this.orderDetail.status);
        this.getPreviousRating();

        this.fromNoti = navParams.get("noti");
        /*this.customizeOrderDetail();*/

        this.fourService.getCustomers(this.orderDetail['customerid']).subscribe((data) => {
            if(!data.error){
                this.customerData = data.message;
            }
        });

        this.currentDate = this.formatPkgDate();
    }
    getDateForDaily(date){
        if(date){
         let Dailydate =    date.split(" ");
            if(Dailydate.length > 0 ){
              return   Dailydate[0]
            }
        }
    }
    getTimeForDaily(date){
        if(date){
            let Dailydate =    date.split(" ");
               if(Dailydate.length > 2 ){
                  return  Dailydate[1] +' '+Dailydate[2] 
               }else{
                return this.tConvert(Dailydate[1]);
               }
           }
    }
    tConvert (time) {
        // Check correct time format and split into components
        let hour = (time.split(':'))[0]
      let min = (time.split(':'))[1]
      let part = hour > 12 ? 'PM' : 'AM';
      
      min = (min+'').length == 1 ? `0${min}` : min;
      hour = hour > 12 ? hour - 12 : hour;
      hour = (hour+'').length == 1 ? `0${hour}` : hour;
    
      return (`${hour}:${min} ${part}`)
      }
    addMinTime(time){
     
        let date = new Date(this.orderDetail['ordertiming']['datetime']);
        date.setMinutes(date.getMinutes()+parseInt(time));
        let returnDate = this.getFormattedDate(date);
        return returnDate;
    }
    formatDate(obj) {
        if(obj){
            return obj.toString();
            }else{
                return obj;
            }
    }
    getTime(time){
        return moment(time,'hh:mm').format('LT');
      }
      getMyDay(number){
        if(number == ''){
          return ''
        }
        if(number == 1 ){
          return 'Monday'
        }else if (number == 2){
          return 'Tuesday'
        }else if (number == 3  ){
          return 'Wednesday'
        }else if (number == 4){
          return 'Thursday'
        }else if (number == 5){
          return 'Friday'
        }else if (number == 6){
          return 'Saturday'
        }else if (number == 0){
          return 'Sunday'
        }
      }
    getFormattedDate(date) {
        let year = date.getFullYear();

        let month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;

        let day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;

        let hr = date.getHours().toString();
        hr = hr.length > 1 ? hr : '0' + hr;

        let min = date.getMinutes().toString();
        min = min.length > 1 ? min : '0' + min;

        return year + '-' + month + '-' + day + ' ' + hr + ':' + min;
    }


    getTaxAmmount(){
        if (typeof this.orderDetail['discount'] != 'undefined') {
            this.taxAmmount = (this.orderDetail['subtotal'] + this.orderDetail['deliveryCharges'] - this.orderDetail['discount'])*(this.orderDetail['tax']/100);
        }else{
            this.taxAmmount = (this.orderDetail['subtotal'] + this.orderDetail['deliveryCharges']) * (this.orderDetail['tax']/100);
        }
    }

    // getStage(){
    //     let orderStatus = this.orderDetail.status;

    //     if (orderStatus == 'received') {
    //         this.stage = 1
    //     }
    //     if (orderStatus == 'accepted') {
    //         this.stage = 2
    //     }
    //     if (orderStatus == 'completed' || orderStatus == 'driverrejected') {
    //         this.stage = 3
    //     }
    //     if (orderStatus == 'driveraccepted') {
    //         this.stage = 4
    //     }
    //     if (orderStatus == 'delivered') {
    //         this.stage = 5
    //     }
    // }
    presentToast(msg) {
        let toast = this.toastCtrl.create({
          message: msg,
          duration: 3000,
          position: 'top' //top,middle,bottom
        });
        toast.present();
      }
    markAsDelivered(){
        let prompt = this.alertCtrl.create({
            message: 'Confirm Items Delivered?',
            buttons: [
              {
                text: 'Cancel',
                handler: data => {
                }
              },
              {
                text: 'Confirm',
                handler: data => {
                  var obj = {
                    menuStatus:true,
                    status:'delivered',
                    id:this.orderDetail._id
                  }
      
                  /*if (this.orderDetail['package'].length == 0) {
                    obj['status'] = 'delivered';
                  }*/
                  this.threeService.updateCustomersOrdersStatus(obj).subscribe((data) => {
                    if (!data.error) {
                     this.getlatestOrder();
                      this.getStage(this.orderDetail.status);
                      this.changeFirebaseOrderStatus('delivered','pick');
      
                     // this.presentToast('You have Delivered !');
                    }
                  });
                }
              }
            ]
          });
          prompt.present();
    }
    formatPkgDate(){
        let time = new Date();
        var date = time.getDate();
        var month = time.getMonth()+1;
        var year = time.getFullYear();

        return(month+'/'+date+'/'+year);
    }

    getPkgStatus(detail){
        let date = new Date(detail.date.replace(/-/g, "/"));

        let currentDate = new Date();
        let dateDate = currentDate.getMonth()+1 + '/' + currentDate.getDate() + '/' + currentDate.getFullYear();

        if (detail.date == dateDate) {
            if (detail.status) {
                return 0;
            }else{
                return 1;
            }
        }else{
            var dateTime = date.getTime();
            var  currentDateTime = currentDate.getTime();

            let dayDiff : any;

            if (currentDateTime > dateTime) {
                if (detail.status) {
                    return 0;
                }else{
                    return 3;
                }
                /*let timeDiff = currentDateTime - dateTime;
                dayDiff = timeDiff / (1000 * 3600 * 24);
                dayDiff = parseInt(dayDiff);
                console.log("dayDiff current greater => " , dayDiff , date);*/
            }else{
                /*let timeDiff = dateTime - currentDateTime;
                dayDiff = timeDiff / (1000 * 3600 * 24);
                dayDiff = parseInt(dayDiff);
                console.log("dayDiff current smaller => " , dayDiff , date);*/
                return 2;
            }
        }


        /*if (this.dayDif >= 7) {
            this.checkRevise = true;
        }else{
            this.checkRevise = false;
            delete this.reviseFlexi;
        }*/

        /*if (currentDate > date) {
            console.log('past', date);
        }
        if (currentDate = date) {
            console.log('present', date);
        }
        if (currentDate < date) {
            console.log('future', date);
        }
        return 0;
        */
    }
    getStage(orderStatus){
        //   let orderStatus = this.order.status;
   
           if (orderStatus == 'received') {
               this.stage = 1
               return 1 ;
           }
           if (orderStatus == 'accepted') {
               this.stage = 2
               return 2 ;
           }
           if (orderStatus == 'completed' || orderStatus == 'driverrejected') {
               this.stage = 3
               return 3 ;
           }
           if (orderStatus == 'driveraccepted') {
               this.stage = 4
               return 4 ;
           }
           if(orderStatus == 'OnTheWayForFirstWeek'){
             return 5;
           }
           
           if(orderStatus == 'deliveryForFirstWeek'){
             return 6 ;
           }
           if(orderStatus == 'ontheway'){
             return 7 ;
           }
                 if (orderStatus == 'delivered') {
                     this.stage = 8
                     return 8 ;
                 }
       } 
       driverToken(order,resId,status){
        this.oneService.getAllDrivers().subscribe((data)=>{
          let drivers = data.message;
          let driverobj = data.message;
          console.log(drivers);
          console.log(resId);
          let Tokens =[];
          let driversid = [];
          for(let i = 0; i < drivers.length;i++){
            let kitchens = drivers[i].kitchensallow;
            for(let j = 0; j < kitchens.length;j++){
              if(kitchens[j].resId == resId){
                driversid.push(drivers[i]._id);
                let token = drivers[i].fcmToken;
                for(let k = 0; k < token.length;k++){
                  console.log(token[k]);
                  Tokens.push(token[k]);
                }
                
                break;
              }
            }
          }
          this.notificationFunction(order,Tokens,status,driversid,driverobj)
        })
      }
      notificationFunction(order,drivertokens,status,driversid,driverobj){
        return new Promise((resolve,reject)=>{
         this.threeService.GetCustomer(order.customerid).subscribe((res)=>{
            if(status == "accepted"){
                let data = {
                  type:"chef",
                  tokensdriver:drivertokens,
                  status:status,
                  tokencustomer:res.message.fcmToken,
                  orderId:order._id,
                  userid:order.customerid,
                  driverid:driversid
                }
              
            
                this.oneService.Notification(data).subscribe((res)=>{
          
                    let datatwo = {_id:order.customerid,fcmToken:res.message.usertoken}
                    this.oneService.updateCustomer(datatwo).subscribe((ress)=>{
                  for(let i = 0; i < driverobj.length;i++){
                      let data = {_id:driverobj[i]._id,fcmToken:[]}
                      for(let j = 0; j < driverobj[i].fcmToken.length;j++){
                          if(res.message.drivertoken.includes(driverobj[i].fcmToken[j])){
                              data.fcmToken.push(driverobj[i].fcmToken[j]);
                          }
                      }
                      this.oneService.editDriver(data).subscribe(()=>{
                              if(i+1 == driverobj.length){
                                  resolve();
                              }
                      })
                  }
                })
                  console.log(res);
                  resolve();
                })
              }else{
              
                  let data = {
                    type:"chef",
                    status:status,
                    tokens:res.message.fcmToken,
                    orderId:order._id,
                    userid:order.customerid
                  }
             
                  
                  this.oneService.Notification(data).subscribe((res)=>{
                    let datatwo = {_id:order.customerid,fcmToken:res.message.usertoken}
                    this.oneService.updateCustomer(datatwo).subscribe((res)=>{
                    console.log(res);
                    resolve();
                })
                 })
                
              }
         })
         
        
       })
      }
    doAccept(id,param,order){
        // this.loading = this.loadingCtrl.create({
        //     content: 'Please wait...'
        // });
        // this.loading.present();
        
        // for(let i = 0 ; i < this.orderDetail.package.length ; i++){
        //     this.orderDetail.package[i].orderStatus = param;
        //   }
        //   for(let y = 0 ; y < this.orderDetail.items.length ; y++){
        //     this.orderDetail.items[y].orderStatus = param;
        //   }
        var obj = {
            id: id,
            status: 'accepted'
        }
        this.threeService.updateCustomersOrdersStatus(obj).subscribe((data) => {
            if (!data.error) {
                this.threeService.GetCustomer(order.customerid).subscribe((data)=>{
                this.driverToken(order,order.restaurantid,"accepted")
                let obj2 = {
                    customeremail: data.message.email,
                    order:order
                }
                this.threeService.OrderEmail(obj2).subscribe((data)=>{

               
                console.log("CHANGE FIRE BASE ORDER")
                // this.changeFirebaseOrderStatus('accepted','any');
                this.getOrder();
                this.getToast('You accepted order');
       
                // if(this.orderDetail.ordertype == 'home'){
                //     this.sendRequest('completed')
                // }else{
                //    this.sendRequestToCustomer('completed')
                // }
                
            })
            })
            }else{
              //  this.loading.dismiss();
                this.getToast('Unable to accept. Please try again');
            }
        },(err)=>{
            this.loading.dismiss();
            this.getToast('Unable to Update. Please check your Intenet connection');
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

    doReject(id,status,order) {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.loading.present();

        var obj = {
            id: id,
            status: 'rejected'
        }
        this.threeService.updateCustomersOrdersStatus(obj).subscribe((data) => {
            if (!data.error) {
                this.fourService.getCustomers(order.customerid).subscribe((res)=>{
                    var obj1 = {customeremail: res.message.email, order: order};
                    this.oneService.orderCancelMail(obj1).subscribe(() =>{});
                })
               
                this.driverToken(order,order.restaurantid,"rejected");
                this.changeFirebaseOrderStatus('rejected','any');
                // if (typeof this.fromNoti == 'undefined' || this.fromNoti != 'noti') {
                //     this.navCtrl.pop();
                // }
                this.getOrder();
                this.getToast('You rejected order')
            }else{
                this.loading.dismiss();
                this.getToast('Unable to accept. Please try again');
            }
        },(err)=>{
            this.loading.dismiss();
            this.getToast('Unable to Update. Please check your Intenet connection');
        });
    }

    changeFirebaseOrderStatus(type,ordertype){
        console.log("CHange FIRE BASE ORDER STATUS 633");
        let itemRef = this.afd.object('orders');
        var count = 0;

        itemRef.snapshotChanges().subscribe(action => {

            let arr = action.payload.val();

            let pushArr = [];

            for (var k in arr){
                if (arr.hasOwnProperty(k)) {
                    pushArr.push({'key':k,'orderDetail':arr[k]})
                }
            }
            this.firebaseOrders = pushArr;
        });

        setTimeout(()=>{
            console.log(this.firebaseOrders , this.firebaseOrders.length > 0,'652');
            if (this.firebaseOrders && this.firebaseOrders.length > 0) {
                let indx = this.firebaseOrders.findIndex((mn)=> mn.orderDetail['orderID'] == this.orderDetail['_id'])
                console.log(indx,'indx 654');
                if (indx > -1) {
                    if (typeof this.firebaseOrders[indx]['orderDetail'].count == 'undefined' || this.firebaseOrders[indx]['orderDetail'].count == null) {
                        count = 0
                    }else{
                        count = this.firebaseOrders[indx]['orderDetail'].count + 1;
                    }
                    if(ordertype == 'pick'){
                    this.updateFirebaseOrderStatus(this.firebaseOrders[indx]['key'],type, count,'pick');
                    }else if (ordertype == 'home'){
                    this.updateFirebaseOrderStatus(this.firebaseOrders[indx]['key'],type, count,'home');
                    }else{
                    this.updateFirebaseOrderStatus(this.firebaseOrders[indx]['key'],type, count,'any');
                    }
                }
            }
        },5000)
    }
    // updateFirebaseOrderStatus(key, type,ordertype){
    //     let obj = { orderStatus: type}
    //     if (type == 'driveraccepted'){
    //         obj['type'] = 'item';
    //         obj['ordertype'] = 'pick';
    //     }
    //    else if (type == 'delivered') {
    //         obj['type'] = 'item';
    //       //  obj['rating'] = this.avgRating;
    //         obj['ordertype'] = 'pick';
    //     }else{
    //         obj['type'] = 'item';
    //     }
    //     console.log('afd','500');
    //     this.afd.list(this.firestore).update(key, obj).then(() => {
    //         console.log('Order Updated');
    //     });
    // }
    updateFirebaseOrderStatus(key, type, count,ordertype){
        console.log("updateFireBaseOrderStatus 691");
        if(type == 'delivered'){
            let obj = { orderStatus: type,orderID:this.orderDetail._id}
            obj['type'] = 'item';
            //  obj['rating'] = this.avgRating;
            obj['ordertype'] = 'pick';
            this.afd.list(this.firestore).update(key, obj).then(() => {
                console.log('Order Updated');
            }).catch(err =>{
                console.log(err,'ERROR afd');
            });;
        }else{

        this.afd.list(this.firestore).update(key, { orderStatus: type, count : count, type: 'item',ordertype:ordertype,orderID:this.orderDetail._id }).then(() => {
            console.log('Order Updated');
        }).catch(err =>{
            console.log(err,'ERROR afd');
        });
    }
    }
    getlatestOrder(){
        this.threeService.getOneOrder(this.orderDetail._id).subscribe((data)=>{
        //    this.loading.dismiss();
            if (!data.error) {
                this.orderDetail = data.message;
                this.getStage(this.orderDetail.status);
                if (typeof this.orderDetail.driverDetail != 'undefined') {
                    this.getDriver();
                }
                this.getPreviousRating();
                /*this.customizeOrderDetail();*/
            }
        },(err)=>{
            this.getToast('Unable to load updates. Please check your Intenet connection');
        });
    }
    getOrder(){
        this.threeService.getOneOrder(this.orderDetail._id).subscribe((data)=>{
            if(this.loading){
            this.loading.dismiss();
            }
            if (!data.error) {
                this.orderDetail = data.message;
                this.getStage(this.orderDetail.status);
                if (typeof this.orderDetail.driverDetail != 'undefined') {
                    this.getDriver();
                }
                this.getPreviousRating();
                /*this.customizeOrderDetail();*/
            }
        },(err)=>{
            this.getToast('Unable to load updates. Please check your Intenet connection');
        });
    }

    getPreviousRating(){
        var obj = {"orderId": this.orderDetail._id,"customerId" : this.orderDetail['customerid']};
        this.threeService.checkRestroRating(obj).subscribe((presetRating) => {
            if (!presetRating.error) {
                if(presetRating.message.length > 0){
                    this.rating = presetRating.message[0];
                    this.avgRating = this.rating['average'];
                }
            }
        });
    }

    sendRequest(param){
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.loading.present();

        this.threeService.getOneOrder(this.orderDetail._id).subscribe((data)=>{
            if (!data.error) {
                if(data.message.status != 'driveraccepted'){
                    for(let i = 0 ; i < this.orderDetail.package.length ; i++){
                        this.orderDetail.package[i].orderStatus = param;
                      }
                      for(let y = 0 ; y < this.orderDetail.items.length ; y++){
                        this.orderDetail.items[y].orderStatus = param;
                      }
                    var obj = {
                        id: this.orderDetail['_id'],
                        status: 'completed',
                        package:this.orderDetail.package,
                        items:this.orderDetail.items
                    }


                    
                    this.threeService.updateCustomersOrdersStatus(obj).subscribe((data2) => {
                        if (!data2.error) {
                            this.getToast('Request sent successfully.');
                            this.changeFirebaseOrderStatus('completed','home');
                            this.getOrder();
                        }else{
                            this.loading.dismiss();
                            this.getToast('Unable to send request! Please try again');
                        }
                    },(err)=>{
                        this.loading.dismiss();
                        this.getToast('Unable to send request! Please check your Internet connection');
                    });
                }else{
                    this.loading.dismiss();
                    this.getToast('Order is already accepted by the driver')
                    this.orderDetail = data.message;
                    this.getStage(this.orderDetail.status);
                    if (typeof this.orderDetail.driverDetail != 'undefined') {
                        this.getDriver();
                    }
                    this.getPreviousRating();
                }
            }else{
                this.loading.dismiss();
                this.getToast('Unable to send request! Please try again');
            }
        },(err)=>{
            this.loading.dismiss();
            this.getToast('Unable to send request! Please check your Internet connection');
        })
    }
    sendRequestToCustomer(param){
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.loading.present();
        console.log('here',this.orderDetail);
        this.threeService.getOneOrder(this.orderDetail._id).subscribe((data)=>{
            if (!data.error) {
                if(data.message.status != 'driveraccepted'){
                    for(let i = 0 ; i < this.orderDetail.package.length ; i++){
                        this.orderDetail.package[i].orderStatus = param;
                      }
                      for(let y = 0 ; y < this.orderDetail.items.length ; y++){
                        this.orderDetail.items[y].orderStatus = param;
                      }
                    var obj = {
                        id: this.orderDetail['_id'],
                        status: 'completed',
                        package:this.orderDetail.package,
                        items : this.orderDetail.items
                    }
                    console.log(obj)
                    this.threeService.updateCustomersOrdersStatus(obj).subscribe((data2) => {
                        if (!data2.error) {
                            this.getToast('Request sent successfully.');
                            this.changeFirebaseOrderStatus('completed','pick');
                            this.getOrder();
                        }else{
                            this.loading.dismiss();
                            this.getToast('Unable to send request! Please try again');
                        }
                    },(err)=>{
                        this.loading.dismiss();
                        this.getToast('Unable to send request! Please check your Internet connection');
                    });
                }else{
                    this.loading.dismiss();
                    this.getToast('Customer is on the way')
                    this.orderDetail = data.message;
                    this.getStage(this.orderDetail.status);
                    if (typeof this.orderDetail.driverDetail != 'undefined') {
                        this.getDriver();
                    }
                    this.getPreviousRating();
                }
            }else{
                this.loading.dismiss();
                this.getToast('Unable to send request! Please try again');
            }
        },(err)=>{
            this.loading.dismiss();
            this.getToast('Unable to send request! Please check your Internet connection');
        })
    }
    itemImage(img){
        let imgPath : any;
        if ( typeof img == 'undefined'  || img == null) {
            imgPath = "assets/imgs/res2.jpg";
        }else{
            imgPath = this.imageURL + img;
        }
        return imgPath;
    }

    startTracking(){
        let div = document.getElementById('map');
        if (div.style.height == '300px') {
            div.style.height = '0';
        }else{
            div.style.height = '300px';
        }
    }

    getDriver(){
        let id = this.orderDetail.driverDetail['_id'];
        this.oneService.getDriver(id).subscribe((data)=>{
            if (!data.error && data.message != null && data.message != '') {
                this.driver = data.message;
                setTimeout(()=>{
                    this.loadMap();
                },500)
            }
        },(err)=>{
            this.getToast('Unable to load driver detail! Please check your Internet connection');
        });
    }



    loadMap() {
        let mapOptions= {
            center: new google.maps.LatLng(this.orderDetail['fulladdress'].lat, this.orderDetail['fulladdress'].lng),
            zoom: 5,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        let map = new google.maps.Map(document.getElementById("map"), mapOptions);

        let latLng = new google.maps.LatLng(this.orderDetail['fulladdress'].lat, this.orderDetail['fulladdress'].lng);
        let marker = new google.maps.Marker({
            position: latLng,
            title: 'demo',
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            map: map,
            draggable: false,
        });

        if (typeof this.driver.lat != 'undefined' && typeof this.driver.lng != 'undefined') {        
            var infowindow = new google.maps.InfoWindow();
            let latLng = new google.maps.LatLng(this.driver.lat, this.driver.lng);
            let marker = new google.maps.Marker({
                position: latLng,
                map: map,
                draggable: false,
            });
            infowindow = new google.maps.InfoWindow({
              content: this.driver.firstname
            });
            infowindow.open(map, marker);
        }
        this.showRoute(map);
    }

    showRoute(map) {
        let directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
        let directionsService = new google.maps.DirectionsService;
        directionsDisplay.setMap(map);
        let origin = { location: new google.maps.LatLng(this.orderDetail['fulladdress'].lat, this.orderDetail['fulladdress'].lng), stopover: true };
        directionsService.route({
            origin: origin['location'],
            destination: new google.maps.LatLng(this.driver.lat, this.driver.lng),
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Unable to display Route on Map! Location Not Reachable.');
            }
        });
    }
}

