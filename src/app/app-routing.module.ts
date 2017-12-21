import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaginaNaoEncontradaComponent } from './core/pagina-nao-encontrada.component';
import { NaoAutorizadoComponent } from './core/nao-autorizado.component';

const routes: Routes = [
   { path: '', redirectTo: 'lancamentos', pathMatch: 'full' },
   { path: 'pagina-nao-encontrada', component: PaginaNaoEncontradaComponent },
   { path: 'nao-autorizado', component: NaoAutorizadoComponent},
   { path: '**', redirectTo: 'pagina-nao-encontrada', pathMatch: 'full'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
     RouterModule
  ]
})
export class AppRoutingModule { }