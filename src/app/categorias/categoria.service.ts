import { Injectable } from '@angular/core';

import { environment } from './../../environments/environment';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class CategoriaService {

   categoriasUrl: string;

   constructor(
      private http: AuthHttp,
   ) {
      this.categoriasUrl = `${environment.apiUrl}/categorias`;
    }

   listarTodas(): Promise<any> {
      return this.http.get(this.categoriasUrl)
      .toPromise()
      .then(resp => {
         return resp.json();
      });
   }

}
