import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http, RequestOptions } from '@angular/http';

import { JwtModule } from '@auth0/angular-jwt';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

import { LoginFormComponent } from './login-form/login-form.component';
import { SegurancaRoutingModule } from './seguranca-routing.module';
import { AuthGuard } from './auth.guard';
import { LogoutService } from './logout.service';
import { environment } from '../../environments/environment';

export function tokenGetter() {
   return localStorage.getItem('token');
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,

    JwtModule.forRoot({
       config: {
         tokenGetter: tokenGetter,
         whitelistedDomains: environment.tokenWhitelistedDomains,
         blacklistedRoutes: environment.tokenBlacklistedRoutes
       }
    }),
    InputTextModule,
    ButtonModule,

    SegurancaRoutingModule
  ],
  declarations: [
     LoginFormComponent
  ],
  providers: [
     AuthGuard,
     LogoutService
  ]
})
export class SegurancaModule { }
