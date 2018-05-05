import { Component } from '@angular/core';
import { Platform, NavController, NavParams } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';



@Component({
  selector: 'page-info',
  templateUrl: 'info.html'
})
export class InfoPage {

  infoArtwork: any;
  userLat: number;
  userLng: number;


  constructor(public navCtrl: NavController, public diagnostic: Diagnostic, public navParams: NavParams, public http: Http, public platform: Platform, public geolocation: Geolocation) {

    this.infoArtwork = navParams.get('artwork');
    console.log('this.infoArtwork = ' + JSON.stringify(this.infoArtwork));
  }

  ngAfterViewInit() {
    this.platform.ready().then(() => {
        this.loadUserPosition();
    });
}

  callItinerary(lat, lng, name) {
    var uri;  
    var coords = lat + ',' + lng;

    if (this.platform.is('ios')) {  
      uri = 'maps://?ll=' + coords + '&q=' + name;
    } else {
        uri = 'geo:0,0?q=' + coords + '(' + name + ')';
    }

    window.open(uri, '_system');  
  }

  loadUserPosition() {
    this.checkGPS();
    let geoOptions = {
        timeout: 10000,
        enableHighAccuracy: false
    };
    this.geolocation.getCurrentPosition(geoOptions).then((data) => {
        this.userLat = data.coords.latitude;
        this.userLng = data.coords.longitude;
    }).catch((error) => {
        console.log('La géolocalisation a été refusée', error.message);
    });

    let watch = this.geolocation.watchPosition(geoOptions);
    watch.subscribe((data) => {
        if (data.coords !== undefined) {
            this.userLat = data.coords.latitude;
            this.userLng = data.coords.longitude;
            console.log('userLat : ' + this.userLat);
            console.log('userLng : ' + this.userLng);
        }
        this.loadDistance();
    });
}

loadDistance() {

    return new Promise(resolve => {

        this.infoArtwork = this.applyHaversine(this.infoArtwork);
        resolve(this.infoArtwork);

    });

}

applyHaversine(location) {

    let usersLocation = {
        lat: this.userLat,
        lng: this.userLng
    };


    let placeLocation = {
        lat: location.latitude,
        lng: location.longitude
    };

    location.distance = this.getDistanceBetweenPoints(
        usersLocation,
        placeLocation,
        'km'
    ).toFixed(2);

    return location;
}

getDistanceBetweenPoints(start, end, units) {

    let earthRadius = {
        miles: 3958.8,
        km: 6371
    };

    let R = earthRadius[units || 'km'];
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = end.lat;
    let lon2 = end.lng;

    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d;

}

toRad(x) {
    return x * Math.PI / 180;
}


checkGPS() {
    this.diagnostic.isLocationEnabled().then(
        (isAvailable) => {
            if (isAvailable === false) {
                alert('Le GPS de votre appareil est désactivé');
            }
        });
}




}
