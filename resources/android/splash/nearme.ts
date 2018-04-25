import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-nearme',
  templateUrl: 'nearme.html'
})
export class NearmePage {

  constructor(public navCtrl: NavController) {

  }

}
