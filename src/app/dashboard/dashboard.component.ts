import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
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
    private auth: AngularFireAuth,
    private sanitizer: DomSanitizer
  ) {}

  nearByMechanics: any = [];
  currentUsername: string = '';

  ngOnInit(): void {
    this.firestore
      .collection('mechanics')
      .valueChanges()
      .subscribe((mechanics) => {
        console.log('Mechanics Data:', mechanics);
        this.nearByMechanics = mechanics;
      });
    this.auth.authState.subscribe((user: any) => {
      console.log('userrrrrrrrrr', user);
      if (user.uid) {
        const currentUserDocRef = this.firestore
          .collection('users')
          .doc(user?.uid);
        currentUserDocRef.get().subscribe((docSnapshot: any) => {
          console.log('dataaaaaaaaaa', docSnapshot.data());
          const currentUserData = docSnapshot.data();
          // Handle the current user data here
          console.log('Current User Data:', currentUserData);
          this.currentUsername = currentUserData.name;
          console.log('my name -------->', this.currentUsername);
        });
      }
    });
  }
  totalPrice: number | null = null;

  calculateTotal(): void {
    this.totalPrice = this.selectedMech?.expertiseList
      .filter((expertise: any) => expertise.selected)
      .reduce((total: number, expertise: any) => total + expertise.price, 0);
  }

  showBox: boolean = false;
  experties: any;
  selectedMech: any;
  getService(mech: any) {
    this.selectedMech = mech;
    console.log(mech.expertiseList);
    if (mech.expertiseList) {
      this.experties = mech.expertiseList;
      console.log('selected Mech', this.selectedMech);
      this.showBox = true;
    } else {
      alert('No experties added booking it without unknown payment');
      this.book(mech);
    }
  }
  metch(param: string) {
    const trimmedMechanicName = (param || '').trim();
    const trimmedCurrentUsername = (this.currentUsername || '').trim();

    if (trimmedMechanicName.includes(trimmedCurrentUsername)) {
      console.log('Returning true');
      return true;
    } else {
      console.log('Returning false');
      return false;
    }
  }
  rate(param: any) {
    const cnic = param.cnic;

    this.firestore
      .collection('mechanics', (ref) => ref.where('cnic', '==', cnic))
      .get()
      .subscribe((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const mechanicRef = doc.ref;

          mechanicRef
            .update({
              paid: '',
            })
            .then(() => {
              console.log('Paid field removed successfully.');
              this.firestore
                .collection('mechanics')
                .valueChanges()
                .subscribe((mechanics) => {
                  console.log('Mechanics Data:', mechanics);
                  this.nearByMechanics = mechanics;
                });
            })
            .catch((error) => {
              console.error('Error removing paid field:', error);
            });
        });
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
  call(phone: any) {
    // const dialerUrl = this.generateDialerUrl(phone);
    // window.open(dialerUrl.toString(), '_system');
    navigator.clipboard.writeText(phone);
    alert("Number Copied "+ phone)
  }

  generateDialerUrl(phoneNumber: string): SafeUrl {
    const telUrl = `tel:${phoneNumber}`;
    return this.sanitizer.bypassSecurityTrustUrl(telUrl);
  }

  book(mechanic: any): void {
    this.showBox = false;
    const currentUser: any = this.auth.currentUser;

    if (currentUser) {
      const mechanicDocRef = this.firestore
        .collection('mechanics', (ref) =>
          ref.where('cnic', '==', mechanic.cnic)
        )
        .get()
        .subscribe((snapshot) => {
          if (snapshot.empty) {
            console.log('No mechanic found with the specified CNIC.');
            // Handle case where no mechanic is found
            return;
          }

          snapshot.forEach((doc) => {
            const mechanicId = doc.id;
            const timestamp = new Date();

            // Get current user's position (latitude and longitude)
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;

                // Update mechanic document with user's data
                this.firestore
                  .collection('mechanics')
                  .doc(mechanicId)
                  .collection('bookings')
                  .add({
                    latitude: latitude,
                    longitude: longitude,
                    name: currentUser.name ? currentUser.name : 'User alpha',
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
