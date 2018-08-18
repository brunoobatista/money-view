import { MoneyHttp } from './../seguranca/money-http';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from './../../environments/environment';
import { Pessoa } from './../core/model';
import 'rxjs/add/operator/toPromise';

export class PessoaFiltro {
   nome: string;
   pagina = 0;
   itensPorPagina = 5;
}

@Injectable()
export class PessoaService {

   pessoasUrl: string;

   constructor(private http: MoneyHttp) {
      this.pessoasUrl = `${environment.apiUrl}/pessoas`;
   }

   pesquisar(filtro: PessoaFiltro): Promise<any> {
      let params = new HttpParams({
         fromObject: {
            page: filtro.pagina.toString(),
            size: filtro.itensPorPagina.toString()
         }
      });

      if (filtro.nome) {
         params = params.append('nome', filtro.nome);
      }

      return this.http.get<any>(`${this.pessoasUrl}`, { params })
         .toPromise()
         .then(response => {
            const resultado = {
               pessoas: response.content,
               total: response.totalElements
            };
            return resultado;
         });
   }

   buscarPorCodigo(codigo: number): Promise<Pessoa> {
      return this.http.get<Pessoa>(`${this.pessoasUrl}/${codigo}`)
         .toPromise();
   }

   listaTodas(): Promise<any> {
      return this.http.get<any>(this.pessoasUrl)
         .toPromise()
         .then(response => response.content);
   }

   excluir(codigo: number, posicaDaPagina: number, itensPorPagina: number): Promise<any> {
      const dadosPagina = posicaDaPagina + itensPorPagina - 1;
      const params = new HttpParams({
         fromObject: {
            page: `${dadosPagina}`,
            size: '1'
         }
      });

      return this.http.delete<any>(`${this.pessoasUrl}/${codigo}`)
         .toPromise()
         .then(response => {
            if (response.ok) {
               return this.buscarProximo(params, dadosPagina);
            } else {
               return null;
            }
         });
   }

   buscarProximo(params, dadosPagina): Promise<any> {
      return this.http.get<any>(`${this.pessoasUrl}`, { params })
         .toPromise()
         .then(resp => {
            const resultado = {
               pessoas: resp.content,
               total: resp.totalElements
            };
            return (resultado.total + 1) < dadosPagina ? null : resultado;
         });
   }

   mudarStatus(codigo: number, ativo: boolean): Promise<void> {
      const headers = new HttpHeaders()
                     .append('Content-Type', 'application/json');
      return this.http.put<void>(`${this.pessoasUrl}/${codigo}/ativo`, ativo, { headers })
         .toPromise()
         .then(() => null);
   }

   adicionar(pessoa: Pessoa): Promise<Pessoa> {
      return this.http.post<Pessoa>(this.pessoasUrl, JSON.stringify(pessoa))
         .toPromise();
   }

   atualizar(pessoa: Pessoa): Promise<Pessoa> {
      return this.http.put<Pessoa>(`${this.pessoasUrl}/${pessoa.codigo}`, pessoa)
         .toPromise();
   }

}
