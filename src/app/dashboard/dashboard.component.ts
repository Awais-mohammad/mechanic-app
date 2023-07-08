import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private auth: AngularFireAuth
  ) {}

  nearByMechanics: any = [];

  ngOnInit(): void {
    this.firestore
      .collection('mechanics')
      .valueChanges()
      .subscribe((mechanics) => {
        console.log('Mechanics Data:', mechanics);
        this.nearByMechanics = mechanics;
      });
  }

  getRandomDistance(): string {
    return `20-40m away`;
  }

  navigateToMaps(lats: number, long: number) {
    this.router.navigate(['/maps'], {
      queryParams: { showmaps: true, lats: lats, longs: long },
    });
  }

  book(mechanic: any): void {
    const currentUser: any = this.auth.currentUser;
  
    if (currentUser) {
      const mechanicDocRef = this.firestore
        .collection('mechanics', ref => ref.where('cnic', '==', mechanic.cnic))
        .get()
        .subscribe(snapshot => {
          if (snapshot.empty) {
            console.log('No mechanic found with the specified CNIC.');
            // Handle case where no mechanic is found
            return;
          }
  
          snapshot.forEach(doc => {
            const mechanicId = doc.id;
            const timestamp = new Date();
  
            // Get current user's position (latitude and longitude)
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
  
                // Update mechanic document with user's data
                this.firestore.collection('mechanics').doc(mechanicId).collection('bookings').add({
                  latitude: latitude,
                  longitude: longitude,
                  name: currentUser.name ? currentUser.name : "User alpha",
                  timestamp: timestamp,
                })
                  .then(() => {
                    console.log('Mechanic booking successful.');
                    // Handle success or display a confirmation message to the user
                  })
                  .catch((error) => {
                    console.error('Error booking mechanic:', error);
                    // Handle error or display an error message to the user
                  });
              },
              (error) => {
                console.error('Error retrieving user location:', error);
                // Handle error or display an error message to the user
              }
            );
          });
        });
    } else {
      console.error('No user is currently signed in.');
      // Handle case where no user is signed in
    }
  }
  
}
