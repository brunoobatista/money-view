import { MoneyHttp } from './../seguranca/money-http';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

   constructor(private http: MoneyHttp) {
      this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
   }

   urlUploadAnexo(): string {
      return `${this.lancamentosUrl}/anexo`;
   }

   pesquisar(filtro: LancamentoFiltro): Promise<any> {
      let params = new HttpParams({
         fromObject: {
            page: filtro.pagina.toString(),
            size: filtro.itensPorPagina.toString()
         }
      });

      if (filtro.descricao) {
         params = params.append('descricao', filtro.descricao);
      }
      if (filtro.dataVencimentoInicio) {
         params = params.append('dataVencimentoDe', moment(filtro.dataVencimentoInicio).format('YYYY-MM-DD'));
      }
      if (filtro.dataVencimentoFim) {
         params = params.append('dataVencimentoAte', moment(filtro.dataVencimentoFim).format('YYYY-MM-DD'));
      }

      return this.http.get<any>(`${this.lancamentosUrl}?resumo`, { params })
      .toPromise()
      .then(response => {
            const resultado = {
               lancamentos: response.content,
               total: response.totalElements
            };
            return resultado;
         });
   }

   excluir(codigo: number, posicaoDaPagina: number, itensPorPagina: number): Promise<any> {
      const dadosPagina = posicaoDaPagina + itensPorPagina - 1;

      const params = new HttpParams({
         fromObject: {
            page: `${dadosPagina}`,
            size: '1'
         }
      });

      return this.http.delete<any>(`${this.lancamentosUrl}/${codigo}`)
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
      return this.http.get<any>(`${this.lancamentosUrl}?resumo`, { params })
      .toPromise()
      .then(resp => {
         const resultado = {
            lancamentos: resp.content,
            total: resp.totalElements
         };
         return (resultado.total + 1) < dadosPagina ? null : resultado;
      });
   }

   adicionar(lancamento: Lancamento): Promise<Lancamento> {
      return this.http.post<Lancamento>(this.lancamentosUrl, lancamento)
         .toPromise();
   }

   atualizar(lancamento: Lancamento): Promise<Lancamento> {
      return this.http.put<Lancamento>(`${this.lancamentosUrl}/${lancamento.codigo}`, lancamento)
         .toPromise()
         .then(resposta => {
            const lancamentoAtualizado = resposta;
            this.conveterStringParaDatas([lancamentoAtualizado]);
            return lancamentoAtualizado;
         });
   }

   buscarPorCodigo(codigo: number): Promise<Lancamento> {
      return this.http.get<Lancamento>(`${this.lancamentosUrl}/${codigo}`)
         .toPromise()
         .then(resposta => {
            const lancamento = resposta;
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
