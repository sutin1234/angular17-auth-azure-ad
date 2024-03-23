import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {MsalService} from "@azure/msal-angular";
import {sign} from "node:crypto";
import {JsonPipe} from "@angular/common";
import {IdTokenClaims} from "@azure/msal-browser";

export interface User {
  homeAccountId: string
  environment: string
  tenantId: string
  username: string
  localAccountId: string
  name: string
  authorityType: string
  tenantProfiles: Record<string, any>
  idTokenClaims: IdTokenClaims
  idToken: string
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  msalService = inject(MsalService)

  user = signal<User | Record<string, any>>({})
  isLogin = signal(false)

  constructor() {
    effect(() => {
      console.log('user effect: ', this.user())
    }, );
  }

  ngOnInit(): void {
    this.msalService.handleRedirectObservable().subscribe()
    this.isLogin.set(!!this.msalService.instance.getAllAccounts().length)

    if(this.isLogin()) {
      this.user.set(this.msalService.instance.getAllAccounts()[0])
    }
  }

  onLogin() {
  this.msalService.loginPopup().subscribe(data => {
    console.log(data)
  })
  }

  onLogOut() {
    this.msalService.logout()
    this.user.set({})
  }
}
