import { Component, OnInit } from '@angular/core';
declare const google: any;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {

  constructor() { }

  map: any;
  lat: number = 0;
  lng: number = 0;

  ngOnInit(): void {
    this.getCurrentLocation();
    this.initMap();
  }

  initMap(): void {
    const mapOptions = {
      center: new google.maps.LatLng(this.lat, this.lng),
      zoom: 8
    };
    this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
  }

  // drawPath(): void {
  //   const start = new google.maps.LatLng(51.673858, 7.815982); // Start coordinate
  //   const end = new google.maps.LatLng(51.723858, 7.895982); // End coordinate
  
  //   const path = new google.maps.Polyline({
  //     path: [start, end],
  //     geodesic: true,
  //     strokeColor: "#FF0000",
  //     strokeOpacity: 1.0,
  //     strokeWeight: 2
  //   });
  
  //   path.setMap(this.map);
  
  //   const startMarker = new google.maps.Marker({
  //     position: start,
  //     label: "Start",
  //     map: this.map
  //   });
  
  //   const endMarker = new google.maps.Marker({
  //     position: end,
  //     label: "End",
  //     map: this.map
  //   });
  
  //   this.map.setCenter(start); // Set map center to start point
  //   this.map.setZoom(12); // Set desired zoom level
  // }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          console.log("lat",this.lat)
          this.drawPath();
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
    const end = new google.maps.LatLng( 33.5961, 73.0538); // End coordinate
  
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({ map: this.map });
  
    const request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING
    };
  
    directionsService.route(request, (response : any, status : any) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(response);
        const leg = response.routes[0].legs[0];
        const path = leg.steps.map((step: any) => step.path).flat();
        
        const polyline = new google.maps.Polyline({
          path: path,
          geodesic: true,
          strokeColor: "#FF0000",
          strokeOpacity: 1.0,
          strokeWeight: 2
        });
        polyline.setMap(this.map);
  
        const startMarker = new google.maps.Marker({
          position: start,
          label: "Me",
          map: this.map
        });
  
        const endMarker = new google.maps.Marker({
          position: end,
          label: "End",
          map: this.map
        });
  
        this.map.setCenter(start); // Set map center to start point
        this.map.setZoom(12); // Set desired zoom level
      }
    });
  }
  
}
