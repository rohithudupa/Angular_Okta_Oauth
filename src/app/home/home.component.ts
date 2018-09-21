import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import * as OktaSignIn from '@okta/okta-signin-widget';
import SamplesConfig from '../.samples.config';
interface ResourceServerExample {
  label: String;
  url: String;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isAuthenticated: boolean;
  hasSession : boolean;
  signIn: any;
  resourceServerExamples: Array<ResourceServerExample>;
  userName: string;
  widget = new OktaSignIn({
     
    baseUrl: SamplesConfig.oidc.issuer.split('/oauth2')[0],});

  constructor(public oktaAuth: OktaAuthService) {
    this.resourceServerExamples = [
      {
        label: 'Node/Express Resource Server Example',
        url: 'https://github.com/okta/samples-nodejs-express-4/tree/master/resource-server',
      },
      {
        label: 'Java/Spring MVC Resource Server Example',
        url: 'https://github.com/okta/samples-java-spring-mvc/tree/master/resource-server',
      },
    ]
    this.oktaAuth.$authenticationState.subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated)
    this.signIn = oktaAuth;

  }

  async ngOnInit() {
    this.widget.session.get(function (res){
      console.log(res.status)
      if(res.status==='ACTIVE')
        this.hasSession = true;
       else if (res.status==='INACTIVE')
        this.hasSession = false; 
    })
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    if (this.isAuthenticated) {
      const userClaims = await this.oktaAuth.getUser();
      this.userName = userClaims.name;
    }
  }
  login(){
    this.signIn.loginRedirect();
  }
}
