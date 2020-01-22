webpackJsonp([0],{

/***/ 147:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return OrderPage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrderDetailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__filter_filter__ = __webpack_require__(271);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__customers_customers__ = __webpack_require__(272);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_one_service__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_three_service__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_four_service__ = __webpack_require__(273);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_global__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_angularfire2_database__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rxjs_add_operator_map__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_firebase__ = __webpack_require__(165);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_firebase__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









/*import { FirebaseListObservable } from 'angularfire2/database-deprecated';*/


var OrderPage = /** @class */ (function () {
    function OrderPage(navCtrl, navParams, modalCtrl, threeService, fourService, loadingCtrl, toastCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this.threeService = threeService;
        this.fourService = fourService;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.type = "all";
        this.imageURL = __WEBPACK_IMPORTED_MODULE_7__services_global__["c" /* url1 */] + 'uploads/';
        if (localStorage.getItem('owner')) {
            this.owner = JSON.parse(localStorage.getItem('owner'));
        }
        this.getOrders();
    }
    OrderPage.prototype.ionViewWillEnter = function () {
        console.log("HERERRE");
        this.getOrders();
    };
    OrderPage.prototype.ionViewDidLoad = function () {
        this.getOrders();
    };
    OrderPage.prototype.getOrders = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();
        this.threeService.getOrders(this.owner._id).subscribe(function (data) {
            if (!data.error) {
                _this.orders = data.message;
                _this.tempOrders = data.message;
                _this.todayOrders = data.message.filter(function (data) {
                    var date1 = new Date(data.ordertiming.create);
                    var date2 = new Date();
                    return date1.toLocaleDateString() == date2.toLocaleDateString();
                });
                console.log(_this.todayOrders);
                var customers = [];
                /*var restaurants = [];*/
                data.message.forEach(function (data) {
                    if (customers.indexOf(data.customerid) == -1) {
                        customers.push(data.customerid);
                    }
                    /*if (restaurants.indexOf(data.restaurantid) == -1) {
                        restaurants.push(data.restaurantid)
                    }*/
                });
                var obj = { "ids": customers };
                _this.fourService.getCustomersOrders(obj).subscribe(function (data) {
                    if (!data.error) {
                        _this.customersOrders = data.message;
                        loading.dismiss();
                    }
                    else {
                        _this.customersOrders = [];
                        loading.dismiss();
                    }
                }, function (err) {
                    _this.customersOrders = [];
                    loading.dismiss();
                });
            }
        }, function (err) {
            var toast = _this.toastCtrl.create({
                message: 'Unable to load Orders! Please check your Internet connection.',
                duration: 3000,
                position: 'top' //top,middle,bottom
            });
            toast.present();
            loading.dismiss();
        });
    };
    OrderPage.prototype.customerImage = function (img) {
        var imgPath;
        if (typeof img == 'undefined' || img == null) {
            imgPath = "assets/imgs/profile.png";
        }
        else {
            imgPath = this.imageURL + img;
        }
        return imgPath;
    };
    OrderPage.prototype.formatDate = function (obj) {
        if (obj) {
            return obj.toString().replace(/\s/g, "T");
        }
        else {
            return obj;
        }
    };
    OrderPage.prototype.doRefresh = function (refresher) {
        var _this = this;
        setTimeout(function () {
            _this.getOrders();
            if (typeof _this.paymentType != 'undefined' || typeof _this.statusType != 'undefined') {
                var toast = _this.toastCtrl.create({
                    message: 'Applied Filter Removed!',
                    duration: 3000,
                    position: 'top' //top,middle,bottom
                });
                toast.present();
                delete _this.paymentType;
                delete _this.statusType;
            }
            refresher.complete();
        }, 2000);
    };
    OrderPage.prototype.openFilter = function () {
        var _this = this;
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_2__filter_filter__["a" /* FilterPage */], {
            paymentType: this.paymentType, statusType: this.statusType
        });
        modal.onDidDismiss(function (data) {
            if (typeof data != 'undefined') {
                _this.statusType = data['statusType'];
                console.log(_this.statusType);
                if (typeof data['statusType'] != 'undefined') {
                    console.log("i am in");
                    _this.orders = _this.tempOrders.filter(function (data1) {
                        console.log(data1.status + " == " + _this.statusType, "     checker");
                        console.log();
                        return data1.status == _this.statusType;
                    });
                }
                else {
                    _this.orders = _this.tempOrders;
                }
                _this.todayOrders = _this.orders.filter(function (data) {
                    var date1 = new Date(data.ordertiming.create);
                    var date2 = new Date();
                    return date1.toLocaleDateString() == date2.toLocaleDateString();
                });
            }
        });
        modal.present();
    };
    OrderPage.prototype.goToCustomerOrderDetail = function (id) {
        console.log(this.customersOrders[id]);
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__customers_customers__["a" /* CustomersDetailPage */], {
            customerOrderData: this.customersOrders[id]
        });
    };
    OrderPage.prototype.openDetail = function (id) {
        this.navCtrl.push(OrderDetailPage, {
            orderData: this.orders[id]
        });
    };
    OrderPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-order',template:/*ion-inline-start:"D:\Apps\Owner App\src\pages\order\order.html"*/'<!--\n  Generated template for the OrderPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar color="secondary">\n    <button ion-button menuToggle start>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Orders</ion-title>\n    <ion-buttons end>\n      <button ion-button icon-only style="font-size: 1rem;" (click)="openFilter()">\n        <ion-icon name="funnel"></ion-icon>\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n  <ion-toolbar no-border-top color="secondary">\n  \n    <ion-segment [(ngModel)]="type" color="light">\n      <ion-segment-button value="all">\n        All orders\n      </ion-segment-button>\n      <ion-segment-button value="today">\n        Today\'s orders\n      </ion-segment-button>\n      <ion-segment-button value="customer">\n        Customer\n      </ion-segment-button>\n    </ion-segment>\n  </ion-toolbar>\n</ion-header>\n\n\n<ion-content no-padding>\n\n  <ion-refresher (ionRefresh)="doRefresh($event)">\n    <ion-refresher-content></ion-refresher-content>\n  </ion-refresher>\n\n\n  <div [ngSwitch]="type">\n    <ion-list *ngSwitchCase="\'all\'">\n\n      <ion-item  *ngFor="let order of orders; index as i" (click)="openDetail(i)">\n        <h2><ion-icon name="pizza"></ion-icon> &nbsp; #{{order._id.substr(18,6)}}</h2>\n\n        <ion-row class="whiteSpaceInitial">Total Amount : &nbsp; <strong><span *ngIf = "order.currency">{{order.currency}} </span>{{order.total | number : \'1.2-2\'}}</strong> </ion-row>\n<!-- \n        <ion-row *ngIf="order.status == \'received\' && order.paymenttype == \'cash\' "><strong text-capitalize> Order Placed </strong></ion-row> -->\n\n        <ion-row *ngIf="order.status == \'received\' "><strong text-capitalize> Payment Received </strong></ion-row>\n        <ion-row *ngIf="order.status == \'accepted\'"><strong text-capitalize>Preparing Order</strong></ion-row>\n        <ion-row *ngIf="order.status == \'rejected\'"><strong text-capitalize>Order Rejected</strong></ion-row>\n        <ion-row *ngIf="order.status == \'ontheway\'"><strong text-capitalize>On the way</strong></ion-row>\n        <ion-row *ngIf="order.status == \'delivered\'"><strong text-capitalize>Delivered</strong></ion-row>\n        <ion-row *ngIf="order.status == \'driveraccepted\'"><strong  text-capitalize>Driver Accepted</strong></ion-row>\n        <!-- <ion-row *ngIf="order.status == \'rejected\'"><strong text-capitalize>Order Rejected</strong></ion-row> -->\n\n        <!-- <ion-row *ngIf="order.status == \'completed\' || order.status == \'driverrejected\'">\n          <ion-col *ngIf="order.ordertype == \'home\'" col-12><strong text-capitalize>Order Prepared </strong> (Waiting for Driver!)</ion-col> -->\n          <!-- <ion-col col-12 style = "padding: 0 16px 5px;"></ion-col> -->\n          <!-- <ion-col *ngIf="order.ordertype == \'pick\'" col-12><strong text-capitalize>Order Prepared </strong> (Waiting to customer!)</ion-col> -->\n            <!-- <ion-col col-12 style = "padding: 0 16px 5px;"></ion-col> -->\n        <!-- </ion-row> -->\n\n     \n\n        <!-- <ion-row *ngIf="order.status == \'delivered\'"><strong text-capitalize>Delivered</strong></ion-row>\n\n        <ion-row *ngIf="order.status == \'cancelled\'"><strong text-capitalize>Order Cancelled</strong></ion-row> -->\n        <ion-row>\n          <ion-icon name="time"></ion-icon> &nbsp; {{order.ordertiming.create| date:\'medium\'}}\n        </ion-row>\n        \n        <!-- <button ion-button clear item-end color="secondary">View</button> -->\n\n      </ion-item>\n      <ion-item *ngIf="orders  && orders.length  == 0">\n        No Record Found\n      </ion-item>\n    </ion-list>\n    \n    <ion-list *ngSwitchCase="\'today\'">\n      <ion-item *ngFor="let todayOrder of todayOrders; index as i" (click)="openDetail(i)">\n        <h2><ion-icon name="pizza"></ion-icon> &nbsp; #{{todayOrder._id.substr(18,6)}}</h2>\n\n        <ion-row class="whiteSpaceInitial">Total Amount : &nbsp; <strong><span *ngIf = "todayOrder.currency">{{todayOrder.currency}} </span>{{todayOrder.total | number : \'1.2-2\'}}</strong> </ion-row>\n<!-- \n        <ion-row *ngIf="todayOrder.status == \'received\' && todayOrder.paymenttype == \'cash\' "><strong text-capitalize> Order Placed </strong></ion-row> -->\n        <ion-row *ngIf="todayOrder.status == \'received\'  "><strong text-capitalize> Payment Received </strong></ion-row>\n        <ion-row *ngIf="todayOrder.status == \'accepted\'"><strong text-capitalize>Preparing Order</strong></ion-row>\n        <ion-row *ngIf="todayOrder.status == \'rejected\'"><strong text-capitalize>Order Rejected</strong></ion-row>\n        <ion-row *ngIf="todayOrder.status == \'driveraccepted\'"><strong  text-capitalize>Driver Accepted</strong></ion-row>\n<ion-row *ngIf="todayOrder.status == \'ontheway\'"><strong  text-capitalize>On the way</strong></ion-row>\n        <ion-row *ngIf="todayOrder.status == \'delivered\'"><strong text-capitalize>Delivered</strong></ion-row>\n      \n\n\n\n        <!-- <ion-row *ngIf="todayOrder.status == \'completed\' || todayOrder.status == \'driverrejected\'">\n          <ion-col *ngIf="todayOrder.ordertype == \'home\'" col-12><strong text-capitalize>Order Prepared </strong> (Waiting for Driver!)</ion-col> -->\n          <!-- <ion-col col-12 style = "padding: 0 16px 5px;"></ion-col> -->\n          <!-- <ion-col *ngIf="todayOrder.ordertype == \'pick\'" col-12><strong text-capitalize>Order Prepared </strong> (Waiting for customer !)</ion-col>\n        </ion-row> -->\n        \n\n        <ion-row *ngIf="todayOrder.status == \'driveraccepted\'"><strong *ngIf="todayOrder.ordertype == \'home\'" text-capitalize>Driver is On the Way</strong><strong *ngIf="todayOrder.ordertype == \'pick\'" text-capitalize>Customer is On the Way</strong></ion-row>\n\n        <ion-row *ngIf="todayOrder.status == \'delivered\'"><strong text-capitalize>Delivered</strong></ion-row>\n\n        <!-- <ion-row *ngIf="todayOrder.status == \'cancelled\'"><strong text-capitalize>Order Cancelled</strong></ion-row> -->\n\n        <ion-row>\n          <ion-icon name="time"></ion-icon> &nbsp; {{todayOrder.ordertiming.create| date:\'medium\'}}\n        </ion-row>\n        \n        <!-- <button ion-button clear item-end color="secondary">View</button> -->\n\n\n      </ion-item>\n      <ion-item *ngIf="todayOrders  && todayOrders.length  == 0">\n        No Record Found\n      </ion-item>\n    </ion-list>\n    \n    <ion-list *ngSwitchCase="\'customer\'">\n      <ion-item *ngFor="let customersOrder of customersOrders ; index as i" (click)="goToCustomerOrderDetail(i)">\n        <ion-avatar item-start>\n          <img style="object-fit:cover" [src]="customerImage(customersOrder.profilePic)">\n        </ion-avatar>\n        <h2 *ngIf = "customersOrder.firstname">{{customersOrder.firstname}}</h2>\n        <h2 *ngIf = "customersOrder.firstname == undefined || customersOrder.firstname == null">{{customersOrder.email}}</h2>\n        <!-- <button ion-button clear item-end color="secondary">View</button> -->\n      </ion-item>\n\n    </ion-list>\n\n  </div>\n\n\n</ion-content>\n'/*ion-inline-end:"D:\Apps\Owner App\src\pages\order\order.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_5__services_three_service__["a" /* ThreeService */],
            __WEBPACK_IMPORTED_MODULE_6__services_four_service__["a" /* FourService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */]])
    ], OrderPage);
    return OrderPage;
}());

var OrderDetailPage = /** @class */ (function () {
    function OrderDetailPage(navCtrl, navParams, oneService, threeService, fourService, modalCtrl, afd, loadingCtrl, toastCtrl, alertCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.oneService = oneService;
        this.threeService = threeService;
        this.fourService = fourService;
        this.modalCtrl = modalCtrl;
        this.afd = afd;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.alertCtrl = alertCtrl;
        this.orderDetail = {};
        this.imageURL = __WEBPACK_IMPORTED_MODULE_7__services_global__["a" /* imageUrl */];
        /*items: Observable<any[]>;*/
        this.firebaseOrders = [];
        this.firestore = __WEBPACK_IMPORTED_MODULE_10_firebase___default.a.database().ref('/orders');
        this.SubTotal = 0;
        this.orderDetail = navParams.get("orderData");
        var owner = JSON.parse(localStorage.getItem('owner'));
        console.log(this.orderDetail, '262');
        if (this.orderDetail['ordertiming']['type'] == 'now') {
            if (typeof owner['mindeliveryime'] != 'undefined' && owner['mindeliveryime'] != null && owner['mindeliveryime'] != '' && parseInt(owner['mindeliveryime']) > 0) {
                console.log('258', this.orderDetail['ordertiming']['datetime']);
                this.orderDetail['ordertiming']['datetime'] = this.addMinTime(owner['mindeliveryime']);
            }
        }
        if (typeof this.orderDetail.driverDetail != 'undefined') {
            this.getDriver();
        }
        this.getTaxAmmount();
        this.SubTotal = this.orderDetail.total - this.taxAmmount - this.orderDetail.deliveryCharges;
        this.getStage(this.orderDetail.status);
        this.getPreviousRating();
        this.fromNoti = navParams.get("noti");
        /*this.customizeOrderDetail();*/
        this.fourService.getCustomers(this.orderDetail['customerid']).subscribe(function (data) {
            if (!data.error) {
                _this.customerData = data.message;
            }
        });
        this.currentDate = this.formatPkgDate();
    }
    OrderDetailPage.prototype.getDateForDaily = function (date) {
        if (date) {
            var Dailydate = date.split(" ");
            if (Dailydate.length > 0) {
                return Dailydate[0];
            }
        }
    };
    OrderDetailPage.prototype.getTimeForDaily = function (date) {
        if (date) {
            var Dailydate = date.split(" ");
            if (Dailydate.length > 2) {
                return Dailydate[1] + ' ' + Dailydate[2];
            }
            else {
                return this.tConvert(Dailydate[1]);
            }
        }
    };
    OrderDetailPage.prototype.tConvert = function (time) {
        // Check correct time format and split into components
        var hour = (time.split(':'))[0];
        var min = (time.split(':'))[1];
        var part = hour > 12 ? 'PM' : 'AM';
        min = (min + '').length == 1 ? "0" + min : min;
        hour = hour > 12 ? hour - 12 : hour;
        hour = (hour + '').length == 1 ? "0" + hour : hour;
        return (hour + ":" + min + " " + part);
    };
    OrderDetailPage.prototype.addMinTime = function (time) {
        var date = new Date(this.orderDetail['ordertiming']['datetime']);
        date.setMinutes(date.getMinutes() + parseInt(time));
        var returnDate = this.getFormattedDate(date);
        return returnDate;
    };
    OrderDetailPage.prototype.formatDate = function (obj) {
        if (obj) {
            return obj.toString();
        }
        else {
            return obj;
        }
    };
    OrderDetailPage.prototype.getTime = function (time) {
        return moment(time, 'hh:mm').format('LT');
    };
    OrderDetailPage.prototype.getMyDay = function (number) {
        if (number == '') {
            return '';
        }
        if (number == 1) {
            return 'Monday';
        }
        else if (number == 2) {
            return 'Tuesday';
        }
        else if (number == 3) {
            return 'Wednesday';
        }
        else if (number == 4) {
            return 'Thursday';
        }
        else if (number == 5) {
            return 'Friday';
        }
        else if (number == 6) {
            return 'Saturday';
        }
        else if (number == 0) {
            return 'Sunday';
        }
    };
    OrderDetailPage.prototype.getFormattedDate = function (date) {
        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        var hr = date.getHours().toString();
        hr = hr.length > 1 ? hr : '0' + hr;
        var min = date.getMinutes().toString();
        min = min.length > 1 ? min : '0' + min;
        return year + '-' + month + '-' + day + ' ' + hr + ':' + min;
    };
    OrderDetailPage.prototype.getTaxAmmount = function () {
        if (typeof this.orderDetail['discount'] != 'undefined') {
            this.taxAmmount = (this.orderDetail['subtotal'] + this.orderDetail['deliveryCharges'] - this.orderDetail['discount']) * (this.orderDetail['tax'] / 100);
        }
        else {
            this.taxAmmount = (this.orderDetail['subtotal'] + this.orderDetail['deliveryCharges']) * (this.orderDetail['tax'] / 100);
        }
    };
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
    OrderDetailPage.prototype.presentToast = function (msg) {
        var toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'top' //top,middle,bottom
        });
        toast.present();
    };
    OrderDetailPage.prototype.markAsDelivered = function () {
        var _this = this;
        var prompt = this.alertCtrl.create({
            message: 'Confirm Items Delivered?',
            buttons: [
                {
                    text: 'Cancel',
                    handler: function (data) {
                    }
                },
                {
                    text: 'Confirm',
                    handler: function (data) {
                        var obj = {
                            menuStatus: true,
                            status: 'delivered',
                            id: _this.orderDetail._id
                        };
                        /*if (this.orderDetail['package'].length == 0) {
                          obj['status'] = 'delivered';
                        }*/
                        _this.threeService.updateCustomersOrdersStatus(obj).subscribe(function (data) {
                            if (!data.error) {
                                _this.getlatestOrder();
                                _this.getStage(_this.orderDetail.status);
                                _this.changeFirebaseOrderStatus('delivered', 'pick');
                                // this.presentToast('You have Delivered !');
                            }
                        });
                    }
                }
            ]
        });
        prompt.present();
    };
    OrderDetailPage.prototype.formatPkgDate = function () {
        var time = new Date();
        var date = time.getDate();
        var month = time.getMonth() + 1;
        var year = time.getFullYear();
        return (month + '/' + date + '/' + year);
    };
    OrderDetailPage.prototype.getPkgStatus = function (detail) {
        var date = new Date(detail.date.replace(/-/g, "/"));
        var currentDate = new Date();
        var dateDate = currentDate.getMonth() + 1 + '/' + currentDate.getDate() + '/' + currentDate.getFullYear();
        if (detail.date == dateDate) {
            if (detail.status) {
                return 0;
            }
            else {
                return 1;
            }
        }
        else {
            var dateTime = date.getTime();
            var currentDateTime = currentDate.getTime();
            var dayDiff = void 0;
            if (currentDateTime > dateTime) {
                if (detail.status) {
                    return 0;
                }
                else {
                    return 3;
                }
                /*let timeDiff = currentDateTime - dateTime;
                dayDiff = timeDiff / (1000 * 3600 * 24);
                dayDiff = parseInt(dayDiff);
                console.log("dayDiff current greater => " , dayDiff , date);*/
            }
            else {
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
    };
    OrderDetailPage.prototype.getStage = function (orderStatus) {
        //   let orderStatus = this.order.status;
        if (orderStatus == 'received') {
            this.stage = 1;
            return 1;
        }
        if (orderStatus == 'accepted') {
            this.stage = 2;
            return 2;
        }
        if (orderStatus == 'completed' || orderStatus == 'driverrejected') {
            this.stage = 3;
            return 3;
        }
        if (orderStatus == 'driveraccepted') {
            this.stage = 4;
            return 4;
        }
        if (orderStatus == 'OnTheWayForFirstWeek') {
            return 5;
        }
        if (orderStatus == 'deliveryForFirstWeek') {
            return 6;
        }
        if (orderStatus == 'ontheway') {
            return 7;
        }
        if (orderStatus == 'delivered') {
            this.stage = 8;
            return 8;
        }
    };
    OrderDetailPage.prototype.driverToken = function (order, resId, status) {
        var _this = this;
        this.oneService.getAllDrivers().subscribe(function (data) {
            var drivers = data.message;
            var driverobj = data.message;
            console.log(drivers);
            console.log(resId);
            var Tokens = [];
            var driversid = [];
            for (var i = 0; i < drivers.length; i++) {
                var kitchens = drivers[i].kitchensallow;
                for (var j = 0; j < kitchens.length; j++) {
                    if (kitchens[j].resId == resId) {
                        driversid.push(drivers[i]._id);
                        var token = drivers[i].fcmToken;
                        for (var k = 0; k < token.length; k++) {
                            console.log(token[k]);
                            Tokens.push(token[k]);
                        }
                        break;
                    }
                }
            }
            _this.notificationFunction(order, Tokens, status, driversid, driverobj);
        });
    };
    OrderDetailPage.prototype.notificationFunction = function (order, drivertokens, status, driversid, driverobj) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.threeService.GetCustomer(order.customerid).subscribe(function (res) {
                if (status == "accepted") {
                    var data = {
                        type: "chef",
                        tokensdriver: drivertokens,
                        status: status,
                        tokencustomer: res.message.fcmToken,
                        orderId: order._id,
                        userid: order.customerid,
                        driverid: driversid
                    };
                    _this.oneService.Notification(data).subscribe(function (res) {
                        var datatwo = { _id: order.customerid, fcmToken: res.message.usertoken };
                        _this.oneService.updateCustomer(datatwo).subscribe(function (ress) {
                            var _loop_1 = function (i) {
                                var data_1 = { _id: driverobj[i]._id, fcmToken: [] };
                                for (var j = 0; j < driverobj[i].fcmToken.length; j++) {
                                    if (res.message.drivertoken.includes(driverobj[i].fcmToken[j])) {
                                        data_1.fcmToken.push(driverobj[i].fcmToken[j]);
                                    }
                                }
                                _this.oneService.editDriver(data_1).subscribe(function () {
                                    if (i + 1 == driverobj.length) {
                                        resolve();
                                    }
                                });
                            };
                            for (var i = 0; i < driverobj.length; i++) {
                                _loop_1(i);
                            }
                        });
                        console.log(res);
                        resolve();
                    });
                }
                else {
                    var data = {
                        type: "chef",
                        status: status,
                        tokens: res.message.fcmToken,
                        orderId: order._id,
                        userid: order.customerid
                    };
                    _this.oneService.Notification(data).subscribe(function (res) {
                        var datatwo = { _id: order.customerid, fcmToken: res.message.usertoken };
                        _this.oneService.updateCustomer(datatwo).subscribe(function (res) {
                            console.log(res);
                            resolve();
                        });
                    });
                }
            });
        });
    };
    OrderDetailPage.prototype.doAccept = function (id, param, order) {
        // this.loading = this.loadingCtrl.create({
        //     content: 'Please wait...'
        // });
        // this.loading.present();
        var _this = this;
        // for(let i = 0 ; i < this.orderDetail.package.length ; i++){
        //     this.orderDetail.package[i].orderStatus = param;
        //   }
        //   for(let y = 0 ; y < this.orderDetail.items.length ; y++){
        //     this.orderDetail.items[y].orderStatus = param;
        //   }
        var obj = {
            id: id,
            status: 'accepted'
        };
        this.threeService.updateCustomersOrdersStatus(obj).subscribe(function (data) {
            if (!data.error) {
                _this.threeService.GetCustomer(order.customerid).subscribe(function (data) {
                    _this.driverToken(order, order.restaurantid, "accepted");
                    var obj2 = {
                        customeremail: data.message.email,
                        order: order
                    };
                    _this.threeService.OrderEmail(obj2).subscribe(function (data) {
                        console.log("CHANGE FIRE BASE ORDER");
                        // this.changeFirebaseOrderStatus('accepted','any');
                        _this.getOrder();
                        _this.getToast('You accepted order');
                        // if(this.orderDetail.ordertype == 'home'){
                        //     this.sendRequest('completed')
                        // }else{
                        //    this.sendRequestToCustomer('completed')
                        // }
                    });
                });
            }
            else {
                //  this.loading.dismiss();
                _this.getToast('Unable to accept. Please try again');
            }
        }, function (err) {
            _this.loading.dismiss();
            _this.getToast('Unable to Update. Please check your Intenet connection');
        });
    };
    OrderDetailPage.prototype.getToast = function (msg) {
        var toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'top' //top,middle,bottom
        });
        toast.present();
    };
    OrderDetailPage.prototype.doReject = function (id, status, order) {
        var _this = this;
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.loading.present();
        var obj = {
            id: id,
            status: 'rejected'
        };
        this.threeService.updateCustomersOrdersStatus(obj).subscribe(function (data) {
            if (!data.error) {
                _this.driverToken(order, order.restaurantid, "rejected");
                _this.changeFirebaseOrderStatus('rejected', 'any');
                // if (typeof this.fromNoti == 'undefined' || this.fromNoti != 'noti') {
                //     this.navCtrl.pop();
                // }
                _this.getOrder();
                _this.getToast('You rejected order');
            }
            else {
                _this.loading.dismiss();
                _this.getToast('Unable to accept. Please try again');
            }
        }, function (err) {
            _this.loading.dismiss();
            _this.getToast('Unable to Update. Please check your Intenet connection');
        });
    };
    OrderDetailPage.prototype.changeFirebaseOrderStatus = function (type, ordertype) {
        var _this = this;
        console.log("CHange FIRE BASE ORDER STATUS 633");
        var itemRef = this.afd.object('orders');
        var count = 0;
        itemRef.snapshotChanges().subscribe(function (action) {
            var arr = action.payload.val();
            var pushArr = [];
            for (var k in arr) {
                if (arr.hasOwnProperty(k)) {
                    pushArr.push({ 'key': k, 'orderDetail': arr[k] });
                }
            }
            _this.firebaseOrders = pushArr;
        });
        setTimeout(function () {
            console.log(_this.firebaseOrders, _this.firebaseOrders.length > 0, '652');
            if (_this.firebaseOrders && _this.firebaseOrders.length > 0) {
                var indx = _this.firebaseOrders.findIndex(function (mn) { return mn.orderDetail['orderID'] == _this.orderDetail['_id']; });
                console.log(indx, 'indx 654');
                if (indx > -1) {
                    if (typeof _this.firebaseOrders[indx]['orderDetail'].count == 'undefined' || _this.firebaseOrders[indx]['orderDetail'].count == null) {
                        count = 0;
                    }
                    else {
                        count = _this.firebaseOrders[indx]['orderDetail'].count + 1;
                    }
                    if (ordertype == 'pick') {
                        _this.updateFirebaseOrderStatus(_this.firebaseOrders[indx]['key'], type, count, 'pick');
                    }
                    else if (ordertype == 'home') {
                        _this.updateFirebaseOrderStatus(_this.firebaseOrders[indx]['key'], type, count, 'home');
                    }
                    else {
                        _this.updateFirebaseOrderStatus(_this.firebaseOrders[indx]['key'], type, count, 'any');
                    }
                }
            }
        }, 5000);
    };
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
    OrderDetailPage.prototype.updateFirebaseOrderStatus = function (key, type, count, ordertype) {
        console.log("updateFireBaseOrderStatus 691");
        if (type == 'delivered') {
            var obj = { orderStatus: type, orderID: this.orderDetail._id };
            obj['type'] = 'item';
            //  obj['rating'] = this.avgRating;
            obj['ordertype'] = 'pick';
            this.afd.list(this.firestore).update(key, obj).then(function () {
                console.log('Order Updated');
            }).catch(function (err) {
                console.log(err, 'ERROR afd');
            });
            ;
        }
        else {
            this.afd.list(this.firestore).update(key, { orderStatus: type, count: count, type: 'item', ordertype: ordertype, orderID: this.orderDetail._id }).then(function () {
                console.log('Order Updated');
            }).catch(function (err) {
                console.log(err, 'ERROR afd');
            });
        }
    };
    OrderDetailPage.prototype.getlatestOrder = function () {
        var _this = this;
        this.threeService.getOneOrder(this.orderDetail._id).subscribe(function (data) {
            //    this.loading.dismiss();
            if (!data.error) {
                _this.orderDetail = data.message;
                _this.getStage(_this.orderDetail.status);
                if (typeof _this.orderDetail.driverDetail != 'undefined') {
                    _this.getDriver();
                }
                _this.getPreviousRating();
                /*this.customizeOrderDetail();*/
            }
        }, function (err) {
            _this.getToast('Unable to load updates. Please check your Intenet connection');
        });
    };
    OrderDetailPage.prototype.getOrder = function () {
        var _this = this;
        this.threeService.getOneOrder(this.orderDetail._id).subscribe(function (data) {
            if (_this.loading) {
                _this.loading.dismiss();
            }
            if (!data.error) {
                _this.orderDetail = data.message;
                _this.getStage(_this.orderDetail.status);
                if (typeof _this.orderDetail.driverDetail != 'undefined') {
                    _this.getDriver();
                }
                _this.getPreviousRating();
                /*this.customizeOrderDetail();*/
            }
        }, function (err) {
            _this.getToast('Unable to load updates. Please check your Intenet connection');
        });
    };
    OrderDetailPage.prototype.getPreviousRating = function () {
        var _this = this;
        var obj = { "orderId": this.orderDetail._id, "customerId": this.orderDetail['customerid'] };
        this.threeService.checkRestroRating(obj).subscribe(function (presetRating) {
            if (!presetRating.error) {
                if (presetRating.message.length > 0) {
                    _this.rating = presetRating.message[0];
                    _this.avgRating = _this.rating['average'];
                }
            }
        });
    };
    OrderDetailPage.prototype.sendRequest = function (param) {
        var _this = this;
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.loading.present();
        this.threeService.getOneOrder(this.orderDetail._id).subscribe(function (data) {
            if (!data.error) {
                if (data.message.status != 'driveraccepted') {
                    for (var i = 0; i < _this.orderDetail.package.length; i++) {
                        _this.orderDetail.package[i].orderStatus = param;
                    }
                    for (var y = 0; y < _this.orderDetail.items.length; y++) {
                        _this.orderDetail.items[y].orderStatus = param;
                    }
                    var obj = {
                        id: _this.orderDetail['_id'],
                        status: 'completed',
                        package: _this.orderDetail.package,
                        items: _this.orderDetail.items
                    };
                    _this.threeService.updateCustomersOrdersStatus(obj).subscribe(function (data2) {
                        if (!data2.error) {
                            _this.getToast('Request sent successfully.');
                            _this.changeFirebaseOrderStatus('completed', 'home');
                            _this.getOrder();
                        }
                        else {
                            _this.loading.dismiss();
                            _this.getToast('Unable to send request! Please try again');
                        }
                    }, function (err) {
                        _this.loading.dismiss();
                        _this.getToast('Unable to send request! Please check your Internet connection');
                    });
                }
                else {
                    _this.loading.dismiss();
                    _this.getToast('Order is already accepted by the driver');
                    _this.orderDetail = data.message;
                    _this.getStage(_this.orderDetail.status);
                    if (typeof _this.orderDetail.driverDetail != 'undefined') {
                        _this.getDriver();
                    }
                    _this.getPreviousRating();
                }
            }
            else {
                _this.loading.dismiss();
                _this.getToast('Unable to send request! Please try again');
            }
        }, function (err) {
            _this.loading.dismiss();
            _this.getToast('Unable to send request! Please check your Internet connection');
        });
    };
    OrderDetailPage.prototype.sendRequestToCustomer = function (param) {
        var _this = this;
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.loading.present();
        console.log('here', this.orderDetail);
        this.threeService.getOneOrder(this.orderDetail._id).subscribe(function (data) {
            if (!data.error) {
                if (data.message.status != 'driveraccepted') {
                    for (var i = 0; i < _this.orderDetail.package.length; i++) {
                        _this.orderDetail.package[i].orderStatus = param;
                    }
                    for (var y = 0; y < _this.orderDetail.items.length; y++) {
                        _this.orderDetail.items[y].orderStatus = param;
                    }
                    var obj = {
                        id: _this.orderDetail['_id'],
                        status: 'completed',
                        package: _this.orderDetail.package,
                        items: _this.orderDetail.items
                    };
                    console.log(obj);
                    _this.threeService.updateCustomersOrdersStatus(obj).subscribe(function (data2) {
                        if (!data2.error) {
                            _this.getToast('Request sent successfully.');
                            _this.changeFirebaseOrderStatus('completed', 'pick');
                            _this.getOrder();
                        }
                        else {
                            _this.loading.dismiss();
                            _this.getToast('Unable to send request! Please try again');
                        }
                    }, function (err) {
                        _this.loading.dismiss();
                        _this.getToast('Unable to send request! Please check your Internet connection');
                    });
                }
                else {
                    _this.loading.dismiss();
                    _this.getToast('Customer is on the way');
                    _this.orderDetail = data.message;
                    _this.getStage(_this.orderDetail.status);
                    if (typeof _this.orderDetail.driverDetail != 'undefined') {
                        _this.getDriver();
                    }
                    _this.getPreviousRating();
                }
            }
            else {
                _this.loading.dismiss();
                _this.getToast('Unable to send request! Please try again');
            }
        }, function (err) {
            _this.loading.dismiss();
            _this.getToast('Unable to send request! Please check your Internet connection');
        });
    };
    OrderDetailPage.prototype.itemImage = function (img) {
        var imgPath;
        if (typeof img == 'undefined' || img == null) {
            imgPath = "assets/imgs/res2.jpg";
        }
        else {
            imgPath = this.imageURL + img;
        }
        return imgPath;
    };
    OrderDetailPage.prototype.startTracking = function () {
        var div = document.getElementById('map');
        if (div.style.height == '300px') {
            div.style.height = '0';
        }
        else {
            div.style.height = '300px';
        }
    };
    OrderDetailPage.prototype.getDriver = function () {
        var _this = this;
        var id = this.orderDetail.driverDetail['_id'];
        this.oneService.getDriver(id).subscribe(function (data) {
            if (!data.error && data.message != null && data.message != '') {
                _this.driver = data.message;
                setTimeout(function () {
                    _this.loadMap();
                }, 500);
            }
        }, function (err) {
            _this.getToast('Unable to load driver detail! Please check your Internet connection');
        });
    };
    OrderDetailPage.prototype.loadMap = function () {
        var mapOptions = {
            center: new google.maps.LatLng(this.orderDetail['fulladdress'].lat, this.orderDetail['fulladdress'].lng),
            zoom: 5,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        var latLng = new google.maps.LatLng(this.orderDetail['fulladdress'].lat, this.orderDetail['fulladdress'].lng);
        var marker = new google.maps.Marker({
            position: latLng,
            title: 'demo',
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            map: map,
            draggable: false,
        });
        if (typeof this.driver.lat != 'undefined' && typeof this.driver.lng != 'undefined') {
            var infowindow = new google.maps.InfoWindow();
            var latLng_1 = new google.maps.LatLng(this.driver.lat, this.driver.lng);
            var marker_1 = new google.maps.Marker({
                position: latLng_1,
                map: map,
                draggable: false,
            });
            infowindow = new google.maps.InfoWindow({
                content: this.driver.firstname
            });
            infowindow.open(map, marker_1);
        }
        this.showRoute(map);
    };
    OrderDetailPage.prototype.showRoute = function (map) {
        var directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
        var directionsService = new google.maps.DirectionsService;
        directionsDisplay.setMap(map);
        var origin = { location: new google.maps.LatLng(this.orderDetail['fulladdress'].lat, this.orderDetail['fulladdress'].lng), stopover: true };
        directionsService.route({
            origin: origin['location'],
            destination: new google.maps.LatLng(this.driver.lat, this.driver.lng),
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            }
            else {
                window.alert('Unable to display Route on Map! Location Not Reachable.');
            }
        });
    };
    OrderDetailPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-order-detail',template:/*ion-inline-start:"D:\Apps\Owner App\src\pages\order\order-detail.html"*/'<ion-header>\n\n    <ion-navbar color="secondary">\n\n        <button ion-button menuToggle>\n\n            <ion-icon name="menu"></ion-icon>\n\n        </button>\n\n        <ion-title *ngIf = "orderDetail._id">Order Detail - {{orderDetail._id.substr(18,6)}}</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n\n\n    <ion-row class="whiteDiv">\n\n        <ion-row class= "width100">\n\n            <ion-col col-12><strong>Delivery Details :</strong></ion-col>\n\n        </ion-row>\n\n        <hr class="width100 height2px">\n\n        <ion-row class= "width100">\n\n            <ion-col col-12 style="    color: red;\n\n            font-size: 16px;"><strong>Order ID : </strong>#{{orderDetail._id.substr(18,6)}}</ion-col>\n\n            <ion-col col-12><strong>Received at : </strong>{{orderDetail.ordertiming.create | date:\'medium\' }}</ion-col>\n\n            <ion-col col-12 ><strong>Delivery Date : </strong> {{orderDetail.ordertiming.datetime | date:\'medium\'}}</ion-col>\n\n        </ion-row>\n\n    </ion-row>\n\n\n\n    <ion-row class= "whiteDiv padding10px">\n\n        <ion-col col-12>\n\n            <strong>Order Status : </strong> \n\n            <!-- <span *ngIf="orderDetail.status == \'received\' "> Order Placed </span> -->\n\n            <!-- <span *ngIf="orderDetail.status == \'accepted\' " > Preparing Order </span>\n\n            <span *ngIf="orderDetail.status == \'rejected\' " > Order Rejected</span>\n\n            <span *ngIf="orderDetail.status == \'rejected\' " > Order Rejected</span>\n\n            <span *ngIf="orderDetail.status == \'completed\' && orderDetail.ordertype == \'home\' " > Waiting for Driver! </span>\n\n            <span *ngIf="orderDetail.status == \'completed\' && orderDetail.ordertype == \'pick\' " > Waiting to customer!</span>\n\n            <span *ngIf="orderDetail.status == \'driveraccepted\' && orderDetail.ordertype == \'home\'" > Driver is On the Way</span>\n\n            <span *ngIf="orderDetail.status == \'driveraccepted\' && orderDetail.ordertype == \'pick\'" > Customer is On the Way</span>\n\n            <span *ngIf="orderDetail.status == \'delivered\'" > Delivered</span>\n\n            <span *ngIf="orderDetail.status == \'cancelled\'" > Order Cancelled</span> -->\n\n            <span *ngIf="orderDetail.status == \'received\' "> Payment Received </span>\n\n            <span *ngIf="orderDetail.status == \'accepted\'">Preparing Order</span>\n\n            <span *ngIf="orderDetail.status == \'rejected\'">Order Rejected</span>\n\n            <span *ngIf="orderDetail.status == \'ontheway\'">On the way</span>\n\n            <span *ngIf="orderDetail.status == \'delivered\'">Delivered</span>\n\n            <span *ngIf="orderDetail.status == \'driveraccepted\'">Driver Accepted</span>\n\n        </ion-col>\n\n        <!-- <ion-row class="width100 colorLightGray" *ngIf = "orderDetail.items.length > 0 ">\n\n            <ion-col col-12 class="padding5-0px">\n\n               Daily Menu Items \n\n            </ion-col>\n\n            <ion-col [ngClass] = "1 <= getStage(orderDetail.items[0].orderStatus) ? \'greenBorderLeft\' : \'grayBorderLeft\' " col-12>&nbsp;\n\n                <span *ngIf = "orderDetail.paymenttype == \'cash\'">Order Placed</span>\n\n                <span *ngIf = "orderDetail.paymenttype == \'card\'">Payment Received</span>\n\n            </ion-col>\n\n            <ion-col [ngClass] = "2 <= getStage(orderDetail.items[0].orderStatus) ? \'greenBorderLeft\' : \'grayBorderLeft\' " col-12>&nbsp;Order Accepted</ion-col>\n\n            <ion-col [ngClass] = "2 <= getStage(orderDetail.items[0].orderStatus) ? \'greenBorderLeft\' : \'grayBorderLeft\' " col-12>&nbsp;Preparing your Order</ion-col>\n\n            <ion-col  *ngIf="orderDetail.ordertype == \'home\'" [ngClass] = "3 <= getStage(orderDetail.items[0].orderStatus) ? \'greenBorderLeft\' : \'grayBorderLeft\' " col-12>&nbsp;Send Order Request for Driver</ion-col>\n\n            <ion-col  *ngIf="orderDetail.ordertype == \'pick\'" [ngClass] = "3 <= getStage(orderDetail.items[0].orderStatus) ? \'greenBorderLeft\' : \'grayBorderLeft\' " col-12>&nbsp;Order Prepared</ion-col> \n\n            <ion-col *ngIf="orderDetail.ordertype == \'home\'" [ngClass] = "4 <= getStage(orderDetail.items[0].orderStatus) ? \'greenBorderLeft\' : \'grayBorderLeft\'" col-12>&nbsp;Driver Accepted Order Request\n\n            </ion-col>\n\n        \n\n           \n\n            <ion-col  [ngClass] = "7 <= getStage(orderDetail.items[0].orderStatus) ? \'greenBorderLeft\' : \'grayBorderLeft\' " col-12>&nbsp;On the Way\n\n            </ion-col>\n\n\n\n            <ion-col  [ngClass] = "8 <= getStage(orderDetail.items[0].orderStatus) ? \'greenBorderLeft\' : \'grayBorderLeft\' " col-12>&nbsp;Order Delivered\n\n            </ion-col>\n\n\n\n        </ion-row>\n\n        <ion-row class="width100 colorLightGray" *ngFor = "let package of orderDetail.package">\n\n            <ion-col>\n\n                Package Name : {{package.name}} \n\n            </ion-col>\n\n            <ion-col [ngClass] = "1 <= getStage(package.orderStatus) ? \'greenBorderLeft\' : \'grayBorderLeft\' " col-12>&nbsp;\n\n                <span>Order Placed</span>\n\n            </ion-col>\n\n            <ion-col  [ngClass] = "2 <= getStage(package.orderStatus) ? \'greenBorderLeft\' : \'grayBorderLeft\' " col-12>&nbsp;\n\n                <span> Payment Received</span>\n\n            </ion-col>\n\n            <ion-col [ngClass] = "2 <= getStage(package.orderStatus) ? \'greenBorderLeft\' : \'grayBorderLeft\' " col-12>&nbsp;Preparing your Order</ion-col>\n\n     \n\n            <ion-col *ngIf="orderDetail.ordertype == \'pick\'" [ngClass] = "3 <= getStage(package.orderStatus) ? \'greenBorderLeft\' : \'grayBorderLeft\' " col-12>\n\n                &nbsp;Order Prepared&nbsp;(Waiting customer to pick!)\n\n            </ion-col>\n\n            <ion-col *ngIf="orderDetail.ordertype == \'home\'" [ngClass] = "3 <= getStage(package.orderStatus) ? \'greenBorderLeft\' : \'grayBorderLeft\' " col-12>\n\n                &nbsp;Order Prepared&nbsp;(Waiting for Driver!)\n\n            </ion-col>\n\n            <ion-col *ngIf="orderDetail.ordertype == \'home\'"  [ngClass] = "4 <= getStage(package.orderStatus) ? \'greenBorderLeft\' : \'grayBorderLeft\' " col-12>&nbsp; Driver Accepted Order Request</ion-col>\n\n            <ion-col *ngIf="package.type == \'fixed\' && orderDetail.delvierySlotsWeek.dtype == \'Twice\'" [ngClass] = "5 <= getStage(package.orderStatus) ? \'greenBorderLeft\' : \'grayBorderLeft\' " col-12>&nbsp;On the Way</ion-col>\n\n            <ion-col *ngIf="package.type == \'fixed\' && orderDetail.delvierySlotsWeek.dtype == \'Twice\'" [ngClass] = "6 <= getStage(package.orderStatus) ? \'greenBorderLeft\' : \'grayBorderLeft\' " col-12>&nbsp;1st Week order Delivered</ion-col>\n\n            <ion-col *ngIf="(package.type == \'fixed\')  || (package.type == \'flexible\')"[ngClass] = "7 <= getStage(package.orderStatus) ? \'greenBorderLeft\' : \'grayBorderLeft\' " col-12>&nbsp;On the Way</ion-col>\n\n            <ion-col [ngClass] = "8 <= getStage(package.orderStatus) ? \'greenBorderLeft\' : \'grayBorderLeft\' " col-12>&nbsp; <span *ngIf="package.type == \'fixed\' && orderDetail.delvierySlotsWeek.dtype == \'Twice\'">2nd Week Order \n\n                Delivered</span>\n\n                <span *ngIf="(package.type == \'fixed\' && orderDetail.delvierySlotsWeek.dtype == \'Once\') || (package.type == \'flexible\')">Order \n\n                    Delivered</span>  </ion-col>\n\n        </ion-row>\n\n        <ion-row *ngIf = "orderDetail.status == \'rejected\'">\n\n            Order Rejected\n\n        </ion-row>\n\n        <ion-row *ngIf = "orderDetail.status == \'cancelled\'">\n\n            Order Cancelled\n\n        </ion-row> -->\n\n    </ion-row>\n\n\n\n    <ion-row class="whiteDiv"*ngIf = "orderDetail.status == \'received\'">\n\n        <ion-row padding-horizontal class= "width100" *ngIf = "orderDetail.status == \'received\'">\n\n        <!-- <hr class="width100 height2px"> -->\n\n            <ion-col col-12>\n\n                <button class="acceptButton" ion-button (click)="doAccept(orderDetail._id,\'accepted\',orderDetail)">Accept</button>\n\n\n\n                <button class="rejectButton themeRedBg" ion-button (click)="doReject(orderDetail._id,\'rejected\',orderDetail)">Reject</button>\n\n            </ion-col>\n\n        </ion-row>\n\n\n\n        <!-- <ion-col col-12 *ngIf = "orderDetail.status == \'accepted\'  || orderDetail.status == \'driverrejected\'">\n\n            <button *ngIf="orderDetail.ordertype == \'home\'" class="acceptButton" ion-button full (click)="sendRequest(\'completed\')">Send Request to Drivers</button>\n\n            <button *ngIf="orderDetail.ordertype == \'pick\'" class="acceptButton" ion-button full (click)="sendRequestToCustomer(\'completed\')">Send Request to pick the food</button>\n\n        </ion-col> -->\n\n     \n\n    </ion-row>\n\n    <!-- <ion-row class="whiteDiv" *ngIf=" orderDetail.status ==\'delivered\'" >\n\n    <ion-col >\n\n        <button  class="acceptButton" ion-button full (click)="markAsDelivered()">Mark as Delivered</button>\n\n    </ion-col>\n\n    </ion-row> -->\n\n\n\n    <!-- <ion-row class="whiteDiv" *ngIf = "rating">\n\n        <ion-col col-12 text-center>\n\n            <rating class="orderPacking" [(ngModel)]="avgRating" readOnly="true" max="5" emptyStarIconName="star-outline" halfStarIconName="star-half" starIconName="star"></rating>\n\n        </ion-col>\n\n        <ion-col *ngIf = "rating.review" class="reviewText" col-12>{{rating.review}}</ion-col>\n\n    </ion-row> -->\n\n\n\n    <!-- <ion-row class="whiteDiv">\n\n        <ion-row class= "width100">\n\n            <ion-col col-12><strong>Order Type :</strong></ion-col>\n\n        </ion-row>\n\n        <hr class="width100 height2px">\n\n        <ion-row class= "width100">\n\n            <ion-col col-12><span *ngIf = "orderDetail.ordertiming && orderDetail.ordertiming.type == \'now\'">Order for Now</span><span *ngIf = "orderDetail.ordertiming && orderDetail.ordertiming.type == \'later\'">Pre Order for Later </span></ion-col>\n\n            <ion-col col-12 *ngIf = "orderDetail.ordertiming && orderDetail.ordertiming.datetime"><strong>When to deliver : </strong> {{formatDate(orderDetail.ordertiming.datetime) | date : \'medium\'}}</ion-col>\n\n        </ion-row>\n\n    </ion-row> -->\n\n\n\n    <ion-row class="whiteDiv">\n\n        <ion-row class= "width100">\n\n            <ion-col col-12><strong>Payment Type : </strong>Card</ion-col>\n\n        </ion-row>\n\n        <!-- <ion-row class= "width100">\n\n            <ion-col col-12><strong>Delivery Type : </strong><span text-capitalize><span text-capitalize *ngIf="orderDetail.ordertype == \'pick\'">Take away</span><span text-capitalize *ngIf="orderDetail.ordertype == \'home\'">Home delivery</span></span></ion-col>\n\n        </ion-row> -->\n\n        <!-- <hr class="width100 height2px">\n\n        <ion-row padding-horizontal class= "width100">\n\n            <ion-col col-12 text-capitalize>{{orderDetail.paymenttype}}</ion-col>\n\n        </ion-row> -->\n\n    </ion-row>\n\n\n\n    <ion-row class="whiteDiv" *ngIf = "customerData">\n\n        <ion-row class= "width100">\n\n            <ion-col col-12><strong>Customer Details :</strong></ion-col>\n\n        </ion-row>\n\n        <hr class="width100 height2px">\n\n        <ion-row class= "width100">\n\n            <ion-col *ngIf = "customerData.firstname" col-12 text-capitalize><strong>Name : </strong>{{customerData.firstname}} {{customerData.lastname}}</ion-col>\n\n            <ion-col col-12><strong>Email ID : </strong>{{customerData.email}}</ion-col>\n\n            <ion-col col-12 *ngIf = "orderDetail.fulladdress"><strong>Delivery Address : </strong>{{orderDetail.fulladdress.address}}</ion-col>\n\n            <!-- <ion-col col-12 *ngIf = "orderDetail.fulladdress"><strong>Zipcode : </strong>{{orderDetail.fulladdress.zipcode}}</ion-col> -->\n\n        </ion-row>\n\n    </ion-row>\n\n    <!-- <ion-row class="whiteDiv" *ngIf = "customerData">\n\n        <ion-row class= "width100">\n\n            <ion-col col-12><strong>Delivery Timings :</strong></ion-col>\n\n        </ion-row>\n\n        <hr class="width100 height2px">\n\n        <ion-row class= "width100">\n\n            <ion-col col-12 text-capitalize><strong>Delivery Date </strong> {{orderDetail.ordertiming.datetime}}</ion-col>\n\n        \n\n        </ion-row>\n\n    </ion-row> -->\n\n    <ion-row class="whiteDiv" *ngIf = "orderDetail.driverDetail">\n\n        <ion-row class= "width100">\n\n            <ion-col col-12><strong>Driver Detail :</strong></ion-col>\n\n        </ion-row>\n\n        <hr class="width100 height2px">\n\n        <ion-row class= "width100">\n\n            <ion-col *ngIf = "orderDetail.driverDetail.firstname" col-12 text-capitalize><strong>Name : </strong>{{orderDetail.driverDetail.firstname}}</ion-col>\n\n            <ion-col *ngIf = "orderDetail.driverDetail.phone" col-12><strong>Contact No. : </strong>{{orderDetail.driverDetail.phone}}</ion-col>\n\n            <ion-col *ngIf = "orderDetail.driverDetail.vehicleType" col-12 text-capitalize><strong>Vehicle Type : </strong>{{orderDetail.driverDetail.vehicleType}}</ion-col>\n\n            <ion-col *ngIf = "orderDetail.driverDetail.vehicleName" col-12 text-capitalize><strong>Vehicle Name : </strong>{{orderDetail.driverDetail.vehicleName}}</ion-col>\n\n            <ion-col *ngIf = "orderDetail.driverDetail.vehicleNo" col-12><strong>Vehicle Number : </strong>{{orderDetail.driverDetail.vehicleNo}}</ion-col>\n\n        </ion-row>\n\n        <ion-row *ngIf = "orderDetail.status != \'delivered\' " class= "width100" text-center>\n\n            <button class="height2em" ion-button full color="secondary" (click)="startTracking()">Show Map</button>\n\n        </ion-row>\n\n        <div id="map" style="width:100%;background:gainsboro"></div>\n\n    </ion-row>\n\n\n\n    <ion-row *ngIf = "orderDetail.items && orderDetail.items.length > 0" class = "whiteDiv">\n\n        <ion-row class = "width100">\n\n            <strong>Daily Menu Items</strong>\n\n            <span *ngIf = "orderDetail.menuStatus" class="deliveredClass"> Delivered</span>\n\n        </ion-row>\n\n        <hr class="width100 height2px">\n\n        <ion-row *ngFor = "let item of orderDetail.items let i = index; " class="width100">\n\n            <ion-col class="">\n\n                <strong>{{i+1}})</strong> {{item.name}}\n\n            </ion-col>\n\n            <ion-col col-2>\n\n                <strong> X {{item.qty}} </strong>\n\n            </ion-col>\n\n            <ion-col text-right col-4 col-sm-3 class="colorLightGray paddingTop9px">\n\n                <span *ngIf = "orderDetail.currency">{{orderDetail.currency}}  </span> {{item.qty * item.price | number : \'1.2-2\'}}\n\n            </ion-col>\n\n        </ion-row>\n\n    </ion-row>\n\n\n\n    <ion-row *ngIf = "orderDetail.combo && orderDetail.combo.length > 0" class = "whiteDiv">\n\n        <ion-row class = "width100">\n\n            <strong>Serving Items</strong>\n\n            <span *ngIf = "orderDetail.menuStatus" class="deliveredClass"> Delivered</span>\n\n        </ion-row>\n\n        <hr class="width100 height2px">\n\n        <ion-row *ngFor = "let combo of orderDetail.combo; let i = index; " class="width100 divHighlighted">\n\n            <ion-row class="width100">\n\n                <ion-col class="">\n\n                    <strong>{{i+1}})</strong> {{combo.name}}\n\n                </ion-col>\n\n                <ion-col col-2>\n\n                    <strong> X {{combo.qty}} </strong>\n\n                </ion-col>\n\n                <ion-col text-right col-4 col-sm-3 class="colorLightGray paddingTop9px">\n\n                    <span *ngIf = "orderDetail.currency">{{orderDetail.currency}}  </span> {{combo.qty * combo.finalcomboprice | number : \'1.2-2\'}}\n\n                </ion-col>\n\n            </ion-row>\n\n            <ion-row class="width100">\n\n                <ion-col col-4 class="whiteSpaceInitial" *ngFor = "let menus of combo.menuId;">\n\n                    <ion-row class="itemImage comboMenuImage width100" [ngStyle]="{\'background-image\': \'url(\' + itemImage(menus.image) + \')\'}"></ion-row>\n\n                    <ion-row text-capitalize class = "font2vh bgWhite colorBlack width100">{{menus.name}}</ion-row>\n\n                </ion-col>\n\n            </ion-row>\n\n            <ion-row class="width100">\n\n                <!-- <ion-col class="">\n\n                    <strong>{{i+1}})</strong> {{combo.name}}\n\n                </ion-col>\n\n                <ion-col col-2>\n\n                    <strong> X {{combo.qty}} </strong>\n\n                </ion-col> -->\n\n                <ion-col col-4 col-sm-3 class="colorLightGray paddingTop9px" *ngIf = "combo.instructions">\n\n                     {{combo.instructions  || N/A}}\n\n                </ion-col>\n\n            </ion-row>\n\n        </ion-row>\n\n    </ion-row>\n\n    \n\n    <ion-row *ngIf = "((orderDetail.items.length > 0) || (orderDetail.combo.length > 0) && (orderDetail.package.length > 0)) && orderDetail.status != \'cancelled\' && orderDetail.status != \'rejected\'" class = "whiteDiv">\n\n\n\n        <ion-col><strong>Item Delivery Status : </strong></ion-col>\n\n\n\n\n\n        <!-- <ion-row class="width100 colorLightGray" *ngIf = ""> -->\n\n            <ion-col [ngClass] = "1 <= stage ? \'greenBorderLeft\' : \'grayBorderLeft\' " col-12>&nbsp;\n\n                <span *ngIf = "orderDetail.paymenttype == \'cash\'">Order Placed</span>\n\n                <span *ngIf = "orderDetail.paymenttype == \'card\'">Payment Received</span>\n\n            </ion-col>\n\n            <ion-col [ngClass] = "2 <= stage ? \'greenBorderLeft\' : \'grayBorderLeft\' " col-12>&nbsp;Order Accepted</ion-col>\n\n            <ion-col [ngClass] = "2 <= stage ? \'greenBorderLeft\' : \'grayBorderLeft\' " col-12>&nbsp;Preparing your Order</ion-col>\n\n            <ion-col *ngIf="orderDetail.ordertype == \'pick\'" [ngClass] = "3 <= stage ? \'greenBorderLeft\' : \'grayBorderLeft\' " col-12>\n\n                    &nbsp;Order Prepared&nbsp;(Waiting customer to pick!)\n\n                </ion-col>\n\n                <ion-col *ngIf="orderDetail.ordertype == \'home\'" [ngClass] = "3 <= stage ? \'greenBorderLeft\' : \'grayBorderLeft\' " col-12>\n\n                    &nbsp;Order Prepared&nbsp;(Waiting for Driver!)\n\n                </ion-col>\n\n            <ion-col [ngClass] = "4 <= stage ? \'greenBorderLeft\' : \'grayBorderLeft\' " col-12>&nbsp;On the Way</ion-col>\n\n            <ion-col [ngClass] = "8 <= stage ? \'greenBorderLeft\' : \'grayBorderLeft\' "  col-12>&nbsp; Items Delivered</ion-col>\n\n        <!-- </ion-row> -->\n\n    </ion-row>\n\n\n\n\n\n\n\n    <ion-row *ngIf = "orderDetail.package && orderDetail.package.length > 0" class = "whiteDiv">\n\n        <ion-row><strong> Package List</strong></ion-row>\n\n        <hr class="width100 height2px">\n\n            <ion-row *ngFor = "let pkg of orderDetail.package; let i = index " class="width100 divHighlighted">\n\n            <ion-row class="width100">\n\n                <ion-col class="">\n\n                    <strong>{{i+1}})</strong> {{pkg.name}}\n\n                </ion-col>\n\n                <ion-col col-2>\n\n                    <strong> X {{pkg.qty}} </strong>\n\n                </ion-col>\n\n                <ion-col text-right col-4 col-sm-3 class="colorLightGray paddingTop9px">\n\n                    <span *ngIf = "orderDetail.currency">{{orderDetail.currency}}  </span> {{pkg.qty * pkg.packageprice | number : \'1.2-2\'}}\n\n                </ion-col>\n\n            </ion-row>\n\n            <ion-row class="width100">\n\n                <ion-col col-12>\n\n                    <strong>Package Duration</strong>\n\n                </ion-col>\n\n                <ion-col *ngIf = "pkg.type == \'fixed\' " col-12 padding-left class="colorLightGray">\n\n                    {{formatDate(pkg.startdate) | date : \'fullDate\'}} - {{formatDate(pkg.enddate) | date : \'fullDate\'}}\n\n                </ion-col>\n\n                <ion-col *ngIf = "pkg.type == \'flexible\' " col-12 padding-left class="colorLightGray">\n\n                    {{formatDate(pkg.dayandmenus[0].date) | date : \'fullDate\'}} - {{formatDate(pkg.dayandmenus[pkg.dayandmenus.length-1].date) | date : \'fullDate\'}}\n\n                </ion-col>\n\n            </ion-row>\n\n\n\n            <ion-row class="width100 padding10px" *ngFor = "let detail of pkg.dayandmenus;" [ngClass] = "detail.status?\'greenBorder\':\'grayBorder\'"> <!-- let m = index; " [ngClass] = "detail.status?\'greenBorder\':\'grayBorder\'"> -->\n\n                <ion-col col-12>\n\n                    <strong>{{formatDate(detail.date) | date : \'mediumDate\'}}</strong>\n\n\n\n                    <span float-right class="themeGreen" *ngIf = "pkg.orderStatus ==\'delivered\' "><strong>Delivered</strong></span>\n\n                    <!-- <span float-right class="themeRed" *ngIf = "getPkgStatus(detail) == 1 ">In Process</span> -->\n\n                    <span float-right class="colorGray" *ngIf = "pkg.orderStatus !=\'delivered\' ">Pending</span>\n\n                    <!-- <span float-right class="themeRed" *ngIf = "getPkgStatus(detail) == 3 "><strong>Not Delivered Yet</strong></span> -->\n\n\n\n                    <!--  <ion-icon [ngClass]="detail.status ? \'green\' : \'gray\'" float-right name="checkmark-circle" ios="ios-checkmark-circle" md="md-checkmark-circle"></ion-icon> -->\n\n                </ion-col>\n\n                <ion-col col-4 class="whiteSpaceInitial" *ngFor = "let menus of detail.menuids">\n\n                    <!-- <ion-row class="itemImage comboMenuImage width100" [ngStyle]="{\'background-image\': \'url(\' + itemImage(menus.image) + \')\'}"></ion-row> -->\n\n                    <img class="profile-img "  style="object-fit: cover;" width="100px" height="100px" [src]="itemImage(menus.image)">\n\n                    <ion-row text-capitalize class = "font2vh colorBlack bgWhite width100">{{menus.name}}</ion-row>\n\n                </ion-col>\n\n                <!-- <ion-icon [ngClass] = "detail.status?\'green\':\'gray\'" class = makeDeliverIcon name="checkmark-circle" ios="ios-checkmark-circle" md="md-checkmark-circle"></ion-icon> -->\n\n            </ion-row>\n\n        </ion-row>\n\n    </ion-row>\n\n\n\n\n\n\n\n\n\n    <ion-row *ngIf = "orderDetail.addOnItem && orderDetail.addOnItem.length > 0" class = "whiteDiv">\n\n        <ion-row><strong>Add On Items</strong></ion-row>\n\n        <hr class="width100 height2px">\n\n            <ion-row *ngFor = "let addOn of orderDetail.addOnItem; let i = index " class="width100 divHighlighted">\n\n            <ion-row class="width100">\n\n                <ion-col class="">\n\n                    <strong>{{i+1}})</strong> {{addOn.name}} \n\n                </ion-col>\n\n                <ion-col col-2>\n\n                    <strong> X {{addOn.qty}} </strong>\n\n                </ion-col>\n\n                <ion-col text-right col-4 col-sm-3 class="colorLightGray paddingTop9px">\n\n                    <span *ngIf = "orderDetail.currency">{{orderDetail.currency}}  </span> {{addOn.qty * addOn.finalprice | number : \'1.2-2\'}}\n\n                </ion-col>\n\n            </ion-row>\n\n    \n\n        </ion-row>\n\n    </ion-row>\n\n\n\n\n\n\n\n\n\n    <ion-row *ngIf = "orderDetail.note" class = "whiteDiv">\n\n        <strong>Note : </strong> {{orderDetail.note}}\n\n    </ion-row>\n\n\n\n    <ion-row padding class= "whiteDiv" *ngIf = "orderDetail">\n\n\n\n        <ion-row class="width100 colorLightGray">\n\n            <ion-col col-6>Total</ion-col>\n\n            <ion-col text-right><span *ngIf = "orderDetail.currency">{{orderDetail.currency}}  </span> {{orderDetail.subtotal | number : \'1.2-2\'}}</ion-col>\n\n        </ion-row>\n\n\n\n        <ion-row *ngIf = "orderDetail.discount" class="width100 colorLightGray">\n\n            <ion-col col-6>Discount <span class="discountPercent" *ngIf = "orderDetail.coupon && orderDetail.coupon.type == \'Percent\'">({{orderDetail.coupon.percentorpricevalue}} %)</span></ion-col>\n\n            <ion-col text-right><span *ngIf = "orderDetail.currency">{{orderDetail.currency}}  </span> {{orderDetail.discount | number : \'1.2-2\'}}</ion-col>\n\n        </ion-row>\n\n\n\n        <ion-row *ngIf = "orderDetail.deliveryCharges " class="width100 colorLightGray">\n\n            <ion-col col-6>Delivery Charges</ion-col>\n\n            <ion-col text-right><span *ngIf = "orderDetail.currency">{{orderDetail.currency}}</span> {{orderDetail.deliveryCharges | number : \'1.2-2\'}}</ion-col>\n\n        </ion-row>\n\n\n\n        <ion-row class="width100 colorLightGray">\n\n            <ion-col col-6>Tax &nbsp;</ion-col>\n\n            <ion-col text-right><span >{{orderDetail.currency}}</span>{{orderDetail.tax | number : \'1.2-2\'}}</ion-col>\n\n        </ion-row>\n\n\n\n        <hr class="width100 height2px">\n\n\n\n        <ion-row class="width100 colorLightGray">\n\n            <ion-col col-6 text-left class="colorGray"><strong>Pay</strong></ion-col>\n\n            <ion-col text-right><span *ngIf = "orderDetail.currency">{{orderDetail.currency}}  </span>{{orderDetail.total | number : \'1.2-2\'}}</ion-col>\n\n        </ion-row>\n\n    </ion-row>\n\n\n\n</ion-content>'/*ion-inline-end:"D:\Apps\Owner App\src\pages\order\order-detail.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_4__services_one_service__["a" /* OneService */],
            __WEBPACK_IMPORTED_MODULE_5__services_three_service__["a" /* ThreeService */],
            __WEBPACK_IMPORTED_MODULE_6__services_four_service__["a" /* FourService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_8_angularfire2_database__["a" /* AngularFireDatabase */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */]])
    ], OrderDetailPage);
    return OrderDetailPage;
}());

//# sourceMappingURL=order.js.map

/***/ }),

/***/ 166:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TwoService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__global__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var TwoService = /** @class */ (function () {
    function TwoService(http) {
        this.http = http;
    }
    TwoService.prototype.getComplexity = function () {
        return this.http.get(__WEBPACK_IMPORTED_MODULE_2__global__["d" /* url2 */] + 'users/complexity')
            .map(function (response) { return response.json(); });
    };
    TwoService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
    ], TwoService);
    return TwoService;
}());

//# sourceMappingURL=two.service.js.map

/***/ }),

/***/ 169:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__forget_password_forget_password__ = __webpack_require__(380);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home__ = __webpack_require__(170);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_forms__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_one_service__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_angularfire2_database__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_map__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_firebase__ = __webpack_require__(165);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_firebase__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/*import { SignupPage } from '../signup/signup';*/



/*import { FirebaseListObservable } from 'angularfire2/database-deprecated';*/


var LoginPage = /** @class */ (function () {
    function LoginPage(navCtrl, navParams, oneService, loadingCtrl, lf, afd, toastCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.oneService = oneService;
        this.loadingCtrl = loadingCtrl;
        this.lf = lf;
        this.afd = afd;
        this.toastCtrl = toastCtrl;
        this.emailp = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        this.formErrors = {
            'username': '',
            'password': ''
        };
        this.validationMessages = {
            'username': {
                'required': 'Email is required.',
                'pattern': 'Invalid Email ID'
            },
            'password': {
                'required': 'Password is required.'
            }
        };
        this.firestore = __WEBPACK_IMPORTED_MODULE_8_firebase___default.a.database().ref('/restaurants');
        this.loginForm = this.lf.group({
            username: ['', [__WEBPACK_IMPORTED_MODULE_4__angular_forms__["f" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_4__angular_forms__["f" /* Validators */].pattern(this.emailp)]],
            password: ['', __WEBPACK_IMPORTED_MODULE_4__angular_forms__["f" /* Validators */].required]
        });
        this.loginForm.valueChanges.subscribe(function (data) { return _this.onValueChanged(data); });
        this.onValueChanged();
    }
    LoginPage.prototype.onValueChanged = function (data) {
        if (!this.loginForm) {
            return;
        }
        var form = this.loginForm;
        for (var field in this.formErrors) {
            this.formErrors[field] = '';
            var control = form.get(field);
            if (control && control.dirty && !control.valid) {
                var messages = this.validationMessages[field];
                for (var key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    };
    LoginPage.prototype.afterOwnerGet = function (userObj) {
        console.log(userObj, "check it ");
        var that = this;
        FCMPlugin.getToken(function (token) {
            console.log(token);
            that.AddTokenToDB(token, userObj);
            console.log(token);
        });
    };
    LoginPage.prototype.AddTokenToDB = function (token, that) {
        var data = { _id: "none", fcmToken: [] };
        var temp = that;
        console.log(temp, "temp inside function");
        data._id = temp.ownerId._id;
        var tokens = temp.ownerId.fcmToken;
        if (tokens == undefined) {
            tokens = new Array();
        }
        if (tokens.includes(token)) {
            return;
        }
        tokens.push(token);
        data.fcmToken = tokens;
        console.log(data);
        this.oneService.editOwner(data).subscribe(function (res) {
            console.log(res);
        });
    };
    LoginPage.prototype.goToFogetPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__forget_password_forget_password__["a" /* ForgetPasswordPage */]);
    };
    LoginPage.prototype.doLogin = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();
        this.oneService.login(this.loginForm.value).subscribe(function (data) {
            loading.dismiss();
            if (data.status) {
                _this.storeRestaurantToken(data.data);
                _this.afterOwnerGet(data.data);
                localStorage.setItem('owner', JSON.stringify(data.data));
                _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */]);
            }
            else {
                _this.getToast('Incorrect Credential');
                /*this.loginForm.reset();*/
            }
        }, function (err) {
            console.log(err);
            loading.dismiss();
            _this.getToast('Unable to Login. Please check your Internet connection.');
        });
    };
    LoginPage.prototype.getToast = function (msg) {
        var toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'top' //top,middle,bottom
        });
        toast.present();
    };
    LoginPage.prototype.storeRestaurantToken = function (data) {
        var _this = this;
        var itemRef = this.afd.object('restaurants');
        var pushtokens = [];
        itemRef.snapshotChanges().subscribe(function (action) {
            var arr = action.payload.val();
            var pushArr = [];
            for (var k in arr) {
                if (arr.hasOwnProperty(k)) {
                    pushArr.push({ 'key': k, 'resId': arr[k].restaurantId });
                }
            }
            pushtokens = pushArr;
        });
        setTimeout(function () {
            _this.tokensetup().then(function (token) {
                if (pushtokens && pushtokens.length > 0) {
                    var indx = pushtokens.findIndex(function (mn) { return mn.resId == data._id; });
                    if (indx > -1) {
                        _this.updateToken(pushtokens[indx]['key'], token);
                    }
                    else {
                        _this.addToken(token, data._id);
                    }
                }
                else {
                    _this.addToken(token, data._id);
                }
            });
        }, 5000);
    };
    LoginPage.prototype.tokensetup = function () {
        var promise = new Promise(function (resolve, reject) {
            FCMPlugin.getToken(function (token) {
                resolve(token);
            }, function (err) {
                reject(err);
            });
        });
        return promise;
    };
    LoginPage.prototype.addToken = function (t, id) {
        this.afd.list(this.firestore).push({
            restaurantId: id,
            devtoken: t
        }).then(function () {
            console.log('Token stored');
        });
    };
    LoginPage.prototype.updateToken = function (key, t) {
        this.afd.list(this.firestore).update(key, { devtoken: t }).then(function () {
            console.log('Token Updated');
        });
    };
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-login',template:/*ion-inline-start:"D:\Apps\Owner App\src\pages\login\login.html"*/'<ion-content padding [ngStyle]="{\'background-image\': \'url(assets/imgs/bg.jpg)\'}">\n\n\n\n  <ion-row>\n\n    <ion-col col-12 class="padding5rem-2rem">\n\n      <img src="assets/imgs/MealDaay-small.png" class="logo">\n\n    </ion-col>\n\n  </ion-row>\n\n\n\n  <ion-list no-margin>\n\n    <form role="form" [formGroup]="loginForm" (ngSubmit)="doLogin()">\n\n    <ion-item>\n\n    <ion-label floating>Email</ion-label>\n\n    <ion-input autocapitalize="off" type="text" formControlName="username"></ion-input>\n\n    </ion-item>\n\n    <div *ngIf="formErrors.username" class="alert alert-danger mt-2">\n\n      {{ formErrors.username }}\n\n    </div>\n\n    <ion-item>\n\n    <ion-label floating>Password</ion-label>\n\n    <ion-input type="password" formControlName="password"></ion-input>\n\n    </ion-item> \n\n    <div *ngIf="formErrors.password" class="alert alert-danger mt-2">\n\n      {{ formErrors.password }}\n\n    </div>\n\n    <button ion-button full class="mt-3 themeGreenBg" [disabled]="!loginForm.valid">Login</button>\n\n    </form>\n\n  </ion-list>\n\n\n\n  <ion-row>\n\n    <ion-col col-12 text-center>      \n\n      <a  class="text-light" no-padding padding-horizontal (click)="goToFogetPage()">Forgot Password?</a>\n\n    </ion-col>\n\n    <!-- <ion-col col-4 text-right>\n\n      <a  class="text-light" no-padding padding-horizontal (click)="goToSignupPage()">Sign up</a>\n\n    </ion-col> -->\n\n  </ion-row>\n\n</ion-content>\n\n'/*ion-inline-end:"D:\Apps\Owner App\src\pages\login\login.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_5__services_one_service__["a" /* OneService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_4__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_6_angularfire2_database__["a" /* AngularFireDatabase */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 170:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_three_service__ = __webpack_require__(63);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var HomePage = /** @class */ (function () {
    function HomePage(navCtrl, navParams, threeService, loadingCtrl, toastCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.threeService = threeService;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.orders = { total: [], weekly: [], yesterday: [], today: [], tomarrow: [] };
        var loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();
        if (localStorage.getItem('owner')) {
            this.owner = JSON.parse(localStorage.getItem('owner'));
        }
        this.threeService.getOrders(this.owner._id).subscribe(function (data) {
            if (!data.error) {
                console.log(data.message);
                _this.orders.total = _this.getTotalOrders(data.message);
                _this.orders.today = _this.getTodayOrders(data.message);
                _this.orders.yesterday = _this.getYesterdayOrders(data.message);
                _this.orders.tomarrow = _this.getTomarrowOrders(data.message);
                _this.orders.weekly = _this.getWeeklyOrders(data.message);
                loading.dismiss();
            }
            else {
                loading.dismiss();
                _this.getToast('Something went wrong! Please try again.');
            }
        }, function (err) {
            loading.dismiss();
            _this.getToast('Unale to load data. Please check your Internet connection.');
        });
    }
    HomePage.prototype.getToast = function (msg) {
        var toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'top' //top,middle,bottom
        });
        toast.present();
    };
    HomePage.prototype.getTotalOrders = function (data) {
        return data.length;
    };
    HomePage.prototype.getTomarrowOrders = function (data) {
        return data.filter(function (data) {
            var date1 = new Date(data.ordertiming.create);
            var today = new Date();
            var date2 = new Date(new Date().getFullYear(), today.getMonth(), today.getDate() + 1);
            return date1.toLocaleDateString() == date2.toLocaleDateString();
        }).length;
    };
    HomePage.prototype.getYesterdayOrders = function (data) {
        return data.filter(function (data) {
            var date1 = new Date(data.ordertiming.create);
            var today = new Date();
            var date2 = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
            return date1.toLocaleDateString() == date2.toLocaleDateString();
        }).length;
    };
    HomePage.prototype.getTodayOrders = function (data) {
        return data.filter(function (data) {
            var date1 = new Date(data.ordertiming.create);
            var date2 = new Date();
            return date1.toLocaleDateString() == date2.toLocaleDateString();
        }).length;
    };
    HomePage.prototype.getWeeklyOrders = function (data) {
        var today = new Date();
        var lastweek = new Date(new Date().getFullYear(), today.getMonth(), today.getDate() - 7);
        var weeklyData = [];
        data.forEach(function (item) {
            var date1 = new Date(item.ordertiming.create);
            if (date1.toLocaleDateString() >= lastweek.toLocaleDateString() && date1.toLocaleDateString() <= today.toLocaleDateString()) {
                weeklyData.push(data);
            }
        });
        return weeklyData.length;
    };
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"D:\Apps\Owner App\src\pages\home\home.html"*/'<ion-header>\n  <ion-navbar color="secondary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Home</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content no-padding>\n  \n  <ion-row class="homeMainRows">\n    <ion-slides pager initialSlide="1">\n      <ion-slide>\n        <ion-row text-center>\n          <ion-col col-12 text-center>\n            <div class="circle bg-success"><span>{{orders.yesterday}}</span></div>\n            <h4>Yesterday order</h4>\n          </ion-col>\n        </ion-row>\n      </ion-slide>\n      <ion-slide>\n        <ion-row text-center>\n          <ion-col col-12 text-center>\n            <div class="circle bg-success"><span>{{orders.today}}</span></div>\n            <h4>Today order</h4>\n          </ion-col>\n        </ion-row>\n      </ion-slide>\n      <ion-slide>\n        <ion-row text-center>\n          <ion-col col-12 text-center>\n            <div class="circle bg-success"><span>{{orders.tomarrow}}</span></div>\n            <h4>Tomorrow order</h4>\n          </ion-col>\n        </ion-row>\n      </ion-slide>\n    </ion-slides> \n  </ion-row>\n\n  <ion-row class="homeMainRows">\n    <ion-col col-12 text-center>\n      <div class="circle bg-success"><span>{{orders.weekly}}</span></div>\n      <h4>Weekly order</h4>\n    </ion-col>\n  </ion-row>\n  \n  <ion-row class="homeMainRows">\n    <ion-col col-12 text-center>\n      <div class="circle bg-success"><span>{{orders.total}}</span></div>\n      <h4>Total order</h4>\n    </ion-col>\n  </ion-row>\n\n</ion-content>\n'/*ion-inline-end:"D:\Apps\Owner App\src\pages\home\home.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__services_three_service__["a" /* ThreeService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 181:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 181;

/***/ }),

/***/ 225:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 225;

/***/ }),

/***/ 271:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FilterPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var FilterPage = /** @class */ (function () {
    function FilterPage(navCtrl, navParams, viewCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.filterObj = {};
        this.paymentType = navParams.get('paymentType');
        this.statusType = navParams.get('statusType');
    }
    FilterPage.prototype.choose = function (type) {
        console.log(type);
    };
    FilterPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    FilterPage.prototype.doFilter = function (type) {
        if (type == 'reset') {
            delete this.paymentType;
            delete this.statusType;
            /*this.filterObj = {};*/
        }
        else {
            // if (typeof this.paymentType != 'undefined') {
            //   this.filterObj['paymentType'] = this.paymentType;
            // }
            if (typeof this.statusType != 'undefined') {
                this.filterObj['statusType'] = this.statusType;
            }
            this.viewCtrl.dismiss(this.filterObj);
        }
    };
    FilterPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-filter',template:/*ion-inline-start:"D:\Apps\Owner App\src\pages\filter\filter.html"*/'<ion-header>\n  <ion-toolbar color="secondary">\n    <ion-buttons start float-right>\n      <button ion-button icon-only  (click)="dismiss()">\n        Cancel\n      </button>\n    </ion-buttons>\n    <ion-title>Filter</ion-title>\n  \n    \n   \n  </ion-toolbar>\n</ion-header>\n\n\n<ion-content padding-no>\n  <!-- <ion-list radio-group [(ngModel)]="viewType">\n    <ion-list-header no-margin>\n      View\n    </ion-list-header>\n      <ion-item>\n        <ion-label>Ascending</ion-label>\n        <ion-radio value="ascending"></ion-radio>\n      </ion-item>\n      \n      <ion-item>\n        <ion-label>Descending</ion-label>\n        <ion-radio value="descending"></ion-radio>\n      </ion-item>\n  </ion-list> -->\n  <!-- <ion-list radio-group [(ngModel)]="paymentType" (ionChange) = "choose(\'paymentType\')">\n    <ion-list-header no-margin>\n      Choose Payment Type\n    </ion-list-header> -->\n  \n    <!-- <ion-item>\n      <ion-label>Any</ion-label>\n      <ion-radio value="any" ></ion-radio>\n    </ion-item> -->\n  \n    <!-- <ion-item>\n      <ion-label>Cash</ion-label>\n      <ion-radio value="cash"></ion-radio>\n    </ion-item>\n  \n    <ion-item>\n      <ion-label>Card</ion-label>\n      <ion-radio value="card"></ion-radio>\n    </ion-item>\n  </ion-list> -->\n\n\n\n  <ion-list radio-group [(ngModel)]="statusType" (ionChange) = "choose(\'statusType\')">\n    <ion-list-header no-margin>\n      Choose Status\n    </ion-list-header>\n  \n    <!-- <ion-item>\n      <ion-label>Any</ion-label>\n      <ion-radio value="any" ></ion-radio>\n    </ion-item> -->\n    <ion-item>\n      <ion-label>Received</ion-label>\n      <ion-radio value="received"></ion-radio>\n    </ion-item>\n    <ion-item>\n      <ion-label>Accepted</ion-label>\n      <ion-radio value="accepted"></ion-radio>\n    </ion-item>\n    <ion-item>\n      <ion-label>Rejected</ion-label>\n      <ion-radio value="rejected"></ion-radio>\n    </ion-item>\n    <ion-item>\n      <ion-label>Driver Accepted</ion-label>\n      <ion-radio value="driveraccepted"></ion-radio>\n    </ion-item>\n    <!-- <ion-item>\n      <ion-label>No Driver Accepted Yet</ion-label>\n      <ion-radio value="driverrejected"></ion-radio>\n    </ion-item> -->\n    <ion-item>\n      <ion-label>Order on the Way</ion-label>\n      <ion-radio value="ontheway"></ion-radio>\n    </ion-item>\n    <ion-item>\n      <ion-label>Delivered</ion-label>\n      <ion-radio value="delivered"></ion-radio>\n    </ion-item>\n\n\n  </ion-list>\n</ion-content>\n\n<ion-footer no-shadow >\n  <ion-toolbar position="bottom">\n    <ion-grid no-padding>\n      <ion-row>\n        <ion-col col-6 no-padding>\n          <button padding ion-button  full color="light" position="bottom"  icon-only (click)="doFilter(\'reset\')">Reset</button>\n        </ion-col>\n        <ion-col col-6 no-padding>\n          <button padding ion-button position="bottom" full color="secondary" icon-only (click)="doFilter(\'apply\')">Apply</button>\n        </ion-col>\n      </ion-row>\n    </ion-grid>\n  </ion-toolbar>\n</ion-footer>\n\n'/*ion-inline-end:"D:\Apps\Owner App\src\pages\filter\filter.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["w" /* ViewController */]])
    ], FilterPage);
    return FilterPage;
}());

//# sourceMappingURL=filter.js.map

/***/ }),

/***/ 272:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustomersDetailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_three_service__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__order_order__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_global__ = __webpack_require__(35);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var CustomersDetailPage = /** @class */ (function () {
    function CustomersDetailPage(navCtrl, navParams, threeService, loadingCtrl, toastCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.threeService = threeService;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.imageURL = __WEBPACK_IMPORTED_MODULE_4__services_global__["c" /* url1 */] + 'uploads/';
        var loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();
        if (navParams.get("customerOrderData")) {
            this.customerDetail = navParams.get("customerOrderData");
        }
        this.threeService.getCustomersOrdersList(this.customerDetail._id).subscribe(function (data) {
            console.log(data.message);
            if (!data.error) {
                _this.customerOrders = data.message;
                loading.dismiss();
            }
            else {
                _this.customerOrders = [];
                loading.dismiss();
            }
        }, function (err) {
            _this.customerOrders = [];
            loading.dismiss();
            _this.getToast('Unable to load data. Please check your Internet connection');
        });
    }
    CustomersDetailPage.prototype.getToast = function (msg) {
        var toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'top' //top,middle,bottom
        });
        toast.present();
    };
    CustomersDetailPage.prototype.openOrderDetail = function (id) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__order_order__["a" /* OrderDetailPage */], {
            orderData: this.customerOrders[id]
        });
        /*this.navCtrl.push(CustomersOrderDetailPage,{
          CustomersOrderDetail: this.customerOrders[id],
          CustomersDetail: this.customerDetail
        }); */
    };
    CustomersDetailPage.prototype.customerImage = function (img) {
        var imgPath;
        if (typeof img == 'undefined' || img == null) {
            imgPath = "assets/imgs/profile.png";
        }
        else {
            imgPath = this.imageURL + img;
        }
        return imgPath;
    };
    CustomersDetailPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-customers-detail',template:/*ion-inline-start:"D:\Apps\Owner App\src\pages\customers\customers-detail.html"*/'<ion-header>\n\n    <ion-navbar color="secondary">\n\n        <button ion-button menuToggle>\n\n            <ion-icon name="menu"></ion-icon>\n\n        </button>\n\n        <ion-title>Customer Detail</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n<ion-content no-padding>\n\n\n\n    <ion-row>\n\n        <ion-col col-12 text-center>\n\n            <img style="object-fit:cover" class="profile-img rounded-circle" [src]="customerImage(customerDetail.profilePic)">\n\n        </ion-col>\n\n    </ion-row>\n\n  \n\n    <ion-list class="mb-0">\n\n        <ion-item *ngIf = "customerDetail.firstname" class="text-muted text-capitize">\n\n            <ion-icon name="person" item-start></ion-icon>\n\n            {{customerDetail.firstname}} {{customerDetail.lastname}}\n\n        </ion-item>\n\n        <ion-item class="text-muted">\n\n            <ion-icon name="mail" item-start></ion-icon>\n\n             {{customerDetail.email}}\n\n        </ion-item>\n\n        <ion-item *ngIf = "customerDetail.cellphone" class="text-muted">\n\n            <ion-icon name="call" item-start></ion-icon>\n\n             {{customerDetail.cellphone}}\n\n        </ion-item>\n\n        <ion-item *ngIf = "customerDetail.homephone" class="text-muted">\n\n            <ion-icon name="home" item-start></ion-icon>\n\n             {{customerDetail.homephone}}\n\n        </ion-item>\n\n    </ion-list>\n\n\n\n    <hr class="m-0">\n\n    \n\n    <div class="orders py-3 bg-success" >\n\n        <div class="container">\n\n            <div class="row">\n\n                <div class="col-12">\n\n                    <h4 class=" m-0 text-white">Orders</h4>\n\n                </div>\n\n            </div>\n\n        </div>\n\n    </div>\n\n\n\n    <div class="listing" *ngIf="customerOrders">\n\n        <ion-list>\n\n            <ion-item *ngFor="let customerOrder of customerOrders; index as i" (click)="openOrderDetail(i)">\n\n                <h2><ion-icon name="pizza"></ion-icon> &nbsp; #{{customerOrder._id.substr(18,6)}}</h2>\n\n                <ion-row *ngIf="customerOrder.status == \'received\' "><strong text-capitalize> Payment Received </strong></ion-row>\n\n                <ion-row *ngIf="customerOrder.status == \'accepted\'"><strong text-capitalize>Preparing Order</strong></ion-row>\n\n                <ion-row *ngIf="customerOrder.status == \'rejected\'"><strong text-capitalize>Order Rejected</strong></ion-row>\n\n                <ion-row *ngIf="customerOrder.status == \'ontheway\'"><strong text-capitalize>On the way</strong></ion-row>\n\n                <ion-row *ngIf="customerOrder.status == \'delivered\'"><strong text-capitalize>Delivered</strong></ion-row>\n\n                <ion-row *ngIf="customerOrder.status == \'driveraccepted\'"><strong  text-capitalize>Driver Accepted</strong></ion-row>\n\n                \n\n                \n\n                \n\n                <!-- <ion-row *ngIf="customerOrder.status == \'received\'  "><strong text-capitalize> Payment Received </strong></ion-row>\n\n                <ion-row *ngIf="customerOrder.status == \'accepted\'"><strong text-capitalize>Preparing Order</strong></ion-row>\n\n                <ion-row *ngIf="customerOrder.status == \'rejected\'"><strong text-capitalize>Order Rejected</strong></ion-row>\n\n                <ion-row *ngIf="customerOrder.status == \'driveraccepted\'"><strong  text-capitalize>Driver Accepted</strong></ion-row>\n\n        <ion-row *ngIf="customerOrder.status == \'ontheway\'"><strong  text-capitalize>On the way</strong></ion-row>\n\n                <ion-row *ngIf="customerOrder.status == \'delivered\'"><strong text-capitalize>Delivered</strong></ion-row> -->\n\n           \n\n                <ion-row>\n\n                <ion-icon name="time"></ion-icon> &nbsp; {{customerOrder.ordertiming.create| date:\'medium\'}}\n\n                </ion-row>\n\n\n\n                <!-- <button ion-button clear item-end color="secondary">View</button> -->\n\n            </ion-item>\n\n        </ion-list>\n\n    </div>\n\n\n\n</ion-content>'/*ion-inline-end:"D:\Apps\Owner App\src\pages\customers\customers-detail.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__services_three_service__["a" /* ThreeService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */]])
    ], CustomersDetailPage);
    return CustomersDetailPage;
}());

//# sourceMappingURL=customers.js.map

/***/ }),

/***/ 273:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FourService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__global__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var FourService = /** @class */ (function () {
    function FourService(http) {
        this.http = http;
    }
    FourService.prototype.getCustomers = function (id) {
        return this.http.get(__WEBPACK_IMPORTED_MODULE_2__global__["f" /* url4 */] + 'customers/' + id).map(function (response) { return response.json(); });
    };
    FourService.prototype.getCustomersOrders = function (data) {
        return this.http.post(__WEBPACK_IMPORTED_MODULE_2__global__["f" /* url4 */] + 'customers/multiple', data).map(function (response) { return response.json(); });
    };
    FourService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
    ], FourService);
    return FourService;
}());

//# sourceMappingURL=four.service.js.map

/***/ }),

/***/ 35:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export imageUrl1 */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return imageUrlupload; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return imageUrl; });
/* unused harmony export imageUrl2 */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return url2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return url1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return url4; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return url3; });
// export const imageUrlupload: string = 'https://mealdaay.com:4024/uploads';
// export const url1: string = 'https://mealdaay.com:4014/';
// export const url2: string = 'https://mealdaay.com:4004/';
// export const url3: string = 'https://mealdaay.com:4044/';
// export const url4: string = 'https://mealdaay.com:4034/';
// export const frontUrl: string = 'https://104.236.69.166:3000/';
// export const imageUrl: string = 'https://mealdaay.com:4024/uploads/';
// export const imageUrlupload: string = 'http://138.197.174.35:4024/uploads/';
// export const imageUrl: string = 'http://138.197.174.35:4024/uploads/';
// export const imageUrl2: string = 'http://138.197.174.35:4004/uploads/';
// export const url1: string = 'http://138.197.174.35:4014/';
// export const url2: string = 'http://138.197.174.35:4004/';
// export const url3: string = 'http://138.197.174.35:4044/';
// export const url4: string = 'http://138.197.174.35:4034/';
// export const imageUrl1: string = 'http://165.22.235.48:4014/uploads/';
// export const imageUrlupload: string = 'http://165.22.235.48:4024/upload';
// export const imageUrl: string = 'http://165.22.235.48:4024/uploads/';
// export const imageUrl2: string = 'http://165.22.235.48:4004/uploads/';
// export const url2: string = 'http://165.22.235.48:4004/';
// export const url1: string = 'http://165.22.235.48:4014/';
// export const url2: string = 'http://165.22.235.48:4024/';
// export const url4: string = 'http://165.22.235.48:4034/';
// export const url3: string = 'http://165.22.235.48:4044/';
var imageUrl1 = 'https://www.caterdaay.com:4014/uploads/';
var imageUrlupload = 'https://www.caterdaay.com:4024/upload';
var imageUrl = 'https://www.caterdaay.com:4024/uploads/';
var imageUrl2 = 'https://www.caterdaay.com:4004/uploads/';
var url2 = 'https://www.caterdaay.com:4004/';
var url1 = 'https://www.caterdaay.com:4014/';
// export const url2: string = 'http://165.22.235.48:4024/';
var url4 = 'https://www.caterdaay.com:4034/';
var url3 = 'https://www.caterdaay.com:4044/';
// export const imageUrl1: string = 'http://172.16.201.151:4014/uploads/';
// export const imageUrlupload: string = 'http://172.16.201.151:4024/upload';
// export const imageUrl: string = 'http://172.16.201.151:4024/uploads/';
// export const imageUrl2: string = 'http://172.16.201.151:4004/uploads/';
// export const url2: string = 'http://172.16.201.151:4004/';
// export const url1: string = 'http://172.16.201.151:4014/';
// export const url2: string = 'http://165.22.235.48:4024/';
// export const url4: string = 'http://172.16.201.151:4034/';
// export const url3: string = 'http://172.16.201.151:4044/'; 
//# sourceMappingURL=global.js.map

/***/ }),

/***/ 374:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return ProfilePage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ProfileEditPage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChangePasswordPage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return ViewIdsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_global__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_one_service__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_two_service__ = __webpack_require__(166);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ionic_img_viewer__ = __webpack_require__(375);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_file_transfer__ = __webpack_require__(378);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_camera__ = __webpack_require__(379);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__services_global__ = __webpack_require__(35);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var ProfilePage = /** @class */ (function () {
    function ProfilePage(navCtrl, navParams, loadingCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.imageURL = __WEBPACK_IMPORTED_MODULE_9__services_global__["a" /* imageUrl */];
        if (localStorage.getItem('owner')) {
            this.restaurant = JSON.parse(localStorage.getItem('owner'));
            this.owner = JSON.parse(localStorage.getItem('owner'))['ownerId'];
            setTimeout(function () {
                _this.loadMap();
            }, 1000);
        }
    }
    ProfilePage.prototype.ownerImage = function (img) {
        var imgPath;
        if (typeof img == 'undefined' || img == null) {
            imgPath = "assets/imgs/profile.png";
        }
        else {
            imgPath = this.imageURL + img;
        }
        return imgPath;
    };
    ProfilePage.prototype.ionViewDidLoad = function () { };
    ProfilePage.prototype.loadMap = function () {
        var options = {
            center: new google.maps.LatLng(this.restaurant.lat, this.restaurant.lng),
            zoom: 12
        };
        var map = new google.maps.Map(document.getElementById("map"), options);
        this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(this.restaurant.lat, this.restaurant.lng),
            map: map
        });
    };
    ProfilePage.prototype.goToPassword = function () {
        this.navCtrl.push(ChangePasswordPage);
    };
    ProfilePage.prototype.goToEdit = function () {
        this.navCtrl.push(ProfileEditPage);
    };
    ProfilePage.prototype.doLogout = function () {
    };
    ProfilePage.prototype.viewIds = function () {
        this.navCtrl.push(ViewIdsPage);
    };
    ProfilePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-profile',template:/*ion-inline-start:"D:\Apps\Owner App\src\pages\profile\profile.html"*/'<ion-header>\n\n  <ion-navbar color="secondary">\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Profile</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content no-padding>\n\n  <div *ngIf="owner">\n\n    <!-- <div class="jumbotron py-5 mb-0 h-90px bg-success rounded-0">\n\n    </div>\n\n    <ion-row class="profile-area borderb-1">\n\n      <ion-col col-12 text-center>\n\n        <img class="profile-img rounded-circle" [src]="ownerImage(owner.image)">\n\n      </ion-col>\n\n    </ion-row> -->\n\n    <h3 padding-horizontal class="text-capitalize" ion-text color="dark">{{owner.ownerfirstname}} {{owner.ownerlastname}}</h3>\n\n    <h4 padding-horizontal text-capitalize ion-text color="dark" *ngIf = "restaurant && restaurant.restaurantname">Owner At : <strong>{{restaurant.restaurantname}}</strong></h4>\n\n    <ion-grid>\n\n    \n\n    <ion-row class="borderb-1 py-2">\n\n      <ion-col col-4>\n\n        <h5 ion-text color="dark" no-margin>\n\n          <ion-icon name="person"></ion-icon> &nbsp; Username </h5>\n\n      </ion-col>\n\n      <ion-col col-8 text-right>\n\n        <h5 ion-text color="gray" no-margin>{{owner.username}}</h5>\n\n      </ion-col>\n\n    </ion-row>\n\n    <ion-row class="borderb-1 py-2">\n\n      <ion-col col-4>\n\n        <h5 ion-text color="dark" no-margin>\n\n          <ion-icon name="mail"></ion-icon> &nbsp; Email </h5>\n\n      </ion-col>\n\n      <ion-col col-8 text-right>\n\n        <h5 ion-text color="gray" no-margin>{{owner.email}}</h5>\n\n      </ion-col>\n\n    </ion-row>\n\n    <ion-row class="borderb-1 py-2">\n\n      <ion-col col-4>\n\n        <h5 ion-text color="dark" no-margin>\n\n          <ion-icon name="call"></ion-icon> &nbsp; Mobile No. </h5>\n\n      </ion-col>\n\n      <ion-col col-8 text-right>\n\n        <h5 ion-text color="gray" no-margin>{{owner.ownerphoneno}}</h5>\n\n      </ion-col>\n\n    </ion-row>\n\n    <ion-row class="borderb-1 py-2">\n\n      <ion-col col-4>\n\n        <h5 ion-text color="dark" no-margin>\n\n          <ion-icon name="stats"></ion-icon> &nbsp; Ponits </h5>\n\n      </ion-col>\n\n      <ion-col col-8 text-right>\n\n        <h5 ion-text color="gray" no-margin>{{owner.ownerpoints}}</h5>\n\n      </ion-col>\n\n    </ion-row>\n\n    <!-- <ion-row class="borderb-1 py-2" (click)="viewIds()">\n\n      <ion-col col-8>\n\n        <h5 ion-text color="dark" no-margin>\n\n        <ion-icon name="images"></ion-icon> &nbsp; Government Id </h5>\n\n      </ion-col>\n\n      <ion-col col-4 text-right>  \n\n        <ion-icon name="arrow-forward" color="gray"></ion-icon>\n\n      </ion-col>\n\n    </ion-row> -->\n\n    <ion-row class="borderb-1 py-2">\n\n      <ion-col col-4>\n\n        <h5 ion-text color="dark" no-margin>\n\n          <ion-icon name="pin"></ion-icon> &nbsp;Owner Address </h5>\n\n      </ion-col>\n\n      <ion-col col-8 text-right>\n\n        <h5 ion-text color="gray" no-margin>{{owner.owneraddress}}</h5>\n\n      </ion-col>\n\n    </ion-row>\n\n    <ion-row class="borderb-1 py-2">\n\n      <ion-col col-4>\n\n        <h5 ion-text color="dark" no-margin>\n\n          <ion-icon name="pin"></ion-icon> &nbsp;Chef/Cater Location </h5>\n\n      </ion-col>\n\n      <ion-col col-8 text-right>\n\n        <h5 ion-text color="gray" no-margin>{{restaurant.address}}</h5>\n\n      </ion-col>\n\n      <ion-col col-12>\n\n        <div id="map" style="width:100%;height:200px;background:gainsboro"></div>\n\n      </ion-col>\n\n    </ion-row>\n\n    <ion-row class="mt-3">\n\n      <ion-col col-12>\n\n        <button ion-button color="secondary" full (click)="goToPassword()">Change Password</button>\n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-grid>\n\n  </div>\n\n \n\n</ion-content>\n\n'/*ion-inline-end:"D:\Apps\Owner App\src\pages\profile\profile.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* LoadingController */]])
    ], ProfilePage);
    return ProfilePage;
}());

// edit profile component
var ProfileEditPage = /** @class */ (function () {
    function ProfileEditPage(navCtrl, navParams, lf, oneService, loadingCtrl, toastCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.lf = lf;
        this.oneService = oneService;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.imageURL = __WEBPACK_IMPORTED_MODULE_9__services_global__["a" /* imageUrl */];
        this.phoneRegex = /^[+]?\d+(\.\d+)?$/;
        this.emailp = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        this.formErrors = {
            'username': '',
            'email': '',
            'ownerfirstname': '',
            'ownerlastname': '',
            'ownerphoneno': ''
        };
        this.validationMessages = {
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
        this.editForm = this.lf.group({
            _id: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required],
            username: ['', [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].minLength(4), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(64), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern('[a-zA-Z ]*')]],
            ownerfirstname: ['', [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required]],
            ownerlastname: ['', [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required]],
            email: ['', [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern(this.emailp)]],
            ownerphoneno: ['', [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern(this.phoneRegex)]],
            owneraddress: ['']
        });
        if (JSON.parse(localStorage.getItem('owner'))) {
            this.owner = JSON.parse(localStorage.getItem('owner'))['ownerId'];
            this.editForm.patchValue(this.owner);
        }
        this.editForm.valueChanges.subscribe(function (data) { return _this.onValueChanged(data); });
        this.onValueChanged();
    }
    ProfileEditPage.prototype.ionViewDidLoad = function () {
        this.EditMap();
    };
    ProfileEditPage.prototype.ownerImage = function (img) {
        var imgPath;
        if (img != null) {
            imgPath = this.imageURL + img;
        }
        if (typeof img == 'undefined' || img == null) {
            imgPath = "assets/imgs/profile.png";
        }
        return imgPath;
    };
    ProfileEditPage.prototype.EditMap = function () {
        var _this = this;
        this.geocoder = new google.maps.Geocoder();
        if (this.geocoder) {
            this.geocoder.geocode({ 'address': this.editForm.controls.owneraddress.value }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    _this.editlat = results[0].geometry.location.lat();
                    _this.editlng = results[0].geometry.location.lng();
                    var options = {
                        center: new google.maps.LatLng(_this.editlat, _this.editlng),
                        zoom: 12
                    };
                    var map = new google.maps.Map(document.getElementById("editmap"), options);
                    _this.marker = new google.maps.Marker({
                        position: new google.maps.LatLng(_this.editlat, _this.editlng),
                        map: map,
                        draggable: true
                    });
                    google.maps.event.addListener(_this.marker, 'dragend', function (event) {
                        _this.latlng = new google.maps.LatLng(_this.marker.position.lat(), _this.marker.position.lng());
                        _this.geocoder.geocode({ 'latLng': _this.latlng }, function (results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                _this.editForm.controls['owneraddress'].setValue(results[0].formatted_address);
                            }
                        });
                    });
                }
            });
        }
    };
    ProfileEditPage.prototype.onValueChanged = function (data) {
        if (!this.editForm) {
            return;
        }
        var form = this.editForm;
        for (var field in this.formErrors) {
            this.formErrors[field] = '';
            var control = form.get(field);
            if (control && control.dirty && !control.valid) {
                var messages = this.validationMessages[field];
                for (var key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    };
    ProfileEditPage.prototype.profileUpdate = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();
        this.oneService.editOwner(this.editForm.value).subscribe(function (data) {
            if (!data.error) {
                localStorage.removeItem('owner');
                localStorage.setItem('owner', JSON.stringify(data.message));
                loading.dismiss();
                _this.getToast('Profile updated successfully.');
                _this.navCtrl.pop();
            }
            else {
                _this.getToast(data.message);
            }
        });
    };
    ProfileEditPage.prototype.getToast = function (msg) {
        var toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'top' //top,middle,bottom
        });
        toast.present();
    };
    ProfileEditPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-profile-edit',template:/*ion-inline-start:"D:\Apps\Owner App\src\pages\profile\profile-edit.html"*/'<ion-header>\n\n    <ion-navbar color="secondary">\n\n        <button ion-button menuToggle>\n\n            <ion-icon name="menu"></ion-icon>\n\n        </button>\n\n        <ion-title>Edit Profile</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n<ion-content no-padding>\n\n    <ion-row class="profile-area borderb-1">\n\n        <ion-col col-12 text-center>\n\n            <img style="object-fit:cover" class="profile-img rounded-circle" [src]="ownerImage(owner.image)">\n\n            <br>\n\n            <!-- <button ion-button color="secondary" small outline class="mt-4">Change</button> -->\n\n        </ion-col>\n\n    </ion-row>\n\n    <ion-list>\n\n	<form [formGroup]="editForm" (ngSubmit)="profileUpdate()" >\n\n        <ion-item>\n\n            <ion-label floating>Username</ion-label>\n\n            <ion-input type="text" formControlName="username" disabled></ion-input>\n\n        </ion-item>\n\n        <div *ngIf="formErrors && formErrors.username" margin-horizontal class="alert alert-danger mt-3">\n\n            {{ formErrors.username }}\n\n        </div>\n\n        <ion-item>\n\n            <ion-label floating>First Name</ion-label>\n\n            <ion-input type="text" formControlName="ownerfirstname"></ion-input>\n\n        </ion-item>\n\n        <div *ngIf="formErrors && formErrors.ownerfirstname" margin-horizontal class="alert alert-danger mt-3 ">\n\n            {{ formErrors.ownerfirstname }}\n\n        </div>\n\n        <ion-item>\n\n            <ion-label floating>Last Name</ion-label>\n\n            <ion-input type="text" formControlName="ownerlastname"></ion-input>\n\n        </ion-item>\n\n        <div *ngIf="formErrors && formErrors.ownerlastname" margin-horizontal class="alert alert-danger mt-3">\n\n            {{ formErrors.ownerlastname }}\n\n        </div>\n\n        <ion-item>\n\n            <ion-label floating>Eamil</ion-label>\n\n            <ion-input type="text" formControlName="email" disabled></ion-input>\n\n        </ion-item>\n\n        <div *ngIf="formErrors && formErrors.email" margin-horizontal class="alert alert-danger mt-3">\n\n            {{ formErrors.email }}\n\n        </div>\n\n        <ion-item>\n\n            <ion-label floating>Mobile No.</ion-label>\n\n            <ion-input type="text" formControlName="ownerphoneno" ></ion-input>\n\n        </ion-item>\n\n        <div *ngIf="formErrors && formErrors.ownerphoneno" margin-horizontal class="alert alert-danger mt-3">\n\n            {{ formErrors.ownerphoneno }}\n\n        </div>\n\n        <ion-item>\n\n            <ion-label floating>Address</ion-label>\n\n            <ion-textarea  rows="4" formControlName="owneraddress"></ion-textarea>\n\n        </ion-item>\n\n        <ion-col >\n\n            <div id="editmap" class="mb-4" style="width:100%;height:200px;background:gainsboro"></div>\n\n        </ion-col>\n\n        <button ion-button color="secondary" class="bottom-fixed" full [disabled]="!editForm.valid">Save</button>\n\n</form>\n\n    </ion-list>\n\n</ion-content>'/*ion-inline-end:"D:\Apps\Owner App\src\pages\profile\profile-edit.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_4__services_one_service__["a" /* OneService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */]])
    ], ProfileEditPage);
    return ProfileEditPage;
}());

// change password
var ChangePasswordPage = /** @class */ (function () {
    function ChangePasswordPage(navCtrl, navParams, twoService, oneService, loadingCtrl, toastCtrl, lf) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.twoService = twoService;
        this.oneService = oneService;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.lf = lf;
        this.formErrors = {
            'password': ''
        };
        this.validationMessages = {
            'password': {
                'required': 'Password is required.'
            }
        };
        this.passwordForm = this.lf.group({
            _id: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required],
            oldpassword: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required],
            password: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required],
            confirmpassword: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required],
            matchpass: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required],
            oldmatch: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required]
        });
        this.fulldetail = JSON.parse(localStorage.getItem('owner'));
        this.passwordForm.controls["_id"].setValue(this.fulldetail._id);
        this.twoService.getComplexity().subscribe(function (data) {
            if (!data.error) {
                _this.passwordp = data.message[0].ownerpasscomplexity.regex;
                _this.setpasswordmessage(data.message[0].ownerpasscomplexity.name);
                _this.passwordForm.valueChanges.subscribe(function (data) { return _this.onValueChanged(data); });
                _this.onValueChanged();
            }
        });
    }
    ChangePasswordPage.prototype.oldpassword = function () {
        if (this.fulldetail.ownerId.password == this.passwordForm.value.oldpassword) {
            this.passwordForm.controls["oldmatch"].setValue(true);
            this.oldmatch = false;
        }
        else {
            this.passwordForm.controls["oldmatch"].setValue("");
            this.oldmatch = true;
        }
    };
    ChangePasswordPage.prototype.matchpassword = function (type) {
        if (type == 'match') {
            if (this.passwordForm.value.password != '') {
                if (this.passwordForm.value.password == this.passwordForm.value.confirmpassword) {
                    this.passwordForm.controls["matchpass"].setValue(true);
                    this.MutchPassword = false;
                }
                else {
                    this.passwordForm.controls["matchpass"].setValue("");
                    this.MutchPassword = true;
                }
            }
        }
        else {
            if (this.passwordForm.value.confirmpassword != '') {
                if (this.passwordForm.value.password == this.passwordForm.value.confirmpassword) {
                    this.passwordForm.controls["matchpass"].setValue(true);
                    this.MutchPassword = false;
                }
                else {
                    this.passwordForm.controls["matchpass"].setValue("");
                    this.MutchPassword = true;
                }
            }
        }
    };
    ChangePasswordPage.prototype.setpasswordmessage = function (name) {
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
    };
    ChangePasswordPage.prototype.onValueChanged = function (data) {
        if (!this.passwordForm) {
            return;
        }
        var form = this.passwordForm;
        for (var field in this.formErrors) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            var control = form.get(field);
            if (control && control.dirty && !control.valid) {
                var messages = this.validationMessages[field];
                for (var key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    };
    ChangePasswordPage.prototype.passwordUpdate = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();
        var obj = { _id: this.fulldetail.ownerId._id, password: this.passwordForm.value.password };
        this.oneService.passwordEditOwner(obj).subscribe(function (data) {
            if (!data.error) {
                localStorage.removeItem('owner');
                localStorage.setItem('owner', JSON.stringify(data.message));
                loading.dismiss();
                _this.getToast('Password updated successfully.');
                _this.navCtrl.pop();
            }
            else {
                loading.dismiss();
                _this.getToast(data.message);
            }
        }, function (err) {
            loading.dismiss();
            _this.getToast('Unable to load data. Please check your Internet connection.');
        });
    };
    ChangePasswordPage.prototype.getToast = function (msg) {
        var toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'top' //top,middle,bottom
        });
        toast.present();
    };
    ChangePasswordPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-change-password',template:/*ion-inline-start:"D:\Apps\Owner App\src\pages\profile\change-password.html"*/'<ion-header>\n\n    <ion-navbar color="secondary">\n\n        <button ion-button menuToggle>\n\n            <ion-icon name="menu"></ion-icon>\n\n        </button>\n\n        <ion-title>Change Password</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n<ion-content no-padding>\n\n    <!-- <ion-list *ngIf="passwordp"> -->\n\n    <form [formGroup]="passwordForm" (ngSubmit)="passwordUpdate()">\n\n        <ion-item>\n\n            <ion-label floating>Old Password</ion-label>\n\n            <ion-input type="text" formControlName="oldpassword" (change)="oldpassword()"></ion-input>\n\n        </ion-item>\n\n        <div *ngIf="oldmatch" class="alert alert-danger mt-3" margin-horizontal>\n\n            Old Password not matching!\n\n        </div>\n\n        <ion-item>\n\n            <ion-label floating>New Password</ion-label>\n\n            <ion-input type="password" formControlName="password" [pattern]="passwordp" (keyup)="matchpassword(\'pass\')"></ion-input>\n\n        </ion-item>\n\n        <div *ngIf="formErrors.password" class="alert alert-danger mt-3" margin-horizontal > \n\n            {{ formErrors.password }}\n\n        </div>\n\n        <ion-item>\n\n            <ion-label floating>Confirm Password</ion-label>\n\n            <ion-input type="password" [pattern]="passwordp" formControlName="confirmpassword" (keyup)="matchpassword(\'match\')"></ion-input>\n\n        </ion-item>\n\n            \n\n            <div class="alert alert-danger mt-3" margin-horizontal *ngIf="MutchPassword">Password not match</div>\n\n            <button ion-button color="secondary" class="bottom-fixed" full [disabled]="!passwordForm.valid">Change Password</button>\n\n    </form>\n\n    \n\n    <!-- </ion-list> -->\n\n</ion-content>\n\n'/*ion-inline-end:"D:\Apps\Owner App\src\pages\profile\change-password.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_5__services_two_service__["a" /* TwoService */],
            __WEBPACK_IMPORTED_MODULE_4__services_one_service__["a" /* OneService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */]])
    ], ChangePasswordPage);
    return ChangePasswordPage;
}());

// view ids
var ViewIdsPage = /** @class */ (function () {
    function ViewIdsPage(navCtrl, navParams, transfer, camera, toastCtrl, loadingCtrl, imageViewerCtrl, platform, actionSheetCtrl, alertCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.transfer = transfer;
        this.camera = camera;
        this.toastCtrl = toastCtrl;
        this.loadingCtrl = loadingCtrl;
        this.imageViewerCtrl = imageViewerCtrl;
        this.platform = platform;
        this.actionSheetCtrl = actionSheetCtrl;
        this.alertCtrl = alertCtrl;
        this.imageUrl = __WEBPACK_IMPORTED_MODULE_3__services_global__["b" /* imageUrlupload */];
        this.governmentIds = JSON.parse(localStorage.getItem('owner')).ownerId.ownergovids;
        this._imageViewerCtrl = imageViewerCtrl;
    }
    ViewIdsPage.prototype.getImage = function () {
        this.presentActionSheet();
    };
    ViewIdsPage.prototype.presentActionSheet = function () {
        var _this = this;
        var actionSheet = this.actionSheetCtrl.create({
            title: 'Upload Government IDs',
            buttons: [
                {
                    text: 'Camera',
                    role: 'destructive',
                    icon: 'camera',
                    handler: function () {
                        _this.takePhoto(1); // 1 for camera
                    }
                }, {
                    text: 'Gallery',
                    role: 'gallery',
                    icon: 'images',
                    handler: function () {
                        _this.takePhoto(0); // 1 for gallery
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    icon: 'close',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    };
    ViewIdsPage.prototype.takePhoto = function (sourceType) {
        var _this = this;
        var options = {
            quality: 100,
            destinationType: this.camera.DestinationType.FILE_URI,
            sourceType: sourceType,
        };
        this.camera.getPicture(options).then(function (imageData) {
            _this.imageURI = imageData;
        }, function (err) {
            console.log(err);
            // Handle error
        });
    };
    ViewIdsPage.prototype.uploadFile = function () {
        var _this = this;
        var loader = this.loadingCtrl.create({
            content: "Uploading..."
        });
        loader.present();
        var fileTransfer = this.transfer.create();
        var options = {
            chunkedMode: false,
            fileKey: 'file',
            fileName: 'filename.jpg',
            params: { operatiune: 'uploadpoza' }
        };
        fileTransfer.upload(this.imageURI, 'https://www.caterdaay.com:4024/upload', options)
            .then(function (data) {
            _this.imageFileName = 'https://www.caterdaay.com:4024/uploads/ionicfile.jpg';
            loader.dismiss();
            _this.presentToast("Image uploaded successfully");
        }).catch(function (err) {
            loader.dismiss();
        });
    };
    ViewIdsPage.prototype.viewImage = function (path) {
        var imgUrl = this.imageUrl + '/' + path;
        var imageViewer = this._imageViewerCtrl.create(imgUrl);
        imageViewer.present();
    };
    ViewIdsPage.prototype.deleteIds = function (id) {
        var toast = this.toastCtrl.create({
            message: id,
            duration: 30000,
            position: 'top' //top,middle,bottom
        });
        toast.present();
    };
    ViewIdsPage.prototype.presentToast = function (msg) {
        var toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    };
    ViewIdsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-view-ids',template:/*ion-inline-start:"D:\Apps\Owner App\src\pages\profile\view-ids.html"*/'<ion-header>\n\n  <ion-navbar color="secondary">\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Goverment Ids</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content no-padding>\n\n  <p>{{imageURI}}</p>\n\n\n\n  <img style="object-fit:cover" [src]="base64Image | safeHtml" *ngIf="base64Image">\n\n\n\n  <button class="m-4" ion-button full color="secondary" (click)="getImage()">Add ID</button>\n\n\n\n  <img style="object-fit:cover" src="{{imageFileName}}" *ngIf="imageFileName" alt="Ionic File" width="300" />\n\n\n\n  <button class="m-4" ion-button full (click)="uploadFile()" >Upload</button>\n\n\n\n  <ion-card *ngFor="let governmentId of governmentIds; let i = index; ">\n\n    <ion-icon name="trash" class="delete-img" (click)="deleteIds(governmentId)"></ion-icon>\n\n    <img style="object-fit:cover" src="{{imageUrl}}/{{governmentId}}" class="idImages" imageViewer />\n\n</ion-card>\n\n</ion-content>\n\n'/*ion-inline-end:"D:\Apps\Owner App\src\pages\profile\view-ids.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_7__ionic_native_file_transfer__["a" /* FileTransfer */],
            __WEBPACK_IMPORTED_MODULE_8__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_6_ionic_img_viewer__["a" /* ImageViewerController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["t" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */]])
    ], ViewIdsPage);
    return ViewIdsPage;
}());

//# sourceMappingURL=profile.js.map

/***/ }),

/***/ 380:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ForgetPasswordPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_one_service__ = __webpack_require__(43);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ForgetPasswordPage = /** @class */ (function () {
    function ForgetPasswordPage(navCtrl, navParams, toastCtrl, lf, oneService, loadingCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.lf = lf;
        this.oneService = oneService;
        this.loadingCtrl = loadingCtrl;
        this.formErrors = {
            'email': ''
        };
        this.validationMessages = {
            'email': {
                'required': 'Email is required.',
                'pattern': 'Invalid Email.'
            }
        };
        this.emailp = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        this.forgetForm = this.lf.group({
            email: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].pattern(this.emailp)]],
        });
        this.forgetForm.valueChanges.subscribe(function (data) { return _this.onValueChanged(data); });
        this.onValueChanged();
    }
    ForgetPasswordPage.prototype.onValueChanged = function (data) {
        if (!this.forgetForm) {
            return;
        }
        var form = this.forgetForm;
        for (var field in this.formErrors) {
            this.formErrors[field] = '';
            var control = form.get(field);
            if (control && control.dirty && !control.valid) {
                var messages = this.validationMessages[field];
                for (var key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    };
    ForgetPasswordPage.prototype.resetPassword = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();
        this.oneService.forgetPasswordOwner(this.forgetForm.value).subscribe(function (data) {
            loading.dismiss();
            if (!data.error) {
                _this.getToast('Reset code sent successfully. Check email address.');
                _this.navCtrl.pop();
            }
            else {
                _this.getToast(data.message);
                _this.forgetForm.reset();
            }
        }, function (err) {
            loading.dismiss();
            _this.getToast('Unable to proceed request. Please check your Internet connection.');
        });
    };
    ForgetPasswordPage.prototype.getToast = function (msg) {
        var toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'top' //top,middle,bottom
        });
        toast.present();
    };
    ForgetPasswordPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-forget-password',template:/*ion-inline-start:"D:\Apps\Owner App\src\pages\forget-password\forget-password.html"*/'<ion-header>\n\n  <ion-navbar color="secondary">\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Forgot Password</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content no-padding [ngStyle]="{\'background-image\': \'url(assets/imgs/bg.jpg)\'}">\n\n\n\n  <div padding class="mt-80">\n\n\n\n    <ion-row>\n\n      <ion-col>\n\n        <img src="assets/imgs/MealDaay-small.png" class="logo h-center ">\n\n      </ion-col>\n\n    </ion-row>\n\n\n\n    <ion-row>\n\n      <ion-col>\n\n        <ion-list no-margin>\n\n          <form role="form" [formGroup]="forgetForm" (ngSubmit)="resetPassword()">\n\n          <ion-item>\n\n            <ion-label floating>Email</ion-label>\n\n            <ion-input type="text" formControlName="email"></ion-input>\n\n          </ion-item>\n\n          <div *ngIf="formErrors.email" class="alert alert-danger mt-2">\n\n            {{ formErrors.email }}\n\n          </div>\n\n          <button ion-button full class="mt-3" color="secondary" [disabled]="!forgetForm.valid">Reset Password</button>\n\n          \n\n          </form>\n\n        </ion-list>\n\n      </ion-col>\n\n    </ion-row>\n\n\n\n  </div>\n\n</ion-content>'/*ion-inline-end:"D:\Apps\Owner App\src\pages\forget-password\forget-password.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_3__services_one_service__["a" /* OneService */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["n" /* LoadingController */]])
    ], ForgetPasswordPage);
    return ForgetPasswordPage;
}());

//# sourceMappingURL=forget-password.js.map

/***/ }),

/***/ 381:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DriversPage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DriversLocationPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_one_service__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_global__ = __webpack_require__(35);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var DriversPage = /** @class */ (function () {
    function DriversPage(navCtrl, navParams, loadingCtrl, oneService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.oneService = oneService;
        this.imageURL = __WEBPACK_IMPORTED_MODULE_3__services_global__["c" /* url1 */] + 'uploads/';
    }
    DriversPage.prototype.getAllDrivers = function () {
        var _this = this;
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.loading.present();
        this.oneService.getAllDrivers().subscribe(function (data) {
            var dlist = data.message;
            var drives = [];
            var owner = JSON.parse(localStorage.getItem('owner'));
            dlist.forEach(function (d, i) {
                console.log(dlist[i].kitchensallow, "dlist");
                for (var j = 0; j < dlist[i].kitchensallow.length; j++) {
                    if (dlist[i].kitchensallow[j].resId == owner._id) {
                        drives.push(d);
                        break;
                    }
                }
                // if(dlist[i].city && owner.city ){
                //     console.log((dlist[i].city.toLowerCase() == owner.city.toLowerCase()) && dlist[i].isactivated == 2 );
                //         if((dlist[i].city.toLowerCase() == owner.city.toLowerCase()) && dlist[i].isactivated == 2 ){
                //        drives.push(d);
                //   }
                // }
            });
            console.log(dlist, 'dlist');
            console.log(owner);
            console.log(drives, 'drivers');
            _this.loading.dismiss();
            _this.drivers = drives;
        });
    };
    DriversPage.prototype.driverImage = function (img) {
        var imgPath;
        if (typeof img != 'undefined' && img != null) {
            imgPath = this.imageURL + img;
        }
        else {
            imgPath = 'assets/imgs/profile.png';
        }
        return imgPath;
    };
    DriversPage.prototype.ionViewDidEnter = function () {
        if (localStorage.getItem('owner')) {
            this.kitchen = JSON.parse(localStorage.getItem('owner'));
            this.getAllDrivers();
        }
    };
    DriversPage.prototype.goToLocationPage = function () {
        this.navCtrl.push(DriversLocationPage);
    };
    DriversPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-drivers',template:/*ion-inline-start:"D:\Apps\Owner App\src\pages\drivers\drivers.html"*/'<ion-header>\n    <ion-navbar color="secondary">\n        <button ion-button menuToggle>\n            <ion-icon name="menu"></ion-icon>\n        </button>\n        <ion-title>Drivers</ion-title>\n    </ion-navbar>\n</ion-header>\n\n\n<ion-content no-padding>\n    <button ion-button color="secondary" full (click)="goToLocationPage()">Show drivers locations</button>\n    <ion-list *ngIf = "drivers">\n        <ion-item *ngFor = "let driver of drivers">\n            <ion-avatar item-start>\n                <img style="object-fit: cover;" [src]="driverImage(driver.image)">\n            </ion-avatar>\n            <h2 text-capitalize><strong>{{driver.firstname}} {{driver.lastname}}</strong></h2>\n            <h3 *ngIf = "driver.vehicleType" text-capitalize>{{driver.vehicleType}}</h3>\n            <h3 text-capitalize> <span *ngIf = "driver.vehicleName"> {{driver.vehicleName}} </span> <span *ngIf = "driver.vehicleNo">- {{driver.vehicleNo}}</span></h3>\n        </ion-item>\n    </ion-list>\n</ion-content>\n'/*ion-inline-end:"D:\Apps\Owner App\src\pages\drivers\drivers.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_2__services_one_service__["a" /* OneService */]])
    ], DriversPage);
    return DriversPage;
}());

var DriversLocationPage = /** @class */ (function () {
    function DriversLocationPage(navCtrl, navParams, loadingCtrl, 
        /*public backgroundGeolocation: BackgroundGeolocation,*/
        oneService, platform) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.oneService = oneService;
        this.platform = platform;
        this.lat = 0;
        this.lng = 0;
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.owner = JSON.parse(localStorage.getItem('owner'));
        this.getAllDrivers();
        this.loading.present();
    }
    DriversLocationPage.prototype.getAllDrivers = function () {
        var _this = this;
        this.oneService.getAllDrivers().subscribe(function (data) {
            var owner = JSON.parse(localStorage.getItem('owner'));
            var dlist = data.message;
            var drivr = [];
            dlist.forEach(function (d, i) {
                console.log(dlist[i].kitchensallow, "dlist");
                for (var j = 0; j < dlist[i].kitchensallow.length; j++) {
                    if (dlist[i].kitchensallow[j].resId == owner._id) {
                        drivr.push(d);
                        break;
                    }
                }
            });
            console.log(dlist, 'dlist');
            console.log(_this.owner);
            console.log(_this.drivers, 'drivers');
            _this.drivers = drivr;
            _this.loading.dismiss();
            setTimeout(function () {
                _this.loadMap();
            }, 1000);
        });
    };
    DriversLocationPage.prototype.loadMap = function () {
        var mapOptions = {
            center: new google.maps.LatLng(this.owner.lat, this.owner.lng),
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        var latLng = new google.maps.LatLng(this.owner.lat, this.owner.lng);
        var marker = new google.maps.Marker({
            position: latLng,
            title: 'demo',
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            map: map,
            draggable: false,
        });
        if (typeof this.drivers != 'undefined' && this.drivers.length > 0) {
            for (var i = 0; i < this.drivers.length; i++) {
                var infowindow = new google.maps.InfoWindow();
                var latLng_1 = new google.maps.LatLng(this.drivers[i].lat, this.drivers[i].lng);
                var marker_1 = new google.maps.Marker({
                    position: latLng_1,
                    /*title: this.drivers[i].firstname,*/
                    /*label: {
                        fontWeight: 'bold',
                        text: this.drivers[i].firstname,
                    },*/
                    map: map,
                    draggable: false,
                });
                infowindow = new google.maps.InfoWindow({
                    content: this.drivers[i].firstname
                });
                infowindow.open(map, marker_1);
            }
        }
        this.showRoute(map);
    };
    DriversLocationPage.prototype.showRoute = function (map) {
        var _that = this;
        if (typeof this.drivers != 'undefined' && this.drivers.length > 0) {
            var _loop_1 = function (i) {
                var directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
                var directionsService = new google.maps.DirectionsService;
                directionsDisplay.setMap(map);
                var origin = { location: new google.maps.LatLng(this_1.owner.lat, this_1.owner.lng), stopover: true };
                directionsService.route({
                    origin: origin['location'],
                    destination: new google.maps.LatLng(this_1.drivers[i].lat, this_1.drivers[i].lng),
                    travelMode: google.maps.DirectionsTravelMode.DRIVING
                }, function (response, status) {
                    if (status === 'OK') {
                        directionsDisplay.setDirections(response);
                    }
                    else {
                        window.alert('Unable to display Route on Map for ' + _that.drivers[i].firstname + '! Location Not Reachable.');
                    }
                });
            };
            var this_1 = this;
            for (var i = 0; i < this.drivers.length; i++) {
                _loop_1(i);
            }
        }
    };
    DriversLocationPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-drivers-location',template:/*ion-inline-start:"D:\Apps\Owner App\src\pages\drivers\drivers-location.html"*/'<ion-header>\n\n    <ion-navbar color="secondary">\n\n        <button ion-button menuToggle>\n\n            <ion-icon name="menu"></ion-icon>\n\n        </button>\n\n        <ion-title>Drivers Location</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n\n    <div id="map" style="width:100%;height:100%;"></div>\n\n</ion-content>'/*ion-inline-end:"D:\Apps\Owner App\src\pages\drivers\drivers-location.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_2__services_one_service__["a" /* OneService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["t" /* Platform */]])
    ], DriversLocationPage);
    return DriversLocationPage;
}());

//# sourceMappingURL=drivers.js.map

/***/ }),

/***/ 386:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(387);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(391);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 391:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(427);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_list_list__ = __webpack_require__(736);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_login_login__ = __webpack_require__(169);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_order_order__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_filter_filter__ = __webpack_require__(271);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_profile_profile__ = __webpack_require__(374);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_signup_signup__ = __webpack_require__(737);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_home_home__ = __webpack_require__(170);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_drivers_drivers__ = __webpack_require__(381);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_customers_customers__ = __webpack_require__(272);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_forget_password_forget_password__ = __webpack_require__(380);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__services_one_service__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__services_two_service__ = __webpack_require__(166);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__services_three_service__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__services_four_service__ = __webpack_require__(273);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__ionic_native_status_bar__ = __webpack_require__(266);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__ionic_native_splash_screen__ = __webpack_require__(270);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21_ionic_img_viewer__ = __webpack_require__(375);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__ionic_native_file_transfer__ = __webpack_require__(378);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__ionic_native_file__ = __webpack_require__(738);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__ionic_native_camera__ = __webpack_require__(379);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__pipes_safe_html_safe_html__ = __webpack_require__(739);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__ionic_native_image_picker__ = __webpack_require__(740);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__ionic_native_file_path__ = __webpack_require__(741);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__ionic_native_network__ = __webpack_require__(383);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29_ionic2_rating__ = __webpack_require__(742);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30_angularfire2__ = __webpack_require__(163);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31_angularfire2_database__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32_angularfire2_auth__ = __webpack_require__(744);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33_firebase__ = __webpack_require__(165);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_33_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__ionic_native_badge__ = __webpack_require__(382);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
































// for AngularFireDatabase

// for AngularFireAuth



/*import { BackgroundMode } from '@ionic-native/background-mode';*/
var config = {
    apiKey: "AIzaSyB5oue6snCCcEKDTpoX8hRQkP0q2bl1Ojo",
    authDomain: "mealdaay-334ae.firebaseapp.com",
    databaseURL: "https://mealdaay-334ae.firebaseio.com",
    projectId: "mealdaay-334ae",
    storageBucket: "mealdaay-334ae.appspot.com",
    messagingSenderId: "202055895804"
};
__WEBPACK_IMPORTED_MODULE_33_firebase__["initializeApp"](config);
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["J" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_25__pipes_safe_html_safe_html__["a" /* SafeHtmlPipe */],
                __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_5__pages_list_list__["a" /* ListPage */],
                __WEBPACK_IMPORTED_MODULE_6__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_forget_password_forget_password__["a" /* ForgetPasswordPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_order_order__["b" /* OrderPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_filter_filter__["a" /* FilterPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_profile_profile__["c" /* ProfilePage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_order_order__["a" /* OrderDetailPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_signup_signup__["a" /* SignupPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_profile_profile__["b" /* ProfileEditPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_profile_profile__["a" /* ChangePasswordPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_drivers_drivers__["b" /* DriversPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_customers_customers__["a" /* CustomersDetailPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_drivers_drivers__["a" /* DriversLocationPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_profile_profile__["d" /* ViewIdsPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["b" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_29_ionic2_rating__["a" /* Ionic2RatingModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["m" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* MyApp */], {}, {
                    links: []
                }),
                __WEBPACK_IMPORTED_MODULE_30_angularfire2__["a" /* AngularFireModule */].initializeApp(config),
                __WEBPACK_IMPORTED_MODULE_31_angularfire2_database__["b" /* AngularFireDatabaseModule */],
                __WEBPACK_IMPORTED_MODULE_32_angularfire2_auth__["a" /* AngularFireAuthModule */]
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_5__pages_list_list__["a" /* ListPage */],
                __WEBPACK_IMPORTED_MODULE_6__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_forget_password_forget_password__["a" /* ForgetPasswordPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_order_order__["b" /* OrderPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_filter_filter__["a" /* FilterPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_profile_profile__["c" /* ProfilePage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_order_order__["a" /* OrderDetailPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_signup_signup__["a" /* SignupPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_profile_profile__["b" /* ProfileEditPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_profile_profile__["a" /* ChangePasswordPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_drivers_drivers__["b" /* DriversPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_customers_customers__["a" /* CustomersDetailPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_drivers_drivers__["a" /* DriversLocationPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_profile_profile__["d" /* ViewIdsPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_19__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_20__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_15__services_one_service__["a" /* OneService */],
                __WEBPACK_IMPORTED_MODULE_16__services_two_service__["a" /* TwoService */],
                __WEBPACK_IMPORTED_MODULE_17__services_three_service__["a" /* ThreeService */],
                __WEBPACK_IMPORTED_MODULE_18__services_four_service__["a" /* FourService */],
                __WEBPACK_IMPORTED_MODULE_26__ionic_native_image_picker__["a" /* ImagePicker */],
                __WEBPACK_IMPORTED_MODULE_22__ionic_native_file_transfer__["a" /* FileTransfer */],
                __WEBPACK_IMPORTED_MODULE_22__ionic_native_file_transfer__["b" /* FileTransferObject */],
                __WEBPACK_IMPORTED_MODULE_27__ionic_native_file_path__["a" /* FilePath */],
                /*BackgroundGeolocation,
                Geolocation,
                */
                __WEBPACK_IMPORTED_MODULE_21_ionic_img_viewer__["a" /* ImageViewerController */],
                __WEBPACK_IMPORTED_MODULE_23__ionic_native_file__["a" /* File */],
                __WEBPACK_IMPORTED_MODULE_34__ionic_native_badge__["a" /* Badge */],
                /*BackgroundMode,*/
                __WEBPACK_IMPORTED_MODULE_24__ionic_native_camera__["a" /* Camera */],
                __WEBPACK_IMPORTED_MODULE_28__ionic_native_network__["a" /* Network */],
                /*GoogleMaps,*/
                /*Push,*/
                __WEBPACK_IMPORTED_MODULE_31_angularfire2_database__["a" /* AngularFireDatabase */],
                { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["v" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* IonicErrorHandler */] }
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 427:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(266);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(270);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_order_order__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_profile_profile__ = __webpack_require__(374);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_login_login__ = __webpack_require__(169);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_home_home__ = __webpack_require__(170);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_drivers_drivers__ = __webpack_require__(381);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__services_three_service__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_badge__ = __webpack_require__(382);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_network__ = __webpack_require__(383);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__services_one_service__ = __webpack_require__(43);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






/*import { CustomersPage } from '../pages/customers/customers';*/







var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen, alertCtrl, threeService, toastCtrl, loadingCtrl, app, badge, 
        /*private backgroundMode: BackgroundMode,*/
        network, oneService) {
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.alertCtrl = alertCtrl;
        this.threeService = threeService;
        this.toastCtrl = toastCtrl;
        this.loadingCtrl = loadingCtrl;
        this.app = app;
        this.badge = badge;
        this.network = network;
        this.oneService = oneService;
        this.noConnection = false;
        this.initializeApp();
        this.pages = [
            { title: 'Home', component: __WEBPACK_IMPORTED_MODULE_7__pages_home_home__["a" /* HomePage */] },
            { title: 'Profile', component: __WEBPACK_IMPORTED_MODULE_5__pages_profile_profile__["c" /* ProfilePage */] },
            { title: 'Orders', component: __WEBPACK_IMPORTED_MODULE_4__pages_order_order__["b" /* OrderPage */] },
            /*{ title: 'Customers', component: CustomersPage },*/
            { title: 'Drivers', component: __WEBPACK_IMPORTED_MODULE_8__pages_drivers_drivers__["b" /* DriversPage */] },
            { title: 'Logout', component: 'Logout' }
        ];
    }
    MyApp.prototype.getCurrentPage = function () {
        var _this = this;
        setTimeout(function () {
            var page = _this.app.getActiveNavs();
            if (page.length > 0) {
                _this.currentComponentPage = page[0].getViews()[0].name;
            }
        }, 1000);
    };
    MyApp.prototype.noConnectionToast = function () {
        var toast = this.toastCtrl.create({
            message: 'Lost Internet connection!',
            duration: 3000,
            position: 'bottom' //top,middle,bottom
        });
        toast.present();
        this.noConnection = true;
    };
    MyApp.prototype.retry = function (event) {
        this.noConnection = false;
        this.loading = this.loadingCtrl.create({
            spinner: 'bubbles'
        });
        this.loading.present();
        if (this.network['type'] == 'none') {
            this.noConnectionToast();
            this.loading.dismiss();
        }
        else {
            this.onConnectFunction();
        }
    };
    MyApp.prototype.onConnectFunction = function () {
        var _this = this;
        setTimeout(function () {
            _this.loading.dismiss();
            _this.noConnection = false;
            if (localStorage.getItem('owner')) {
                if (_this.currentComponentPage == 'HomePage') {
                    _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_7__pages_home_home__["a" /* HomePage */]);
                }
                else if (_this.currentComponentPage == 'ProfilePage') {
                    _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_5__pages_profile_profile__["c" /* ProfilePage */]);
                }
                else if (_this.currentComponentPage == 'OrderPage') {
                    _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_4__pages_order_order__["b" /* OrderPage */]);
                }
                else if (_this.currentComponentPage == 'DriversPage') {
                    _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_8__pages_drivers_drivers__["b" /* DriversPage */]);
                }
                else {
                    _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_7__pages_home_home__["a" /* HomePage */]);
                }
                _this.getCurrentPage();
            }
            else {
                _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_6__pages_login_login__["a" /* LoginPage */]);
                _this.getCurrentPage();
            }
        }, 2000);
    };
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
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        var _that = this;
        this.platform.ready().then(function () {
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
            if (_this.network['type'] == 'none') {
                _this.noConnectionToast();
            }
            else {
                _this.noConnection = false;
            }
            if (localStorage.getItem('owner')) {
                // this.splashScreen.hide();
                _this.rootPage = __WEBPACK_IMPORTED_MODULE_7__pages_home_home__["a" /* HomePage */];
                _this.getCurrentPage();
                setTimeout(function () {
                    _this.statusBar.overlaysWebView(false);
                    if (_this.platform.is('android')) {
                        _this.statusBar.styleLightContent();
                    }
                    else {
                        _this.statusBar.styleDefault();
                    }
                    console.log("this is cllaed");
                    // this.statusBar.backgroundColorByName("white");
                    _this.statusBar.show();
                    console.log(_this.statusBar.isVisible, 'status bar actived');
                    _this.splashScreen.hide();
                }, 2000);
            }
            else {
                //  this.splashScreen.hide();
                _this.rootPage = __WEBPACK_IMPORTED_MODULE_6__pages_login_login__["a" /* LoginPage */];
                _this.getCurrentPage();
                setTimeout(function () {
                    _this.statusBar.overlaysWebView(false);
                    if (_this.platform.is('android')) {
                        _this.statusBar.styleLightContent();
                    }
                    else {
                        _this.statusBar.styleDefault();
                    }
                    // this.statusBar.styleDefault();
                    console.log("this is cllaed");
                    // this.statusBar.backgroundColorByName("white");
                    _this.statusBar.show();
                    console.log(_this.statusBar.isVisible, 'status bar actived');
                    _this.splashScreen.hide();
                }, 2000);
            }
            if (typeof FCMPlugin != 'undefined') {
                FCMPlugin.onNotification(function (data) {
                    if (typeof cordova != 'undefined') {
                        // cordova.plugins.notification.badge.increase(1, function (badge) {
                        //   console.log("badge => " ,badge);
                        // });
                    }
                    if (data.wasTapped) {
                        if (typeof cordova != 'undefined') {
                            // cordova.plugins.notification.badge.decrease(1, function (badge) {
                            //   console.log("badge => " ,badge);
                            // });
                        }
                        //       _that.increaseBadge();
                        _that.getOrder(data.orderId);
                    }
                    else {
                        //     _that.clearBadge();
                        if (typeof cordova != 'undefined') {
                            //    cordova.plugins.notification.badge.clear();
                        }
                        var prompt_1 = _that.alertCtrl.create({
                            message: data.message,
                            buttons: [
                                {
                                    text: 'OK',
                                    handler: function (dataa) {
                                        _that.getOrder(data.orderId);
                                        // if(data.message && data.message.includes("pending")){
                                        // }else{
                                        // }
                                    }
                                }
                            ]
                        });
                        prompt_1.present();
                    }
                });
                FCMPlugin.onTokenRefresh(function (token) {
                    console.log(token);
                });
            }
            var disconnectSubscription = _this.network.onDisconnect().subscribe(function () {
                _this.noConnectionToast();
            });
            var connectSubscription = _this.network.onConnect().subscribe(function () {
                _this.noConnection = false;
                _this.loading = _this.loadingCtrl.create({
                    spinner: 'bubbles'
                });
                _this.loading.present();
                _this.onConnectFunction();
            });
        });
    };
    MyApp.prototype.UpdateToken = function () {
        var that = this;
        return new Promise(function (resolve, reject) {
            FCMPlugin.getToken(function (token) {
                var t = token;
                var id = JSON.parse(localStorage.getItem("owner")).ownerId._id;
                that.oneService.getOwner(id).subscribe(function (res) {
                    var token = res.message.fcmToken;
                    var newToken = [];
                    for (var i = 0; i < token.length; i++) {
                        if (token[i] != t) {
                            newToken.push(token[i]);
                        }
                        if (i + 1 == token.length) {
                            var res_1 = {
                                _id: id,
                                fcmToken: newToken
                            };
                            resolve(res_1);
                        }
                    }
                });
            });
        });
    };
    MyApp.prototype.openPage = function (page) {
        var _this = this;
        if (page.component == 'Logout') {
            var prompt_2 = this.alertCtrl.create({
                title: 'Logout',
                message: "Are you sure ?",
                buttons: [
                    {
                        text: 'Cancel',
                        handler: function (data) {
                            console.log('Cancel clicked');
                        }
                    },
                    {
                        text: 'oK',
                        handler: function (data) {
                            _this.UpdateToken().then(function (res) {
                                _this.oneService.editOwner(res).subscribe(function () {
                                    localStorage.clear();
                                    _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_6__pages_login_login__["a" /* LoginPage */]);
                                    _this.getCurrentPage();
                                });
                            });
                        }
                    }
                ]
            });
            prompt_2.present();
        }
        else {
            this.nav.setRoot(page.component);
            this.getCurrentPage();
        }
    };
    MyApp.prototype.doLogout = function () {
        var _this = this;
        var prompt = this.alertCtrl.create({
            title: 'Logout',
            message: "Are you sure ?",
            buttons: [
                {
                    text: 'Cancel',
                    handler: function (data) {
                    }
                },
                {
                    text: 'oK',
                    handler: function (data) {
                        _this.UpdateToken().then(function (res) {
                            _this.oneService.editOwner(res).subscribe(function () {
                                localStorage.removeItem('owner');
                                _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_6__pages_login_login__["a" /* LoginPage */]);
                            });
                        });
                    }
                }
            ]
        });
        prompt.present();
    };
    MyApp.prototype.getOrder = function (id) {
        var _this = this;
        this.threeService.getOneOrder(id).subscribe(function (data) {
            if (!data.error) {
                _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_4__pages_order_order__["a" /* OrderDetailPage */], {
                    orderData: data.message, noti: 'noti'
                });
            }
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_9" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* Nav */])
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"D:\Apps\Owner App\src\app\app.html"*/'<ion-menu [content]="content">\n  <ion-header >\n    <ion-toolbar color="secondary">\n      <ion-title>Menu</ion-title>\n    </ion-toolbar>\n  </ion-header>\n\n  <ion-content>\n    <ion-list no-lines>\n      <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">\n        {{p.title}}\n      \n      </button>\n      <!-- <button menuClose ion-item (click)="doLogout()">\n        Logout\n      </button> -->\n      \n    </ion-list> \n  </ion-content>\n\n</ion-menu>\n\n<!-- Disable swipe-to-go-back because it\'s poor UX to combine STGB with side menus -->\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>\n\n<ion-row *ngIf = "noConnection" class="noconnection" (tap)="retry($event)">\n  <ion-col no-padding col-12 text-center>\n    <ion-icon name ="refresh" ios="ios-refresh" md="md-refresh"></ion-icon>\n  </ion-col>\n  <ion-col no-padding col-12 text-center>Tap to Reload</ion-col>\n</ion-row>'/*ion-inline-end:"D:\Apps\Owner App\src\app\app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["t" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_9__services_three_service__["a" /* ThreeService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* App */],
            __WEBPACK_IMPORTED_MODULE_10__ionic_native_badge__["a" /* Badge */],
            __WEBPACK_IMPORTED_MODULE_11__ionic_native_network__["a" /* Network */],
            __WEBPACK_IMPORTED_MODULE_12__services_one_service__["a" /* OneService */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 43:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OneService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__global__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var OneService = /** @class */ (function () {
    function OneService(http) {
        this.http = http;
    }
    OneService.prototype.getLocalOwner = function () {
    };
    OneService.prototype.signup = function (data) {
        return this.http.post(__WEBPACK_IMPORTED_MODULE_2__global__["c" /* url1 */] + 'owner', data)
            .map(function (response) { return response.json(); });
    };
    OneService.prototype.login = function (data) {
        return this.http.post(__WEBPACK_IMPORTED_MODULE_2__global__["c" /* url1 */] + 'login', data)
            .map(function (response) {
            var owner = response.json();
            return owner;
        });
    };
    OneService.prototype.getOwner = function (id) {
        return this.http.get(__WEBPACK_IMPORTED_MODULE_2__global__["c" /* url1 */] + "owners/" + id).map(function (response) {
            var ower = response.json();
            return ower;
        });
    };
    OneService.prototype.forgetPasswordOwner = function (data) {
        return this.http.post(__WEBPACK_IMPORTED_MODULE_2__global__["c" /* url1 */] + 'owner/forget-password', data)
            .map(function (response) {
            var ower = response.json();
            return ower;
        });
    };
    OneService.prototype.editOwner = function (data) {
        return this.http.put(__WEBPACK_IMPORTED_MODULE_2__global__["c" /* url1 */] + 'owners/' + data._id, data)
            .map(function (response) { return response.json(); });
    };
    OneService.prototype.editDriver = function (data) {
        return this.http.put(__WEBPACK_IMPORTED_MODULE_2__global__["c" /* url1 */] + 'driver/' + data._id, data)
            .map(function (response) { return response.json(); });
    };
    OneService.prototype.Notification = function (data) {
        return this.http.post(__WEBPACK_IMPORTED_MODULE_2__global__["c" /* url1 */] + 'notifications', data).map(function (response) { return response.json(); });
    };
    OneService.prototype.updateCustomer = function (data) {
        return this.http.put(__WEBPACK_IMPORTED_MODULE_2__global__["f" /* url4 */] + 'customers/' + data._id, data)
            .map(function (response) { return response.json(); });
    };
    // AddTokenOwner(data){
    //     return this.http.put(globalVariable.url1 + 'owner/' + data._id, data)
    //         .map((response: Response) => response.json());
    // }
    OneService.prototype.passwordEditOwner = function (data) {
        return this.http.put(__WEBPACK_IMPORTED_MODULE_2__global__["c" /* url1 */] + 'change-password/' + data._id, data)
            .map(function (response) { return response.json(); });
    };
    OneService.prototype.getAllDrivers = function () {
        return this.http.get(__WEBPACK_IMPORTED_MODULE_2__global__["c" /* url1 */] + 'driver/')
            .map(function (response) { return response.json(); });
    };
    OneService.prototype.getAllResturant = function () {
        return this.http.get(__WEBPACK_IMPORTED_MODULE_2__global__["c" /* url1 */] + 'kitchen/').map(function (response) { return response.json(); });
    };
    OneService.prototype.getDriver = function (id) {
        return this.http.get(__WEBPACK_IMPORTED_MODULE_2__global__["c" /* url1 */] + 'driver/' + id)
            .map(function (response) { return response.json(); });
    };
    OneService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
    ], OneService);
    return OneService;
}());

//# sourceMappingURL=one.service.js.map

/***/ }),

/***/ 63:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ThreeService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__global__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ThreeService = /** @class */ (function () {
    function ThreeService(http) {
        this.http = http;
    }
    ThreeService.prototype.getOrders = function (id) {
        return this.http.get(__WEBPACK_IMPORTED_MODULE_2__global__["e" /* url3 */] + 'restaurantorders/' + id).map(function (response) { return response.json(); });
    };
    ThreeService.prototype.getCustomersOrdersList = function (id) {
        return this.http.get(__WEBPACK_IMPORTED_MODULE_2__global__["e" /* url3 */] + 'customerorder/' + id).map(function (response) { return response.json(); });
    };
    ThreeService.prototype.updateCustomersOrdersStatus = function (data) {
        return this.http.put(__WEBPACK_IMPORTED_MODULE_2__global__["e" /* url3 */] + 'order/' + data.id, data).map(function (response) { return response.json(); });
    };
    ThreeService.prototype.getOneOrder = function (id) {
        return this.http.get(__WEBPACK_IMPORTED_MODULE_2__global__["e" /* url3 */] + 'order/' + id).map(function (response) { return response.json(); });
    };
    ThreeService.prototype.OrderEmail = function (obj) {
        return this.http.post(__WEBPACK_IMPORTED_MODULE_2__global__["c" /* url1 */] + 'order-email-accepted', obj).map(function (response) { return response.json(); });
    };
    ThreeService.prototype.GetCustomer = function (id) {
        return this.http.get(__WEBPACK_IMPORTED_MODULE_2__global__["f" /* url4 */] + "customers/" + id).map(function (response) { return response.json(); });
    };
    ThreeService.prototype.checkRestroRating = function (data) {
        return this.http.post(__WEBPACK_IMPORTED_MODULE_2__global__["e" /* url3 */] + 'rating/checkrating', data)
            .map(function (response) { return response.json(); });
    };
    ThreeService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
    ], ThreeService);
    return ThreeService;
}());

//# sourceMappingURL=three.service.js.map

/***/ }),

/***/ 736:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ListPage = /** @class */ (function () {
    function ListPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        // If we navigated to this page, we will have an item available as a nav param
        this.selectedItem = navParams.get('item');
        // Let's populate this page with some filler content for funzies
        this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
            'american-football', 'boat', 'bluetooth', 'build'];
        this.items = [];
        for (var i = 1; i < 11; i++) {
            this.items.push({
                title: 'Item ' + i,
                note: 'This is item #' + i,
                icon: this.icons[Math.floor(Math.random() * this.icons.length)]
            });
        }
    }
    ListPage_1 = ListPage;
    ListPage.prototype.itemTapped = function (event, item) {
        // That's right, we're pushing to ourselves!
        this.navCtrl.push(ListPage_1, {
            item: item
        });
    };
    ListPage = ListPage_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-list',template:/*ion-inline-start:"D:\Apps\Owner App\src\pages\list\list.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>List</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <ion-list>\n    <button ion-item *ngFor="let item of items" (click)="itemTapped($event, item)">\n      <ion-icon [name]="item.icon" item-start></ion-icon>\n      {{item.title}}\n      <div class="item-note" item-end>\n        {{item.note}}\n      </div>\n    </button>\n  </ion-list>\n  <div *ngIf="selectedItem" padding>\n    You navigated here from <b>{{selectedItem.title}}</b>\n  </div>\n</ion-content>\n'/*ion-inline-end:"D:\Apps\Owner App\src\pages\list\list.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */]])
    ], ListPage);
    return ListPage;
    var ListPage_1;
}());

//# sourceMappingURL=list.js.map

/***/ }),

/***/ 737:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_one_service__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_two_service__ = __webpack_require__(166);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__login_login__ = __webpack_require__(169);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var SignupPage = /** @class */ (function () {
    function SignupPage(navCtrl, navParams, oneService, twoService, loadingCtrl, lf, toastCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.oneService = oneService;
        this.twoService = twoService;
        this.loadingCtrl = loadingCtrl;
        this.lf = lf;
        this.toastCtrl = toastCtrl;
        this.emailp = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        this.formErrors = {
            /*'username': '',*/
            'email': '',
            'password': '',
            'cpassword': '',
        };
        this.validationMessages = {
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
        this.twoService.getComplexity().subscribe(function (data) {
            if (!data.error) {
                _this.passwordp = data.message[0].ownerpasscomplexity.regex;
                _this.setpasswordmessage(data.message[0].ownerpasscomplexity.name);
                _this.signupForm = _this.lf.group({
                    username: [''],
                    email: ['', [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern(_this.emailp)]],
                    password: ['', [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern(_this.passwordp)]],
                    cpassword: ['', [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required]],
                });
                _this.signupForm.valueChanges.subscribe(function (data) { return _this.onValueChanged(data); });
                _this.onValueChanged();
            }
        }, function (err) {
            _this.getToast('Unable to load data. Please check your Internet connection');
        });
    }
    SignupPage.prototype.setpasswordmessage = function (name) {
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
    };
    SignupPage.prototype.onValueChanged = function (data) {
        if (!this.signupForm) {
            return;
        }
        var form = this.signupForm;
        for (var field in this.formErrors) {
            this.formErrors[field] = '';
            var control = form.get(field);
            if (control && control.dirty && !control.valid) {
                var messages = this.validationMessages[field];
                for (var key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    };
    SignupPage.prototype.goToLoginPage = function () {
        this.navCtrl.pop();
    };
    SignupPage.prototype.doSignup = function () {
        var _this = this;
        this.signupForm.controls['username'].setValue(this.signupForm.controls['email'].value);
        if (this.signupForm.value.password != this.signupForm.value.cpassword) {
            this.matchPassword = true;
        }
        else {
            var loading_1 = this.loadingCtrl.create({
                content: 'Please wait...'
            });
            loading_1.present();
            this.oneService.signup(this.signupForm.value).subscribe(function (data) {
                loading_1.dismiss();
                if (!data.error) {
                    _this.getToast('Signup successfully. check your email to comfirm email address !');
                    _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_5__login_login__["a" /* LoginPage */]);
                }
                else {
                    _this.getToast('Bad Credential');
                    _this.signupForm.reset();
                }
            }, function (err) {
                loading_1.dismiss();
                _this.getToast('Unable to register! Please check your Internet connection.');
            });
        }
    };
    SignupPage.prototype.getToast = function (msg) {
        var toast = this.toastCtrl.create({
            message: msg,
            duration: 5000,
            position: 'top' //top,middle,bottom
        });
        toast.present();
    };
    SignupPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-signup',template:/*ion-inline-start:"D:\Apps\Owner App\src\pages\signup\signup.html"*/'<ion-header>\n\n  <ion-navbar color="secondary">\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Sign Up</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content no-padding scrollbar-y="false"  [ngStyle]="{\'background-image\': \'url(assets/imgs/bg.jpg)\'}">\n\n\n\n  <div padding class="mt-2" *ngIf="passwordp" >\n\n\n\n    <ion-row>\n\n      <ion-col>\n\n        <img src="assets/imgs/bgLogoM.png" class="logo h-center ">\n\n      </ion-col>\n\n    </ion-row>\n\n\n\n    <ion-row>\n\n      <ion-col>\n\n        <ion-list no-margin>\n\n\n\n          <form role="form" class="list"  [formGroup]="signupForm" (ngSubmit)="doSignup()" >\n\n          <!-- <ion-item>\n\n            <ion-label floating>Username</ion-label>\n\n            <ion-input type="text" formControlName="username"></ion-input> \n\n          </ion-item>\n\n          <div *ngIf="formErrors.username" class="alert alert-danger mt-2">\n\n            {{ formErrors.username }}\n\n          </div> -->\n\n            <ion-item>\n\n              <ion-label floating>Email</ion-label>\n\n              <ion-input type="text" formControlName="email" ></ion-input>\n\n            </ion-item>\n\n            <div *ngIf="formErrors.email" class="alert alert-danger mt-2">\n\n            {{ formErrors.email }}\n\n            </div>\n\n            <ion-item>\n\n              <ion-label floating>Password</ion-label>\n\n              <ion-input type="password" formControlName="password"></ion-input>\n\n            </ion-item>\n\n            <div *ngIf="formErrors.password" class="alert alert-danger mt-2">\n\n              {{ formErrors.password }}\n\n            </div>\n\n            <ion-item>\n\n              <ion-label floating>Confirm password</ion-label>\n\n              <ion-input type="password" formControlName="cpassword"></ion-input>\n\n            </ion-item>\n\n            <div *ngIf="matchPassword" class="alert alert-danger mt-2">\n\n              Password does not match.\n\n            </div>\n\n            <button  class="mt-3" ion-button full color="secondary"  [disabled]="!signupForm.valid">Sign Up</button>\n\n          </form>\n\n        </ion-list>\n\n      </ion-col>\n\n    </ion-row>\n\n\n\n    <ion-row>\n\n      <ion-col col-12 text-center>\n\n        <a class="text-light" (click)="goToLoginPage()">Login</a>\n\n      </ion-col>\n\n    </ion-row>\n\n  </div>\n\n</ion-content>\n\n'/*ion-inline-end:"D:\Apps\Owner App\src\pages\signup\signup.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_3__services_one_service__["a" /* OneService */],
            __WEBPACK_IMPORTED_MODULE_4__services_two_service__["a" /* TwoService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */]])
    ], SignupPage);
    return SignupPage;
}());

//# sourceMappingURL=signup.js.map

/***/ }),

/***/ 739:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SafeHtmlPipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(31);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SafeHtmlPipe = /** @class */ (function () {
    function SafeHtmlPipe(sanitizer) {
        this.sanitizer = sanitizer;
    }
    SafeHtmlPipe.prototype.transform = function (html) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(html);
    };
    SafeHtmlPipe = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Pipe */])({
            name: 'safeHtml',
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["c" /* DomSanitizer */]])
    ], SafeHtmlPipe);
    return SafeHtmlPipe;
}());

//# sourceMappingURL=safe-html.js.map

/***/ })

},[386]);
//# sourceMappingURL=main.js.map