import { Component } from '@angular/core';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions } from '@ionic-native/google-maps';
import { Platform } from 'ionic-angular';
import { MapStyle } from './map-style';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})

export class MapPage {
  mapReady: boolean = false;
  map: GoogleMap;
  artworkList: any;
  artworkBounds = [];

  constructor(public platform: Platform, private http:Http) {
    this.http.get('assets/data/artwork.json')
    .map(res => res.json())
    .subscribe(data => {
        this.artworkList = data.artworks;
      },
      err => console.log("Erreur suivante lors de la récupération des frises :  "+err), // error
      () => console.log('Les frises ont été récupérées') // complete
    );
  }

  ngAfterViewInit() {
    this.platform.ready().then(() => {
      this.loadMap();
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

        // var bounds = this.map..LatLngBounds();

        for (let _i = 0; _i < this.artworkList.length; _i++) {

          // Incrémentation du tableau des bornes
          this.artworkBounds.push({lat: this.artworkList[_i].latitude, lng: this.artworkList[_i].longitude});

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
                  alert(this.artworkList[_i].name);
                });
            });
        }

        this.map.animateCamera({
          target: this.artworkBounds,
          duration: 3000
        });
          
     });

  }

}