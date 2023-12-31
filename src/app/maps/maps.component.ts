import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
declare const google: any;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
})
export class MapsComponent implements OnInit {
  mechanics: any[] = [];
  mechanics$: any[] = [];
  constructor(
    private firestore: AngularFirestore,
    private route: ActivatedRoute
  ) {
    
  }

  map: any;
  lat: number = 0;
  lng: number = 0;
  mechLat: number = 0;
  mechLng: number = 0;
  nearByMechanics: any[] = [];

  ngOnInit(): void {
    this.showRoute = false;
    this.route.queryParams.subscribe((params: any) => {
      this.showRoute = params.showmaps === 'true';
      this.mechLat = params.lats;
      this.mechLng = params.longs;
      console.log('mech lat long', this.mechLat, this.mechLng);
    });
    this.getCurrentLocation();
    this.initMap();
    this.firestore
    .collection('mechanics')
    .valueChanges()
    .subscribe((mechanics) => {
      console.log('Mechanics Data:', mechanics);
      this.nearByMechanics = mechanics;
      this.nearByMechanics = this.nearByMechanics.filter((mech: any) =>{
        return (!!mech.lat && !!mech.lng)
      });
      console.log("near by mechs",this.nearByMechanics)
      this.displayMechanicsOnMap();
    });
  }

  initMap(): void {
    const mapOptions = {
      center: new google.maps.LatLng(this.lat, this.lng),
      zoom: 8,
    };
    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  showRoute: boolean = false;
  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          console.log('lat', this.lat);
          if (this.showRoute) {
            this.drawPath();
          }
        },
        (error) => {
          console.log('Error getting location:', error);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

  drawPath(): void {
    const start = new google.maps.LatLng(this.lat, this.lng); // Start coordinate
    const end = new google.maps.LatLng(this.mechLat, this.mechLng); // End coordinate

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      map: this.map,
    });

    const request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (response: any, status: any) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(response);
        const leg = response.routes[0].legs[0];
        const path = leg.steps.map((step: any) => step.path).flat();

        const polyline = new google.maps.Polyline({
          path: path,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2,
        });
        polyline.setMap(this.map);

        const startMarker = new google.maps.Marker({
          position: start,
          label: 'Me',
          map: this.map,
        });

        const endMarker = new google.maps.Marker({
          position: end,
          label: 'End',
          map: this.map,
        });

        this.map.setCenter(start); // Set map center to start point
        this.map.setZoom(12); // Set desired zoom level
      }
    });
  }


  
  displayMechanicsOnMap(): void {
   const currentPosition = new google.maps.LatLng(this.lat, this.lng); // Current position

    const meMarker = new google.maps.Marker({
      position: currentPosition,
      label: 'You',
      map: this.map,
    });
    console.log("nearByMechanics",this.nearByMechanics)
    this.nearByMechanics.map((mechanic: any) => {
      console.log("mechanic.lat",mechanic.lat,mechanic.lng)
      const marker = new google.maps.Marker({
        position: { lat: mechanic.lat, lng: mechanic.lng },
        label: mechanic.name.charAt(0), // Use the first character of the name as the label
        map: this.map
      });
    });
    this.map.setCenter(currentPosition); // Set map center to current position
    this.map.setZoom(16); // Set desired zoom level
   
  }

  
}
