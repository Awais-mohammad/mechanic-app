import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
})
export class AuthComponent implements OnInit {
  
  currentView: string = "default";
  
  constructor(
  ) {
    this.currentView = "default"
  }

  changeView(toView: string) {
    this.currentView = toView;
  }

  ngOnInit() {}
}
