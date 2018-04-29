import { Component } from '@angular/core';
import { Platform, NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-info',
  templateUrl: 'info.html'
})
export class InfoPage {

  infoArtwork: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform) {

    this.infoArtwork = navParams.get('artwork');
    console.log('this.infoArtwork = ' + JSON.stringify(this.infoArtwork));
    // alert('this.infoArtwork = ' + JSON.stringify(this.infoArtwork));

  }

  callItinerary(lat, lng) {
    var uri;  
    var pointName = 'Maison';  
    var coords = lat + ',' + lng;

    if (this.platform.is('ios')) {  
        uri = 'maps://?ll=' + coords + '&q=' + pointName;
    } else {
        uri = 'geo:0,0?q=' + coords + '(' + pointName + ')';
    }

    window.open(uri, '_system');  
  }


}
