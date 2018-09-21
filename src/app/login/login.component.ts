
import { Component, OnInit } from '@angular/core';
import * as OktaSignIn from '@okta/okta-signin-widget';
import sampleConfig from '../.samples.config';
import { OktaAuthService } from '@okta/okta-angular';
import { Router } from '../../../node_modules/@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  signIn: any;
  isAuthenticated: boolean;

  
   widget = new OktaSignIn({
     
      baseUrl: sampleConfig.oidc.issuer.split('/oauth2')[0]
    });
    constructor(oktaAuth: OktaAuthService, router: Router) {
      this.signIn = oktaAuth;
    }

    
  ngOnInit() {
    let rend = this.widget;
    console.log(rend);
    let redirect = this.signIn;
    console.log(redirect)
    this.widget.session.get(function (res){
      if(res.status=== 'ACTIVE'){
        redirect.loginRedirect();
      }
      if(res.status== 'INACTIVE'){
        rend.renderEl({
          el: '#okta-signin-container'
        },
        (res) => {
          if (res.status === 'SUCCESS') {
            redirect.loginRedirect('/', { sessionToken: res.session.token });
            
            this.widget.hide();
          }
        },
          (error) => {
            console.log(error);
            throw error;
          },
        );
      
      }
    })
}
};
