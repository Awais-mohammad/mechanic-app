import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
})
export class AuthComponent implements OnInit {
  
  currentView: string = "default";
  
  constructor(
    private router: Router
  ) {
    this.currentView = "default"
  }

  changeView(toView: string) {
    this.currentView = toView;
  }

  navigateTo(goto: string) {
    this.router.navigate([goto]);
  }

  ngOnInit() {}
}
