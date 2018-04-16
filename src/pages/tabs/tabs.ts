import { Component } from '@angular/core';

import { ProximPage } from '../proxim/proxim';
import { AboutPage } from '../about/about';
import { MapPage } from '../map/map';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = MapPage;
  tab2Root = ProximPage;
  tab3Root = AboutPage;

  constructor() {

  }
}
