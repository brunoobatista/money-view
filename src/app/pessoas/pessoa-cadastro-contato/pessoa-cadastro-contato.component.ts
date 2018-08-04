import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Contato } from './../../core/model';

@Component({
  selector: 'app-pessoa-cadastro-contato',
  templateUrl: './pessoa-cadastro-contato.component.html',
  styleUrls: ['./pessoa-cadastro-contato.component.css']
})
export class PessoaCadastroContatoComponent implements OnInit {

   @Input('contatos') contatos: any[] = [];
   contatoIndex: number;
   exibindoFormularioContato = false;

   contato: Contato;

  constructor() { }

  ngOnInit() {
  }

   prepararNovoContato() {
      this.exibindoFormularioContato = true;
      this.contato = new Contato();
      this.contatoIndex =  this.contatos.length;
      console.log(this.contatoIndex);
   }

   confirmarContato(frm: FormControl) {
      const cont =  this.contatos;
      cont[this.contatoIndex] = this.clonarContato(this.contato);

      this.exibindoFormularioContato = false;
      frm.reset();
   }

   clonarContato(contato: Contato): Contato {
      return new Contato(contato.codigo, contato.nome, contato.email, contato.telefone);
   }

   prepararEdicaoContato(contato: Contato, index: number) {
      this.contato = this.clonarContato(contato);
      this.exibindoFormularioContato = true;
      this.contatoIndex = index;
   }

   removerContato(index: number) {
      const cont =  this.contatos;
      cont.splice(index, 1);
   }

   get editando() {
      return this.contato && this.contato.codigo;
   }

}
