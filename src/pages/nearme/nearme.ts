import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import 'rxjs/add/operator/map';

@Component({
    selector: 'page-nearme',
    templateUrl: 'nearme.html'
})

export class NearmePage {
    artworkList: any;
    userLat: number;
    userLng: number;
    userGeo: boolean = false;

    constructor(private geolocation: Geolocation, public platform: Platform, private http: Http) {

    }

    ngAfterViewInit() {
        this.platform.ready().then(() => {
            this.loadUserPositions();
            this.loadPositions();
        });
    }

    loadUserPositions(){
        this.geolocation.getCurrentPosition().then((resp) => {
        this.userLat = resp.coords.latitude;
        this.userLng = resp.coords.longitude;
        this.userGeo = true;
    }).catch((error) => {
            console.log('La géolocalisation a été refusée', error.message);
        })
    }

    loadPositions() {

        if (this.artworkList) {
            return Promise.resolve(this.artworkList);
        }

        return new Promise(resolve => {


            // this.http.get('assets/data/artwork.json')
            //     .map(res => res.json())
            //     .subscribe(data => {
            //             this.artworkList = data.artworks;
            //         },
            //         err => console.log("Erreur suivante lors de la récupération des frises :  " + err), // error
            //         () => console.log('Les frises ont été récupérées') // complete
            //     );


            this.http.get('assets/data/artwork.json')
                .map(res => res.json())
                .subscribe(data => {
                    console.log('Valeur de userGeo : ' + this.userGeo);
                        if (this.userGeo === true) {
                            this.artworkList = this.applyHaversine(data.artworks);
                            this.artworkList.sort((locationA, locationB) => {
                                return locationA.distance - locationB.distance;
                            });
                        } else {
                            this.artworkList = data.artworks.sort(this.sortByProperty('name'));
                        }
                        resolve(this.artworkList);
                    },
                    err => console.log("Erreur suivante lors de la récupération des positions :  " + err), // error
                    () => console.log('Les positions ont été récupérées') // complete
                );

        });
        

    }

    sortByProperty(property) {

        return function (x, y) {
    
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

        return locations + 'km';
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

}