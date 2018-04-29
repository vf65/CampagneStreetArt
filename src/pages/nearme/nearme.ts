import { Component } from '@angular/core';
import 'rxjs/add/operator/map';
import { MapPage } from '../map/map';
import { Http } from '@angular/http';
import { Platform, NavController } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';


@Component({
    selector: 'page-nearme',
    templateUrl: 'nearme.html'
})

export class NearmePage extends MapPage {
    artworkList: any;
    userLat: number;
    userLng: number;
    requestEnableLocation: any;

    constructor(public navCtrl: NavController, public diagnostic: Diagnostic, public platform: Platform, public http: Http, public geolocation: Geolocation) {
        super(navCtrl, diagnostic, platform, http, geolocation);
    }

    ngAfterViewInit() {
        this.platform.ready().then(() => {
            this.loadUserPositions("nearme");
        });
    }
  
}