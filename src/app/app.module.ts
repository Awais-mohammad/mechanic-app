import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapsComponent } from './maps/maps.component';
import { AuthComponent } from './auth/auth.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { MechDashboardComponent } from './mech-dashboard/mech-dashboard.component';
import { MechMapsComponent } from './mech-maps/mech-maps.component';
import { MechServicesComponent } from './mech-services/mech-services.component';
import { MechExpertiesComponent } from './mech-experties/mech-experties.component';

@NgModule({
  declarations: [
    AppComponent,
    MapsComponent,
    AuthComponent,
    DashboardComponent,
    ProfileComponent,
    MechDashboardComponent,
    MechMapsComponent,
    MechServicesComponent,
    MechExpertiesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
