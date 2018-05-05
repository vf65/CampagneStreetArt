import { Component } from '@angular/core';

import { NearmePage } from '../nearme/nearme';
import { AboutPage } from '../about/about';
import { MapPage } from '../map/map';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = AboutPage;
  tab2Root = MapPage;
  tab3Root = NearmePage;

  constructor() {

  }
}
