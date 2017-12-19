import { URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';

import { AuthHttp } from 'angular2-jwt';

import { Lancamento } from './../core/model';

import 'rxjs/add/operator/toPromise';
import * as moment from 'moment';
import { environment } from '../../environments/environment';

export class LancamentoFiltro {
   descricao: string;
   dataVencimentoInicio: Date;
   dataVencimentoFim: Date;
   pagina = 0;
   itensPorPagina = 5;
}

@Injectable()
export class LancamentoService {

   lancamentosUrl: string;

   constructor(private http: AuthHttp) {
      this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
   }

   pesquisar(filtro: LancamentoFiltro): Promise<any> {
      const params = new URLSearchParams();

      params.set('page', filtro.pagina.toString());
      params.set('size', filtro.itensPorPagina.toString());

      if (filtro.descricao) {
         params.set('descricao', filtro.descricao);
      }
      if (filtro.dataVencimentoInicio) {
         params.set('dataVencimentoDe', moment(filtro.dataVencimentoInicio).format('YYYY-MM-DD'));
      }
      if (filtro.dataVencimentoFim) {
         params.set('dataVencimentoAte', moment(filtro.dataVencimentoFim).format('YYYY-MM-DD'));
      }

      return this.http.get(`${this.lancamentosUrl}?resumo`, { search: params })
      .toPromise()
      .then(response => {
            const responseJson = response.json();
            const resultado = {
               lancamentos: responseJson.content,
               total: responseJson.totalElements
            };
            return resultado;
         });
   }

   excluir(codigo: number, posicaoDaPagina: number, itensPorPagina: number): Promise<any> {
      const params = new URLSearchParams();

      const dadosPagina = posicaoDaPagina + itensPorPagina - 1;

      params.set('page', `${dadosPagina}`);
      params.set('size', '1');

      return this.http.delete(`${this.lancamentosUrl}/${codigo}`)
         .toPromise()
         .then(response => {
            let proximoObjeto;
            if (response.ok) {
               proximoObjeto = this.buscarProximo(params, dadosPagina);
            } else {
               return null;
            }
            return proximoObjeto;
         });
   }

   buscarProximo(params, dadosPagina): Promise<any> {
      return this.http.get(`${this.lancamentosUrl}?resumo`, { search: params })
      .toPromise()
      .then(resp => {
         const responseJson = resp.json();
         const resultado = {
            lancamentos: responseJson.content,
            total: responseJson.totalElements
         };
         return (resultado.total + 1) < dadosPagina ? null : resultado;
      });
   }

   adicionar(lancamento: Lancamento): Promise<Lancamento> {
      return this.http.post(this.lancamentosUrl, JSON.stringify(lancamento))
         .toPromise()
         .then(resposta => resposta.json());
   }

   atualizar(lancamento: Lancamento): Promise<Lancamento> {
      return this.http.put(`${this.lancamentosUrl}/${lancamento.codigo}`,
            JSON.stringify(lancamento))
         .toPromise()
         .then(resposta => {
            const lancamentoAtualizado = resposta.json() as Lancamento;
            this.conveterStringParaDatas([lancamentoAtualizado]);
            return lancamentoAtualizado;
         });
   }

   buscarPorCodigo(codigo: number): Promise<Lancamento> {
      return this.http.get(`${this.lancamentosUrl}/${codigo}`)
         .toPromise()
         .then(resposta => {
            const lancamento = resposta.json() as Lancamento;
            this.conveterStringParaDatas([lancamento]);
            return lancamento;
         });
   }

   private conveterStringParaDatas(lancamentos: Lancamento[]) {
      lancamentos.forEach(lanc => {
         lanc.dataVencimento = moment(lanc.dataVencimento, 'YYYY-MM-DD').toDate();
         if (lanc.dataPagamento) {
            lanc.dataPagamento = moment(lanc.dataPagamento, 'YYYY-MM-DD').toDate();
         }
      });
   }

}
