import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';

import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = TabsPage;
  userLat: number;
  userLng: number;

  pages: Array<{title: string, component: any}>;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, geolocation: Geolocation) {
    
    platform.ready().then(() => {

      // Okay, so the platform is ready.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      if (platform.is('android')) {
        statusBar.overlaysWebView(false);
        statusBar.backgroundColorByHexString('#000000');
      }
      // splashScreen.hide();

      geolocation.getCurrentPosition().then((location) => {
      }).catch((error) => {
      });



      
    });
  }
  
}
