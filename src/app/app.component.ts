import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  currentURL: any;
  constructor(public router: Router) {
  
  }

  ngOnInit(): void {
    // Subscribe to the NavigationEnd event
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentURL = window.location.href.split('/').pop();
        console.log("current url",this.currentURL)
      }
    });
  }

  navigateTo(toNav: string) {
    this.router.navigateByUrl(toNav);
  }
}
