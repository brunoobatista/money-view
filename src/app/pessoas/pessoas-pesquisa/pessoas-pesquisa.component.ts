import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/components/common/api';
import { ToastyService } from 'ng2-toasty';
import { ConfirmationService } from 'primeng/components/common/api';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { PessoaFiltro, PessoaService } from './../pessoa.service';
import { CategoriaService } from './../../categorias/categoria.service';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent {

   posicaoDaPagina: number;
   filtro = new PessoaFiltro();
   totalRegistros = 0;
   pessoas = [];
   @ViewChild('tabela') tabela;

   constructor(
      private pessoaService: PessoaService,
      private errorHandler: ErrorHandlerService,
      private toasty: ToastyService,
      private confirmation: ConfirmationService,
      private router: Router
   ) { }

   pesquisar(pagina = 0) {
      this.filtro.pagina = pagina;
      this.pessoaService.pesquisar(this.filtro)
         .then(resultados => {
            this.totalRegistros = resultados.total;
            this.pessoas = resultados.pessoas;
         })
         .catch(erro => this.errorHandler.handle(erro));
   }

   aoMudarPagina(event: LazyLoadEvent) {
      this.posicaoDaPagina = event.first;
      const pagina = this.posicaoDaPagina / event.rows;
      this.pesquisar(pagina);
   }

   confirmarExclusao(pessoa: any) {
      this.confirmation.confirm({
         message: 'Tem certeza que deseja excluir?',
         accept: () => {
            this.excluir(pessoa);
         }
      });
   }

   excluir(pessoa: any) {
      this.pessoaService.excluir(pessoa.codigo, this.posicaoDaPagina, this.filtro.itensPorPagina)
         .then(resposta => {
            const index = this.pessoas.findIndex(x => x.codigo === pessoa.codigo);
            this.pessoas.splice(index, 1);
            if (this.pessoas.length === 0) {
               this.tabela.first = 0;
            }
            if (resposta !== null && resposta.pessoas[0] !== undefined) {
               this.pessoas.push(resposta.pessoas[0]);
            }
            this.toasty.success('Pessoa excluída com sucesso!');
            this.totalRegistros--;
         })
         .catch(erro => this.errorHandler.handle(erro));
   }

   alternarStatus(pessoa: any) {
      const novoStatus = !pessoa.ativo;
      this.pessoaService.mudarStatus(pessoa.codigo, !pessoa.ativo)
         .then(() => {
            const acao = novoStatus ? 'ativada' : 'desativada';
            pessoa.ativo = novoStatus;
            this.toasty.success(`Pessoa ${acao} com sucesso!`);
         })
         .catch(erro => this.errorHandler.handle(erro));
   }

}
