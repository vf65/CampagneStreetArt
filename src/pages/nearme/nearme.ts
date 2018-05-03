import { Component } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { Platform, NavController } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';
import { InfoPage } from '../info/info';



@Component({
    selector: 'page-nearme',
    templateUrl: 'nearme.html'
})

export class NearmePage {
    artworkList: any;
    userLat: number;
    userLng: number;
    requestEnableLocation: any;

    constructor(public navCtrl: NavController, public diagnostic: Diagnostic, public platform: Platform, public http: Http, public geolocation: Geolocation) {

    }

    ngAfterViewInit() {
        this.platform.ready().then(() => {
            this.loadUserPosition();
        });
    }

    loadUserPosition() {
        this.checkGPS();
        let geoOptions = {
            enableHighAccuracy: false
        };

        this.geolocation.getCurrentPosition(geoOptions).then((data) => {
            this.userLat = data.coords.latitude;
            this.userLng = data.coords.longitude;
        }).catch((error) => {
            console.log('La géolocalisation a été refusée', error.message);
            // alert('La géolocalisation a été refusée : ' + error.message);
        });

        let watch = this.geolocation.watchPosition(geoOptions);
        watch.subscribe((data) => {
            if (data.coords !== undefined) {
                this.userLat = data.coords.latitude;
                this.userLng = data.coords.longitude;
                console.log('userLat : ' + this.userLat);
                console.log('userLng : ' + this.userLng);
                // alert('userLat : ' + this.userLat);
                // alert('userLng : ' + this.userLng);
            }
            this.loadArtworks();
        });
    }




    loadArtworks() {
        // alert('loadPositions exécuté');

        return new Promise(resolve => {

            this.http.get('assets/data/artwork.json')
                .map(res => res.json())
                .subscribe(data => {
                        
                        this.artworkList = this.applyHaversine(data.artworks);
                        this.artworkList.sort((locationA, locationB) => {
                            return locationA.distance - locationB.distance;
                        });
                        
                        resolve(this.artworkList);
                    },
                    err => {
                        console.log("Erreur suivante lors de la récupération des fresques :  " + err); // error
                    },
                    () => {
                        console.log('Les fresques ont été récupérées'); // complete
                        console.log(this.artworkList);
                    }
                );

        });

    }


    checkGPS() {
        this.diagnostic.isLocationEnabled().then(
            (isAvailable) => {
                if (isAvailable === false) {
                    alert('Le GPS de votre appareil est désactivé');
                }
            });
    }

    sortByProperty(property) {

        return function(x, y) {

            return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));

        };

    };

    applyHaversine(locations) {

        let usersLocation = {
            lat: this.userLat,
            lng: this.userLng
        };

        locations.map((location) => {

            let placeLocation = {
                lat: location.latitude,
                lng: location.longitude
            };

            location.distance = this.getDistanceBetweenPoints(
                usersLocation,
                placeLocation,
                'km'
            ).toFixed(2);
        });

        return locations;
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
  
    showInfo(artwork) {
        this.navCtrl.push(InfoPage, {
            artwork: artwork 
        });
    }

}