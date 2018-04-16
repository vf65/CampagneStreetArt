import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker } from '@ionic-native/google-maps';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  constructor(public navCtrl: NavController, private googleMaps: GoogleMaps, public platform: Platform) {
    platform.ready().then(() => {
      this.loadMap();
    });
  }

  loadMap(){

    // create a new map by passing HTMLElement
    let element: HTMLElement = document.getElementById('map');

    let map: GoogleMap = GoogleMaps.create(element);

    // Listen to MAP_READY event
    // You must wait for this event to fire before adding something to the map or modifying it in anyway
    map.one(GoogleMapsEvent.MAP_READY).then(
      ()=> {
        console.log('La carte est prête');
        // Now you can add elements to the map like the marker
      }
    );

    // create LatLng object
    let ionic: LatLng = new LatLng(43.0741904,-89.3809802);

    // create CameraPosition
    let position: CameraPosition<any> = {
      target: ionic,
      zoom: 18,
      tilt: 30
    };

    // move the map's camera to position
    map.moveCamera(position);

    // create new marker
    let markerOptions: MarkerOptions = {
      position: ionic,
      title: 'Ionic'
    };

    map.addMarker(markerOptions)
    .then((marker: Marker) => {
        marker.showInfoWindow();
    });

  }

}
