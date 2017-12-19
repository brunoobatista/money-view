import { URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';

import { environment } from './../../environments/environment';
import { AuthHttp } from 'angular2-jwt';
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

   constructor(private http: AuthHttp) {
      this.pessoasUrl = `${environment.apiUrl}/pessoas`;
   }

   pesquisar(filtro: PessoaFiltro): Promise<any> {
      const params = new URLSearchParams();

      params.set('page', filtro.pagina.toString());
      params.set('size', filtro.itensPorPagina.toString());

      if (filtro.nome) {
         params.set('nome', filtro.nome);
      }

      return this.http.get(`${this.pessoasUrl}`, { search: params })
         .toPromise()
         .then(response => {
            const responseJson = response.json();
            const resultado = {
               pessoas: responseJson.content,
               total: responseJson.totalElements
            };
            return resultado;
         });
   }

   buscarPorCodigo(codigo: number): Promise<Pessoa> {
      return this.http.get(`${this.pessoasUrl}/${codigo}`)
         .toPromise()
         .then(response => response.json());
   }

   listaTodas(): Promise<any> {
      return this.http.get(this.pessoasUrl)
         .toPromise()
         .then(response => response.json().content);
   }

   excluir(codigo: number, posicaDaPagina: number, itensPorPagina: number): Promise<any> {
      const params = new URLSearchParams();
      const dadosPagina = posicaDaPagina + itensPorPagina - 1;
      params.set('page', `${dadosPagina}`);
      params.set('size', '1');

      return this.http.delete(`${this.pessoasUrl}/${codigo}`)
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
      return this.http.get(`${this.pessoasUrl}`, { search: params })
         .toPromise()
         .then(resp => {
            const responseJson = resp.json();
            const resultado = {
               pessoas: responseJson.content,
               total: responseJson.totalElements
            };
            return (resultado.total + 1) < dadosPagina ? null : resultado;
         });
   }

   mudarStatus(codigo: number, ativo: boolean): Promise<void> {
      return this.http.put(`${this.pessoasUrl}/${codigo}/ativo`, ativo)
      .toPromise()
      .then(() => null);
   }

   adicionar(pessoa: Pessoa): Promise<Pessoa> {
      return this.http.post(this.pessoasUrl, JSON.stringify(pessoa))
         .toPromise()
         .then(resposta => resposta.json());
   }

   atualizar(pessoa: Pessoa): Promise<Pessoa> {
      return this.http.put(`${this.pessoasUrl}/${pessoa.codigo}`,
            JSON.stringify(pessoa))
         .toPromise()
         .then(response => response.json() as Pessoa);
   }

}
