import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mech-experties',
  templateUrl: './mech-experties.component.html',
  styleUrls: ['./mech-experties.component.scss'],
})
export class MechExpertiesComponent implements OnInit {
  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    const currentUser: any = this.auth.currentUser;
    const userID = currentUser ? currentUser.uid : null;
    this.auth.authState.subscribe((user :any) =>{
      console.log("user",user.uid)
      if (user.uid) { 
        this.firestore
        .collection('mechanics')
        .doc(user.uid)
        .get()
        .subscribe((doc) => {
          if (doc.exists) {
            const userData: any = doc.data();
            if (userData.expertiseList) {
              this.expertiseList = userData.expertiseList;
              console.log("experties lost",this.expertiseList)  
            }
          }
        });
      }});
  }

  expertiseList: { name: string; price: number }[] = [];
  expertiseName: string = '';
  expertisePrice: number = 0;

  addExpertise() {
    const expertise = { name: this.expertiseName, price: this.expertisePrice };

    // Add the expertise to the list
    this.expertiseList.push(expertise);

    // Get the current user ID
    const currentUser: any = this.auth.currentUser;
    const userID = currentUser ? currentUser.uid : null;
    this.auth.authState.subscribe((user :any) =>{
      console.log("user",user.uid)
      if (user.uid) {
        // Update the document in Firestore
        this.firestore
          .collection('mechanics')
          .doc(user.uid)
          .update({
            expertiseList: this.expertiseList,
          })
          .then(() => {
            console.log('Expertise added successfully.');
          })
          .catch((error) => {
            console.error('Error adding expertise:', error);
          });
      }
  
      // Clear input fields after adding
      this.expertiseName = '';
      this.expertisePrice = 0;
    })

   
  }
  gotoMain() {
    this.router.navigateByUrl('mech-dashboard');
  }
}
