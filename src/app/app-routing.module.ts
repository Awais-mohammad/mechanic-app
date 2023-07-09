import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapsComponent } from './maps/maps.component';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { MechDashboardComponent } from './mech-dashboard/mech-dashboard.component';
import { MechMapsComponent } from './mech-maps/mech-maps.component';
import { MechExpertiesComponent } from './mech-experties/mech-experties.component';

const routes: Routes = [
  {
    path: 'maps',
    component: MapsComponent,
  },
  {
    path: 'auth',
    component: AuthComponent,
  },
  {
    path: 'user-dashboard',
    component: DashboardComponent,
  },
  {
    path: 'user-profile',
    component: ProfileComponent,
  },
  {
    path: 'mech-dashboard',
    component: MechDashboardComponent,
  },
  {
    path: 'mech-maps',
    component: MechMapsComponent,
  },
  {
    path: 'mech-expetties',
    component: MechExpertiesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
