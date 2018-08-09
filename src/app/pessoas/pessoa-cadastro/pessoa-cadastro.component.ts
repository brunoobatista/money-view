import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastyService } from 'ng2-toasty';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { PessoaService } from './../pessoa.service';

import { Pessoa, Contato } from './../../core/model';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {

   // pessoa = new Pessoa();
   titulo: string;
   formulario: FormGroup;

   contato: Contato;

   constructor(
      private pessoaService: PessoaService,
      private errorHandler: ErrorHandlerService,
      private toasty: ToastyService,
      private route: Router,
      private activatedRoute: ActivatedRoute,
      private title: Title,
      private formBuilder: FormBuilder,
   ) { }

   ngOnInit() {
      this.configurarFormulario();
      const codigoPessoa = this.activatedRoute.snapshot.params['codigo'];
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
         codigo: [null],
         ativo: [null],
         nome: [null, [this.validarObrigatoriedade, this.validarTamanhoMinimo(5)]],
         contatos: [ this.formBuilder.group({
            codigo: [null],
            nome: [null],
            email: [null],
            telefone: [null]
         }) ],
         endereco: this.formBuilder.group({
            bairro: [null, this.validarObrigatoriedade],
            cep: [null, this.validarObrigatoriedade],
            cidade: [null, this.validarObrigatoriedade],
            complemento: [],
            estado: [null, this.validarObrigatoriedade],
            logradouro: [null, this.validarObrigatoriedade],
            numero: [null, this.validarObrigatoriedade]
         }),

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
      this.pessoaService.buscarPorCodigo(this.activatedRoute.snapshot.params['codigo'])
      .then(resposta => {
         this.formulario.patchValue(resposta);
         this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
   }

   salvar() {
      if (this.editando) {
         this.atualizarPessoa();
      } else {
         this.adicionarPessoa();
      }
   }

   novo() {
      this.formulario.reset();
      this.route.navigate(['/pessoas/nova']);
   }

   get editando() {
      return Boolean(this.formulario.get('codigo').value);
   }

   adicionarPessoa() {
      this.pessoaService.adicionar(this.formulario.value)
         .then(pessoaAdicionada => {
            this.toasty.success('Pessoa salva com sucesso!');
            this.route.navigate(['/pessoas', pessoaAdicionada.codigo]);
         }).catch(erro => this.errorHandler.handle(erro));
   }

   atualizarPessoa() {
      this.pessoaService.atualizar(this.formulario.value)
         .then(response => {
            this.formulario.patchValue(response);
            this.toasty.success('Pessoa atualizada com sucesso!');
            this.atualizarTituloEdicao();
         }).catch(error => this.errorHandler.handle(error));
   }

   atualizarTituloEdicao() {
      this.title.setTitle(`Editando pessoa: ${this.formulario.get('nome')}`);
   }

}
