import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { ToastyService } from 'ng2-toasty';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { PessoaService } from './../pessoa.service';

import { Pessoa } from './../../core/model';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {

   pessoa = new Pessoa();
   titulo: string;
   formulario: FormGroup;

   constructor(
      private pessoaService: PessoaService,
      private errorHandler: ErrorHandlerService,
      private toasty: ToastyService,
      private route: Router,
      private activatedRoute: ActivatedRoute,
      private title: Title,
      private formBuilder: FormBuilder
   ) { }

   ngOnInit() {
      const codigoPessoa = this.activatedRoute.snapshot.params['codigo'];
      console.log('codigopessoa: ', codigoPessoa);
      if (codigoPessoa) {
         this.carregarPessoa(codigoPessoa);
         this.titulo = 'Editar pessoa';
      } else {
         this.titulo = 'Nova pessoa';
         this.title.setTitle(`Nova pessoa`);
      }
   }

   configurarFormulario() {
      this.formulario = this.formBuilder.group({
         codigo: [],
         nome: [null, [this.validarObrigatoriedade, this.validarTamanhoMinimo(5)]],
         logradouro: [null, this.validarObrigatoriedade],
         numero: [null, this.validarObrigatoriedade],
         complemento: [],
         bairro: [null, this.validarObrigatoriedade],
         cep: [null, this.validarObrigatoriedade],
         cidade: [null, this.validarObrigatoriedade],
         estado: [null, this.validarObrigatoriedade]
      });
   }

   validarObrigatoriedade(input: FormControl) {
      return (input.value ? null : { obrigatoriedade: true });
   }

   validarTamanhoMinimo(valor: number) {
      return (input: FormControl) => {
         return (!input.value || input.value.length >= valor) ? null : { tamanhoMinimo: { tamanho: valor } };
      };
   }

   carregarPessoa(codigo: number) {
      this.pessoaService.buscarPorCodigo(codigo)
      .then(resposta => {
         this.pessoa = resposta;
         this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
   }

   salvar(form: FormControl) {
      if (this.editando) {
         this.atualizarPessoa(form);
      } else {
         this.adicionarPessoa(form);
      }
   }

   novo(form: FormControl) {
      form.reset();
      setTimeout(function() {
         this.pessoa = new Pessoa();
      }.bind(this), 1);
      this.route.navigate(['/pessoas/nova']);
   }

   get editando() {
      return Boolean(this.pessoa.codigo);
   }

   adicionarPessoa(form: FormControl) {
      this.pessoaService.adicionar(this.pessoa)
         .then(pessoaAdicionada => {
            this.toasty.success('Pessoa salva com sucesso!');
            this.route.navigate(['/pessoas', pessoaAdicionada.codigo]);
         }).catch(erro => this.errorHandler.handle(erro));
   }

   atualizarPessoa(form: FormControl) {
      this.pessoaService.atualizar(this.pessoa)
         .then(response => {
            this.pessoa = response;
            this.toasty.success('Pessoa atualizada com sucesso!');
            this.atualizarTituloEdicao();
         }).catch(error => this.errorHandler.handle(error));
   }

   atualizarTituloEdicao() {
      this.title.setTitle(`Editando pessoa: ${this.pessoa.nome}`);
   }

}
