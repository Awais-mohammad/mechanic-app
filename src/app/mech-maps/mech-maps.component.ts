import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
declare const google: any;

@Component({
  selector: 'app-mech-maps',
  templateUrl: './mech-maps.component.html',
  styleUrls: ['./mech-maps.component.scss'],
})
export class MechMapsComponent implements OnInit {
  constructor(
    private firestore: AngularFirestore,
    private route: ActivatedRoute
  ) {}

  map: any;
  lat: number = 0;
  lng: number = 0;
  userLat: number = 0;
  userLng: number = 0;
  showRoute: boolean = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.showRoute = params.showmaps === 'true';
      console.log("paras",params)
      this.userLat = params.lats;
      this.userLng = params.longs;
      
    });

    this.getCurrentLocation();
    this.initMap();
    console.log("user lats",this.userLat,this.userLng)

    
  }

  initMap(): void {
    const mapOptions = {
      center: new google.maps.LatLng(this.lat, this.lng),
      zoom: 8,
    };
    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.displayMarkers();
          if (this.showRoute && this.userLat !== 0 && this.userLng !== 0) {
            this.drawPath();
          }        },
        (error) => {
          console.log('Error getting location:', error);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

  displayMarkers(): void {
    const currentPosition = new google.maps.LatLng(this.lat, this.lng);

    const userMarker = new google.maps.Marker({
      position: currentPosition,
      label: 'You',
      map: this.map,
    });

    this.map.setCenter(currentPosition); // Set map center to start point
    this.map.setZoom(12); // Set desired zoom level
  }


  drawPath(): void {
    console.log("draw method called",this.userLat,this.userLng)
    console.log("draw method called 2",this.lat,this.lng)

    const start = new google.maps.LatLng(this.lat, this.lng); // Start coordinate
    const end = new google.maps.LatLng(this.userLat, this.userLng); // End coordinate

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
}
