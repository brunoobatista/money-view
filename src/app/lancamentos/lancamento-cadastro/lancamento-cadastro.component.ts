import { Title } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CategoriaService } from './../../categorias/categoria.service';
import { PessoaService } from './../../pessoas/pessoa.service';
import { LancamentoService } from './../lancamento.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { ToastyService } from 'ng2-toasty';

import { Lancamento } from './../../core/model';

@Component({
   selector: 'app-lancamento-cadastro',
   templateUrl: './lancamento-cadastro.component.html',
   styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {

   pt_BR: any;

   tipos = [
      { label: 'Receita', value: 'RECEITA' },
      { label: 'Despesa', value: 'DESPESA' }
   ];

   titulo: string;
   categorias = [];
   pessoas = [];
   lancamento = new Lancamento();

   constructor(
      private categoriaService: CategoriaService,
      private pessoaService: PessoaService,
      private lancamentoService: LancamentoService,
      private toasty: ToastyService,
      private errorHandler: ErrorHandlerService,
      private route: ActivatedRoute,
      private router: Router,
      private title: Title
   ) { }

   ngOnInit() {
      const codigoLancamento = this.route.snapshot.params['codigo'];
      if (codigoLancamento) {
         this.carregarLancamento(codigoLancamento);
         this.titulo = 'Editando lançamento';
      } else {
         this.titulo = 'Novo lançamento';
         this.title.setTitle(this.titulo);
      }
      this.carregarCategorias();
      this.carregarPessoas();
      this.traducao();
   }

   carregarLancamento(codigo: number) {
      this.lancamentoService.buscarPorCodigo(this.route.snapshot.params['codigo'])
         .then(resposta => {
            this.lancamento = resposta;
            this.atualizarTituloEdicao();
         })
         .catch(erro => this.errorHandler.handle(erro));
   }

   get editando() {
      return Boolean(this.lancamento.codigo);
   }

   novo(form: FormControl) {
      form.reset();
      setTimeout(function() {
         this.lancamento = new Lancamento();
      }.bind(this), 1);
      this.router.navigate(['/lancamentos/novo']);
   }

   salvar(form: FormControl) {
      if (this.editando) {
         this.atualizarLancamento(form);
      } else {
         this.adicionarLancamento(form);
      }
   }

   adicionarLancamento(form: FormControl) {
      this.lancamentoService.adicionar(this.lancamento)
         .then(lancamentoAdicionado => {
            this.toasty.success('Lançamento adicionado com sucesso!');
            this.router.navigate(['/lancamentos', lancamentoAdicionado.codigo]);
         }).catch(erro => this.errorHandler.handle(erro));
   }

   atualizarLancamento(form: FormControl) {
      this.lancamentoService.atualizar(this.lancamento)
         .then(resposta => {
            this.lancamento = resposta;
            this.toasty.success('Lançamento atualizado com sucesso!');
            this.atualizarTituloEdicao();
         })
         .catch(erro => this.errorHandler.handle(erro));
   }

   atualizarTituloEdicao() {
      this.title.setTitle(`Editando lançamento: ${this.lancamento.descricao}`);
   }

   carregarCategorias() {
      this.categoriaService.listarTodas()
         .then(categorias => {
            this.categorias = categorias.map(c => {
               return {label: c.nome, value: c.codigo};
            });
         })
         .catch(erro => this.errorHandler.handle(erro));
   }

   carregarPessoas() {
      this.pessoaService.listaTodas()
         .then(pessoas => {
            this.pessoas = pessoas.map(p => {
               return { label: p.nome, value: p.codigo };
            });
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
