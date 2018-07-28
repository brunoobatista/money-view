import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http, RequestOptions } from '@angular/http';

import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

import { MoneyHttp } from './money-http';
import { AuthService } from './auth.service';
import { SharedModule } from './../shared/shared.module';
import { LoginFormComponent } from './login-form/login-form.component';
import { SegurancaRoutingModule } from './seguranca-routing.module';
import { AuthGuard } from './auth.guard';
import { LogoutService } from './logout.service';

export function authHttpServiceFactory(auth: AuthService, http: Http, options: RequestOptions) {
   const config = new AuthConfig({
      globalHeaders: [
         { 'Content-Type' : 'application/json' }
      ]
   });
   return new MoneyHttp(auth, config, http, options);
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,

    InputTextModule,
    ButtonModule,

    SegurancaRoutingModule
  ],
  declarations: [
     LoginFormComponent
  ],
  providers: [
     {
         provide: AuthHttp,
         useFactory: authHttpServiceFactory,
         deps: [AuthService, Http, RequestOptions]
     },
     AuthGuard,
     LogoutService
  ]
})
export class SegurancaModule { }
