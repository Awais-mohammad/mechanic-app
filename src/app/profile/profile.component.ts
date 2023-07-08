import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  navigate(to: string) {
    this.router.navigateByUrl(to);
  }
  currentUser: any;

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser(): void {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.firestore
          .collection('users')
          .doc(user.uid)
          .get()
          .subscribe((snapshot) => {
            this.currentUser = snapshot.data();
            console.log(this.currentUser);
          });
      } else {
        this.currentUser = null;
      }
    });
  }

  resetPassword() {
    this.auth
      .sendPasswordResetEmail(this.currentUser?.email)
      .then(() => {
        console.log('Password reset email sent successfully.');
        // Handle success or display a confirmation message to the user
      })
      .catch((error) => {
        console.error('Error sending password reset email:', error);
        // Handle error or display an error message to the user
      });
  }

  deleteAccount(): void {
    const user: any = this.auth.currentUser;

    if (user) {
      user
        .delete()
        .then(() => {
          console.log('User account deleted successfully.');
          // Handle success or display a confirmation message to the user
          this.navigate('auth');
        })
        .catch((error: any) => {
          console.error('Error deleting user account:', error);
          // Handle error or display an error message to the user
        });
    } else {
      console.error('No user is currently signed in.');
      // Handle case where no user is signed in
    }
  }

  logout(): void {
    this.auth.signOut()
      .then(() => {
        console.log('User logged out successfully.');
        // Handle success or navigate to the desired page
      })
      .catch((error) => {
        console.error('Error logging out:', error);
        // Handle error or display an error message to the user
      });
  }
  
}
