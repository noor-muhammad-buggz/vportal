import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth0-callback',
  templateUrl: './auth0-callback.component.html',
  styleUrls: ['./auth0-callback.component.scss']
})
export class Auth0CallbackComponent implements OnInit {

  constructor(private router: Router) {
    if(window.location.hash) {
      // Fragment exists
    } else {
      this.router.navigate(["/"]);
      // Fragment doesn't exist
    }
   }

  ngOnInit() {
  }

}
