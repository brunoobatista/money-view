import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { ToastyModule } from 'ng2-toasty';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { JwtHelper } from 'angular2-jwt';

import { ErrorHandlerService } from './error-handler.service';
import { NavbarComponent } from './navbar/navbar.component';
import { LancamentoService } from './../lancamentos/lancamento.service';
import { PessoaService } from './../pessoas/pessoa.service';
import { AuthService } from './../seguranca/auth.service';
import { DashboardService } from './../dashboard/dashboard.service';
import { RelatoriosService } from './../relatorios/relatorios.service';

import { CategoriaService } from './../categorias/categoria.service';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada.component';
import { NaoAutorizadoComponent } from './nao-autorizado.component';

registerLocaleData(localePt);

@NgModule({
   imports: [
      CommonModule,
      RouterModule,
      ToastyModule.forRoot(),
      ConfirmDialogModule,
   ],
   declarations: [
      NavbarComponent,
      PaginaNaoEncontradaComponent,
      NaoAutorizadoComponent
   ],
   exports: [
      NavbarComponent,
      ToastyModule,
      ConfirmDialogModule
   ],
   providers: [
      LancamentoService,
      PessoaService,
      ErrorHandlerService,
      AuthService,

      CategoriaService,
      DashboardService,
      RelatoriosService,

      ConfirmationService,
      JwtHelper,
      Title,
      { provide: LOCALE_ID, useValue: 'pt'}
   ]
})
export class CoreModule { }
