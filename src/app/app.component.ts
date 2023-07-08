import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  currentURL: any;
  constructor(
    public router: Router,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}
  currentUser: any;
  ngOnInit(): void {
    // Subscribe to the NavigationEnd event
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentURL = window.location.href.split('/').pop();
        console.log('current url', this.currentURL);
      }
    });
    this.getCurrentUser();
  }

  navigateTo(toNav: string) {
    this.router.navigateByUrl(toNav);
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
            if (this.currentUser.userType === 'user') {
              this.navigateTo('user-dashboard');
            } else {
            }
          });
      } else {
        this.currentUser = null;
        this.navigateTo('auth');
      }
    });
  }
}
