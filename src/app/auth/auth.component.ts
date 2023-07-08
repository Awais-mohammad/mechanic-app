import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  currentView: string = 'default';
  mechanicEmail: string = '';
  mechanicPassword: string = '';
  userEmail: string = '';
  userPassword: string = '';
  mechanicName: string = '';
  mechanicCNIC: string = '';
  mechanicPhone: string = '';
  mechanicLocation: string = '';
  userName: string = '';
  userLocation: string = '';
  userPhone: string = '';
  lat: number = 0;
  lng: number = 0;
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    this.currentView = 'default';
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          console.log('lat', this.lat);
        },
        (error) => {
          console.log('Error getting location:', error);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

  changeView(toView: string) {
    this.currentView = toView;
  }

  navigateTo(goto: string) {
    this.router.navigate([goto]);
  }

  loginAsMechanic(): void {
    this.afAuth
      .signInWithEmailAndPassword(this.mechanicEmail, this.mechanicPassword)
      .then((userCredential) => {
        // Get the user data
        const user = userCredential.user;

        // Store the user type and other information in Firestore
        this.firestore.collection('users').doc(user?.uid).update({
          userType: 'mechanic',
          // Other data
        });

        // Redirect to the mechanic dashboard or desired page
        console.log('mechanoc login successful');
        this.navigateTo('mech-dashboard')
      })
      .catch((error) => {
        // Handle login error
        console.log('Login error:', error);
      });
  }

  loginAsUser(): void {
    this.afAuth
      .signInWithEmailAndPassword(this.userEmail, this.userPassword)
      .then((userCredential) => {
        // Get the user data
        const user = userCredential.user;

        // Store the user type and other information in Firestore
        this.firestore.collection('users').doc(user?.uid).update({
          userType: 'user',
          // Other data
        });

        // Redirect to the user dashboard or desired page
        this.navigateTo('user-dashboard');
      })
      .catch((error) => {
        // Handle login error
        console.log('Login error:', error);
      });
  }

  signUpAsMechanic(): void {
    this.afAuth
      .createUserWithEmailAndPassword(this.mechanicEmail, this.mechanicPassword)
      .then((userCredential) => {
        const user = userCredential.user;

        // Store mechanic data in Firestore
        this.firestore.collection('mechanics').doc(user?.uid).set({
          name: this.mechanicName,
          email: this.mechanicEmail,
          cnic: this.mechanicCNIC,
          phone: this.mechanicPhone,
          location: this.mechanicLocation,
          lat: this.lat,
          lng: this.lng,
          userType: 'mechanic'
          // Other mechanic data
        });

        // Redirect to mechanic dashboard or desired page
        console.log('mechanoc login successful');
        this.navigateTo('mech-dashboard')
      })
      .catch((error) => {
        // Handle signup error
        console.log('Signup error:', error);
      });
  }

  signUpAsUser(): void {
    this.afAuth
      .createUserWithEmailAndPassword(this.userEmail, this.userPassword)
      .then((userCredential) => {
        const user = userCredential.user;

        // Store user data in Firestore
        this.firestore.collection('users').doc(user?.uid).set({
          name: this.userName,
          email: this.userEmail,
          location: this.userLocation,
          phone: this.userPhone,
          lat: this.lat,
          lng: this.lng,
          userType: 'user',
          // Other user data
        });
        this.navigateTo('user-dashboard');
        // Redirect to user dashboard or desired page
      })
      .catch((error) => {
        // Handle signup error
        console.log('Signup error:', error);
      });
  }
  ngOnInit() {}
}
