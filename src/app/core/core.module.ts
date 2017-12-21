import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToastyModule } from 'ng2-toasty';
import { ConfirmDialogModule } from 'primeng/components/confirmdialog/confirmdialog';
import { ConfirmationService } from 'primeng/components/common/api';
import { JwtHelper } from 'angular2-jwt';

import { ErrorHandlerService } from './error-handler.service';
import { NavbarComponent } from './navbar/navbar.component';
import { LancamentoService } from './../lancamentos/lancamento.service';
import { PessoaService } from './../pessoas/pessoa.service';
import { AuthService } from './../seguranca/auth.service';

import { CategoriaService } from './../categorias/categoria.service';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada.component';
import { NaoAutorizadoComponent } from './nao-autorizado.component';

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

      ConfirmationService,
      JwtHelper,
      Title,
      { provide: LOCALE_ID, useValue: 'pt-BR'}
   ]
})
export class CoreModule { }