/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache 2 license that can be
 * found in the LICENSE file and online at:
 * https://www.apache.org/licenses/LICENSE-2.0.html
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  constructor(_route: ActivatedRoute, public afAuth: AngularFireAuth) { }

  ngOnInit() {
  }

  login() {
    const provider = new auth.GoogleAuthProvider();
    // Add scopes etc here.
    // e.g. provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    // this.afAuth.auth.signInWithPopup(provider);
    this.afAuth.auth.signInWithPopup(provider).then((result: auth.UserCredential) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const token = (result.credential ? result.credential.accessToken : null;
      // The signed-in user info.
      const user = result.user;
      // console.log(`token: ${token}, user: ${user}`);
      console.log(`user: ${user}`);
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      const credential = error.credential;
      console.error(`login failed: errorCode: ${errorCode},
        errorMessage: ${errorMessage}
        email: ${email}
        credential: ${credential}
        `);
      // ...
    });

  }
  logout() {
    this.afAuth.auth.signOut();
  }
}
