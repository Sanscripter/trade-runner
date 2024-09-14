import { Routes } from '@angular/router';
import { MainMenuComponent } from './menu/main-menu/main-menu.component';
import { MapComponent } from './map/map.component';
import { LoadMenuComponent } from './menu/load-menu/load-menu.component';
import { LocationComponent } from './map/location/location.component';
import { StartScreenComponent } from './story/start-screen/start-screen.component';
import { EndScreenComponent } from './story/end-screen/end-screen.component';
import { CreditsComponent } from './story/credits/credits.component';
import { TravellingViewComponent } from './map/travelling-view/travelling-view.component';

export const routes: Routes = [
  {
    path: 'menu',
    component: MainMenuComponent,
    children: [
      {
        path: 'load',
        component: LoadMenuComponent
      }
    ]
  },
  {
    path: 'start',
    component: StartScreenComponent
  },
  {
    path: 'map',
    component: MapComponent,
  },
  {
    path: 'location',
    component: LocationComponent
  },
  {
    path: 'travelling',
    component: TravellingViewComponent
  },
  {
    path: 'end',
    component: EndScreenComponent
  },
  {
    path: 'credits',
    component: CreditsComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'menu'
  }
];
