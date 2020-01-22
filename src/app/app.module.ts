import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';

import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { OrderPage, OrderDetailPage } from '../pages/order/order';
import { FilterPage } from '../pages/filter/filter';  
import { ProfilePage, ChangePasswordPage, ProfileEditPage, ViewIdsPage } from '../pages/profile/profile';
import { SignupPage } from '../pages/signup/signup';
import { HomePage } from '../pages/home/home'; 
import { DriversPage, DriversLocationPage } from '../pages/drivers/drivers';
import { CustomersDetailPage } from '../pages/customers/customers';
import { ForgetPasswordPage } from '../pages/forget-password/forget-password';
import { OneService } from '../services/one.service';
import { TwoService } from '../services/two.service';
import { ThreeService } from '../services/three.service';
import { FourService } from '../services/four.service';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicImageViewerModule, ImageViewerController } from 'ionic-img-viewer';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { SafeHtmlPipe } from './../pipes/safe-html/safe-html';
import { ImagePicker } from '@ionic-native/image-picker';
import { FilePath } from '@ionic-native/file-path';
import { Network } from '@ionic-native/network';
import { Ionic2RatingModule } from 'ionic2-rating';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase } from 'angularfire2/database'

// for AngularFireDatabase
import { AngularFireDatabaseModule } from 'angularfire2/database';

// for AngularFireAuth
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from "firebase";

import { Badge } from '@ionic-native/badge';
/*import { BackgroundMode } from '@ionic-native/background-mode';*/

var config = {
    apiKey: "AIzaSyB5oue6snCCcEKDTpoX8hRQkP0q2bl1Ojo",
    authDomain: "mealdaay-334ae.firebaseapp.com",
    databaseURL: "https://mealdaay-334ae.firebaseio.com",
    projectId: "mealdaay-334ae",
    storageBucket: "mealdaay-334ae.appspot.com",
    messagingSenderId: "202055895804"
  };


firebase.initializeApp(config);



@NgModule({
  declarations: [
    SafeHtmlPipe,
    MyApp,
    ListPage,
    LoginPage,
    ForgetPasswordPage,
    OrderPage,
    FilterPage,
    ProfilePage,
    OrderDetailPage, 
    SignupPage,
    ProfileEditPage,
    ChangePasswordPage,
    HomePage,
    DriversPage,
    CustomersDetailPage,
    DriversLocationPage,
    ViewIdsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    Ionic2RatingModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ListPage,
    LoginPage,
    ForgetPasswordPage,
    OrderPage,
    FilterPage,
    ProfilePage,
    OrderDetailPage,
    SignupPage,
    ProfileEditPage,
    ChangePasswordPage,
    HomePage,
    DriversPage,
    CustomersDetailPage,
    DriversLocationPage,
    ViewIdsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    OneService,
    TwoService,
    ThreeService,
    FourService,
    ImagePicker,
    FileTransfer,
    FileTransferObject,
    FilePath,
    /*BackgroundGeolocation,
    Geolocation,
    */
    ImageViewerController,
    File,
    Badge,
    /*BackgroundMode,*/
    Camera,
    Network,
    /*GoogleMaps,*/
    /*Push,*/
    AngularFireDatabase,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
