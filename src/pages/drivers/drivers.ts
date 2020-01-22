import { Component,  } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController } from 'ionic-angular';

import { OneService } from '../../services/one.service'

import * as globalVariable from "../../services/global";

/*import { BackgroundGeolocation } from '@ionic-native/background-geolocation';*/
/*import { Geolocation } from '@ionic-native/geolocation';*/
import { Loading } from 'ionic-angular/components/loading/loading';
declare var google: any;

@Component({
    selector: 'page-drivers',
    templateUrl: 'drivers.html',
})
export class DriversPage {

    kitchen: any;
    drivers: any;
    loading: any;
    imageURL : string = globalVariable.url1 + 'uploads/' ;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public oneService: OneService
        ) {}

    getAllDrivers(){
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.loading.present();

        this.oneService.getAllDrivers().subscribe((data) => {
            let dlist = data.message;
            let drives = [];
            const owner:any =  JSON.parse(localStorage.getItem('owner'));
    
           
            dlist.forEach((d,i) => {
                console.log(dlist[i].kitchensallow , "dlist");
               for(let j = 0; j < dlist[i].kitchensallow.length;j++){
                   if(dlist[i].kitchensallow[j].resId == owner._id){
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
     
        })
            console.log(dlist,'dlist');
            console.log(owner);
            console.log(drives,'drivers');
            this.loading.dismiss();
            this.drivers = drives;
        });
    }

    driverImage(img){
        let imgPath : any;

        if (typeof img != 'undefined' && img != null) {
            imgPath = this.imageURL + img;
        }else{
            imgPath = 'assets/imgs/profile.png'
        }

        return imgPath;

    }

    ionViewDidEnter() {
        if (localStorage.getItem('owner')) {
            this.kitchen = JSON.parse(localStorage.getItem('owner'));
            this.getAllDrivers();
        }
    }

    goToLocationPage(){
        this.navCtrl.push(DriversLocationPage);
    }
}

@Component({
    selector: 'page-drivers-location',
    templateUrl: 'drivers-location.html',
})
export class DriversLocationPage {
    public watch: any;
    public lat: number = 0;
    public lng: number = 0;
    watchLat: any;
    watchLng: any;
    marker: any;
    loading: any;
    locations: any;

    owner: any;
    drivers: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        /*public backgroundGeolocation: BackgroundGeolocation,*/
        public oneService: OneService,
        public platform: Platform
        ) {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.owner = JSON.parse(localStorage.getItem('owner'));
        this.getAllDrivers();

        this.loading.present();
    }

    getAllDrivers(){
        this.oneService.getAllDrivers().subscribe((data) => {
            const owner:any =  JSON.parse(localStorage.getItem('owner'));
            let dlist = data.message;
            let drivr = [];
            dlist.forEach((d,i) => {
                console.log(dlist[i].kitchensallow , "dlist");
               for(let j = 0; j < dlist[i].kitchensallow.length;j++){
                   if(dlist[i].kitchensallow[j].resId == owner._id){
                    drivr.push(d);
                    break;
                   }
               }
            });
            console.log(dlist,'dlist');
            console.log(this.owner);
            console.log(this.drivers,'drivers');
            this.drivers = drivr;
            this.loading.dismiss();
            setTimeout(()=>{
                this.loadMap();
            },1000)
        });
    }

    loadMap() {
        let mapOptions= {
            center: new google.maps.LatLng(this.owner.lat, this.owner.lng),
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        let map = new google.maps.Map(document.getElementById("map"), mapOptions);

        let latLng = new google.maps.LatLng(this.owner.lat, this.owner.lng);
        let marker = new google.maps.Marker({
            position: latLng,
            title: 'demo',
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            map: map,
            draggable: false,
        });

        if (typeof this.drivers != 'undefined' && this.drivers.length > 0) {
            for (var i = 0; i < this.drivers.length; i++) {
                var infowindow = new google.maps.InfoWindow();
                let latLng = new google.maps.LatLng(this.drivers[i].lat, this.drivers[i].lng);
                let marker = new google.maps.Marker({
                    position: latLng,
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
                infowindow.open(map, marker);
            }
        }
        this.showRoute(map);
    }

    showRoute(map) {
        let _that = this;
        if (typeof this.drivers != 'undefined' && this.drivers.length > 0) {
            for (let i = 0; i < this.drivers.length; i++) {
                let directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
                let directionsService = new google.maps.DirectionsService;
                directionsDisplay.setMap(map);
                let origin = { location: new google.maps.LatLng(this.owner.lat, this.owner.lng), stopover: true };
                directionsService.route({
                    origin: origin['location'],
                    destination: new google.maps.LatLng(this.drivers[i].lat, this.drivers[i].lng),
                    travelMode: google.maps.DirectionsTravelMode.DRIVING
                }, function (response, status) {
                    if (status === 'OK') {
                        directionsDisplay.setDirections(response);
                    } else {
                        window.alert('Unable to display Route on Map for ' + _that.drivers[i].firstname + '! Location Not Reachable.');
                    }
                });
            }
        }
    }

}
