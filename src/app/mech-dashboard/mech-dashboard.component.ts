import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-mech-dashboard',
  templateUrl: './mech-dashboard.component.html',
  styleUrls: ['./mech-dashboard.component.scss'],
})
export class MechDashboardComponent implements OnInit {
  mechanicId: string | null = null; // Mechanic ID (initialize as null)
  bookings: any[] = []; // Array to store mechanic's bookings

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Get the current logged-in user's data
    this.getCurrentUserData();
  }

  getCurrentUserData(): void {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.mechanicId = user.uid; // Set the mechanic ID to the current user's UID
        // Call the method to get mechanic bookings
        this.getMechanicBookings();
      } else {
        console.log('No user is currently logged in.');
        // Handle case where no user is logged in
      }
    });
  }

  getRandomDistance(): string {
    return `20-40m away`;
  }

  getMechanicBookings(): void {
    if (!this.mechanicId) {
      console.log('Mechanic ID is not available.');
      // Handle case where mechanic ID is not available
      return;
    }

    const bookingsCollection = this.firestore
      .collection('mechanics')
      .doc(this.mechanicId)
      .collection('bookings');

    bookingsCollection.get().subscribe(
      (snapshot: any) => {
        if (snapshot.empty) {
          console.log('No bookings found for the mechanic.');
          // Handle case where no bookings are found
          return;
        }

        this.bookings = []; // Clear previous bookings
        snapshot.forEach((doc: any) => {
          const booking = doc.data();
          this.bookings.push(booking);
        });

        console.log('Mechanic bookings:', this.bookings);
        // Process the bookings or update the UI as needed
      },
      (error: any) => {
        console.error('Error retrieving mechanic bookings:', error);
        // Handle error or display an error message to the user
      }
    );
  }

  addExperties() {
    this.router.navigateByUrl('mech-expetties');
  }

  acceptOrder(booking: any) {
    this.auth.authState.subscribe((user: any) => {
      if (user.uid) {
        // Update the document in Firestore
        this.firestore
          .collection('mechanics')
          .doc(user.uid)
          .update({
            paid: { name: booking.name },
          })
          .then(() => {
            console.log('User alpha added to the "paid" array.');

            // Delete the document in the subcollection
            // Delete documents in the subcollection
        this.firestore
          .collection('mechanics', (ref) =>
            ref
              .doc(user.uid)
              .collection('bookings')
              .where('name', '==', 'User alpha')
          )
          .get()
          .subscribe((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              doc.ref
                .update({
                  accepted : true,
                })
                .then(() => {
                  console.log(
                    'booking accepted.'
                  );
                  this.getMechanicBookings();
                })
                .catch((error) => {
                  console.error(
                    'Error deleting document from bookings subcollection:',
                    error
                  );
                });
            });
          });
          })
          .catch((error) => {
            console.error(
              'Error adding "User alpha" to "paid" array:',
              error
            );
          });
      }
    });
  }

  paid(booking: any) {
    console.log('booking paid for', booking);
    const currentUser: any = this.auth.currentUser;

    if (currentUser) {
      const userID = currentUser.uid;

      this.auth.authState.subscribe((user: any) => {
        if (user.uid) {
          // Update the document in Firestore
          this.firestore
            .collection('mechanics')
            .doc(user.uid)
            .update({
              paid: { name: booking.name },
            })
            .then(() => {
              console.log('User alpha added to the "paid" array.');
              alert("Money Recieved for the service")

              // Delete the document in the subcollection
              // Delete documents in the subcollection
          this.firestore
            .collection('mechanics', (ref) =>
              ref
                .doc(user.uid)
                .collection('bookings')
                .where('name', '==', 'User alpha')
            )
            .get()
            .subscribe((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                doc.ref
                  .delete()
                  .then(() => {
                    console.log(
                      'Document successfully deleted from bookings subcollection.'
                    );
                    this.getMechanicBookings();
                  })
                  .catch((error) => {
                    console.error(
                      'Error deleting document from bookings subcollection:',
                      error
                    );
                  });
              });
            });
            })
            .catch((error) => {
              console.error(
                'Error adding "User alpha" to "paid" array:',
                error
              );
            });
        }
      });
    }
  }

  navigateToMaps(lats: number, long: number) {
    this.router.navigate(['/mech-maps'], {
      queryParams: { showmaps: true, lats: lats, longs: long },
    });
  }

  reject(booking: any) {
    this.auth.authState.subscribe((user: any) => {
      if (user.uid) {
        // Delete the document in Firestore
        this.firestore
          .collection('mechanics')
          .doc(user.uid)
          .collection('bookings', ref => ref.where('name', '==', booking.name))
          .get()
          .subscribe((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              doc.ref
                .delete()
                .then(() => {
                  console.log('Booking deleted successfully.');
                  this.getMechanicBookings();
                })
                .catch((error) => {
                  console.error('Error deleting booking document:', error);
                });
            });
          });
      }
    });
  }
  
  call(phone: any) {
    const dialerUrl = this.generateDialerUrl(phone);
    window.open(dialerUrl.toString(), '_system');
  }

  generateDialerUrl(phoneNumber: string): SafeUrl {
    const telUrl = `tel:${phoneNumber}`;
    return this.sanitizer.bypassSecurityTrustUrl(telUrl);
  }
}
