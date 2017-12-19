import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { LogoutService } from '../../seguranca/logout.service';
import { AuthService } from './../../seguranca/auth.service';
import { ErrorHandlerService } from './../error-handler.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

   exibindoMenu = false;

  constructor(
      public auth: AuthService,
      private logoutService: LogoutService,
      private errorHandler: ErrorHandlerService,
      private router: Router
   ) { }

  ngOnInit() {
  }

  logout() {
   this.logoutService.logout()
      .then(() => {
         this.router.navigate(['/login']);
      })
      .catch(error => this.errorHandler.handle(error));
  }

}
