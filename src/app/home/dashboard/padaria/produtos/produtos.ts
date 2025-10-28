import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProdutosService, Produto } from '../../../../services/produtos';

@Component({
  selector: 'app-padaria-produtos',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    TableModule,
    ToolbarModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './produtos.html',
  styleUrls: ['./produtos.scss']
})
export class Produtos implements OnInit {
  produtos: Produto[] = [];
  filteredProdutos: Produto[] = [];
  loading = false;

  searchTerm = '';

  form!: FormGroup;
  displayDialog = false;
  viewMode = false;
  isEdit = false;
  selectedProduto: Produto | null = null;

  constructor(
    private produtosService: ProdutosService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadProdutos();
  }

  buildForm(produto?: Produto) {
    this.form = this.fb.group({
      nome: [produto?.nome || '', [Validators.required, Validators.minLength(2)]],
      preco: [produto?.preco ?? null],
      descricao: [produto?.descricao || ''],
      ativo: [produto?.ativo ?? true]
    });
  }

  loadProdutos() {
    this.loading = true;
    this.produtosService.listAll().subscribe({
      next: (data) => {
        this.produtos = data || [];
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar produtos.' });
      }
    });
  }

  applyFilter() {
    const term = (this.searchTerm || '').toLowerCase();
    if (!term) {
      this.filteredProdutos = [...this.produtos];
      return;
    }
    this.filteredProdutos = this.produtos.filter(p =>
      (p.nome || '').toLowerCase().includes(term) ||
      (p.descricao || '').toLowerCase().includes(term)
    );
  }

  trackByProdutoId(index: number, item: Produto) {
    return item.id ?? index;
  }

  onSearchTermChange() {
    this.applyFilter();
  }

  openNew() {
    this.isEdit = false;
    this.viewMode = false;
    this.selectedProduto = null;
    this.buildForm();
    this.form.enable();
    this.displayDialog = true;
  }

  viewProduto(produto: Produto) {
    this.isEdit = false;
    this.viewMode = true;
    this.selectedProduto = produto;
    this.buildForm(produto);
    this.form.disable();
    this.displayDialog = true;
  }

  editProduto(produto: Produto) {
    this.isEdit = true;
    this.viewMode = false;
    this.selectedProduto = produto;
    this.buildForm(produto);
    this.form.enable();
    this.displayDialog = true;
  }

  saveProduto() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: Produto = this.form.value;

    if (this.isEdit && this.selectedProduto?.id != null) {
      this.produtosService.update(this.selectedProduto.id, payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto atualizado.' });
          this.displayDialog = false;
          this.loadProdutos();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao atualizar produto.' });
        }
      });
    } else {
      this.produtosService.create(payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto criado.' });
          this.displayDialog = false;
          this.loadProdutos();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao criar produto.' });
        }
      });
    }
  }

  deleteProduto(produto: Produto) {
    if (produto.id == null) return;

    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o produto "${produto.nome}"?`,
      header: 'Confirmar exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.produtosService.delete(produto.id!).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto excluído.' });
            this.loadProdutos();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao excluir produto.' });
          }
        });
      }
    });
  }
}