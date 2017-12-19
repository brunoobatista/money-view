import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LazyLoadEvent } from 'primeng/components/common/api';
import { ToastyService } from 'ng2-toasty';
import { ConfirmationService } from 'primeng/components/common/api';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { LancamentoService, LancamentoFiltro } from './../lancamento.service';
import { AuthService } from '../../seguranca/auth.service';

@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css']
})
export class LancamentosPesquisaComponent implements OnInit {

   posicaoDaPagina: number;
   totalRegistros = 0;
   filtro = new LancamentoFiltro();
   lancamentos = [];
   @ViewChild('tabela') tabela;

   pt_BR: any;

   constructor(
      private auth: AuthService,
      private toasty: ToastyService,
      private errorHandler: ErrorHandlerService,
      private lancamentoService: LancamentoService,
      private confirmation: ConfirmationService,
      private title: Title
   ) {}

   ngOnInit() {
      // this.pesquisar();
      this.traducao();
      this.title.setTitle('Pesquisa de lançamentos');
   }

   pesquisar(pagina = 0) {
      this.filtro.pagina = pagina;
      this.lancamentoService.pesquisar(this.filtro)
         .then(resultados => {
            this.totalRegistros = resultados.total;
            this.lancamentos = resultados.lancamentos;
         })
         .catch(erro => this.errorHandler.handle(erro));
   }

   aoMudarPagina(event: LazyLoadEvent) {
      this.posicaoDaPagina = event.first;
      const pagina = this.posicaoDaPagina / event.rows;
      this.pesquisar(pagina);
   }

   confirmarExclusao(lancamento: any) {
      this.confirmation.confirm({
         message: 'Tem certeza que deseja excluir?',
         accept: () => {
            this.excluir(lancamento);
         }
      });
   }

   excluir(lancamento: any) {
      this.lancamentoService.excluir(lancamento.codigo, this.posicaoDaPagina, this.filtro.itensPorPagina)
         .then(resposta => {
            const index = this.lancamentos.findIndex(x => x.codigo === lancamento.codigo);
            this.lancamentos.splice(index, 1);
            if (this.lancamentos.length === 0) {
               this.tabela.first = 0;
            }
            if (resposta !== null && resposta.lancamentos[0] !== undefined) {
               this.lancamentos.push(resposta.lancamentos[0]);
            }
            this.toasty.success('Lançamento excluído com sucesso!');
            this.totalRegistros--;
         })
         .catch(erro => this.errorHandler.handle(erro));
   }

   traducao() {
      this.pt_BR = {
         firstDayOfWeek: 0,
         dayNames: [ 'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado' ],
         dayNamesShort: [ 'dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb' ],
         dayNamesMin: [ 'D', 'S', 'T', 'Q', 'Q', 'S', 'S' ],
         monthNames: [ 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro' ],
         monthNamesShort: [ 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez' ]
      };
   }

}
