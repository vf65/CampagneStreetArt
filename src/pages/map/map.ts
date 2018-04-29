  import { Component } from '@angular/core';
  import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions } from '@ionic-native/google-maps';
  import { Geolocation } from '@ionic-native/geolocation';
  import { Platform, NavController } from 'ionic-angular';
  import { MapStyle } from './map-style';
  import { Http } from '@angular/http';
  import 'rxjs/add/operator/map';
  import { InfoPage } from '../info/info';
  import { Diagnostic } from '@ionic-native/diagnostic';
  
  @Component({
    selector: 'page-map',
    templateUrl: 'map.html'
  })
  
  export class MapPage {
    mapReady: boolean = false;
    map: GoogleMap;
    artworkList: any;
    artworkBounds = [];
    userLat: number;
    userLng: number;
    initialMapLoad: boolean = true;
    constructor(public navCtrl: NavController, public diagnostic: Diagnostic, public platform: Platform, public http: Http, public geolocation: Geolocation) {
    }

    ngAfterViewInit() {
        this.platform.ready().then(() => {
            this.loadMap();
            this.loadUserPositions("map");
        });
    }
  
    loadMap() {
  
        let mapOptions: GoogleMapOptions = {
            styles: MapStyle,
            camera: {
                target: {
                    lat: 50.05760230576669,
                    lng: 1.6356562847967098
                },
                zoom: 5,
                tilt: 0,
                bearing: 0,
            }
        };

        this.map = GoogleMaps.create('map_canvas', mapOptions);
  
        // Wait the MAP_READY before using any methods.
        this.map.one(GoogleMapsEvent.MAP_READY)
            .then(() => {
                console.log('La carte est opérationelle');
                // alert('La carte est opérationelle');
  
                // var bounds = this.map..LatLngBounds();
  
                for (let _i = 0; _i < this.artworkList.length; _i++) {
  
                    // Incrémentation du tableau des bornes
                    this.artworkBounds.push({
                        lat: this.artworkList[_i].latitude,
                        lng: this.artworkList[_i].longitude
                    });
  
                    // Ajout des marqueurs
                    this.map.addMarker({
                            icon: {
                                url: "assets/imgs/marker.png",
                                size: {
                                    width: 20,
                                    height: 35
                                }
                            },
                            disableAutoPan: true,
                            position: {
                                lat: this.artworkList[_i].latitude,
                                lng: this.artworkList[_i].longitude
                            }
                        })
                        .then(marker => {
                            marker.on(GoogleMapsEvent.MARKER_CLICK)
                                .subscribe(() => {
                                    // alert(this.artworkList[_i]);
                                    this.showInfo(this.artworkList[_i]);
                                });
                        });
                }
  
                this.map.animateCamera({
                    target: this.artworkBounds,
                    duration: 3000
                });
  
            });
  
    }

    loadUserPositions(type) {
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
            this.loadPositions(type);
        });
    }4




    loadPositions(type) {
        // alert('loadPositions exécuté');

        return new Promise(resolve => {

            this.http.get('assets/data/artwork.json')
                .map(res => res.json())
                .subscribe(data => {
                        if(type == "map"){
                            this.artworkList = data.artworks;
                        }else{
                            this.artworkList = this.applyHaversine(data.artworks);
                            this.artworkList.sort((locationA, locationB) => {
                                return locationA.distance - locationB.distance;
                            });
                        }
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