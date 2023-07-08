import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  currentURL: any;
  constructor(public router: Router) {
    this.currentURL = window.location.href.split('/').pop();
    console.log("current url",this.currentURL)
  }

  navigateTo(toNav: string) {
    this.router.navigateByUrl(toNav);
  }
}
