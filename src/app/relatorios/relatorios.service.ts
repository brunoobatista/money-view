import { MoneyHttp } from './../seguranca/money-http';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { environment } from './../../environments/environment';

import * as moment from 'moment';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RelatoriosService {

   lancamentosUrl: string;

  constructor(private http: MoneyHttp) {
     this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
  }

   relatorioLancamentosPorPessoa(inicio: Date, fim: Date) {
      const params = new HttpParams()
         .append('inicio', moment(inicio).format('YYYY-MM-DD'))
         .append('fim', moment(fim).format('YYYY-MM-DD'));

      return this.http.get(`${this.lancamentosUrl}/relatorios/por-pessoa`,
      { params, responseType: 'blob'})
         .toPromise();
   }

}
