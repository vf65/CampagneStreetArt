import { Component, ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { NavController, Tabs, ToastController } from 'ionic-angular';


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})


export class AboutPage {

  @ViewChild(Slides) slides: Slides;

  constructor(private nav: NavController, public toastCtrl: ToastController) {

  }

  selectTab(index: number) {
    var t: Tabs = this.nav.parent;
    t.select(index);
  }

  nextSlide() {
    this.slides.slideNext();
  }

  presentFDC() {
    let toast = this.toastCtrl.create({
      message: 'La Fête du Cinéma est une opération de promotion organisée par la Fédération Nationale des Cinémas Français et BNP Paribas. Elle a lieu dans les salles de cinéma partout en France, du 1er au 4 juillet 2018. www.feteducinema.com',
      duration: 6000
    });
    toast.present();
  }

}




