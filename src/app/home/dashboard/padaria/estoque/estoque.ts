import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { MessageService, ConfirmationService } from 'primeng/api';
import { EstoqueService } from '../../../../services/estoque';
import { Produto, EntradaEstoqueDTO } from '../../../../models/estoque';
import { UnidadeMedida } from '../../../../enums/unidadeMedida';
import { TokenStorage } from '../../../../services/token-storage';

@Component({
  selector: 'app-padaria-estoque',
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
    InputNumberModule,
    DatePicker,
    Select,
    
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    TagModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './estoque.html',
  styleUrls: ['./estoque.scss']
})
export class Estoque implements OnInit {
  produtos: Produto[] = [];
  filteredProdutos: Produto[] = [];
  loading = false;

  searchTerm = '';

  form!: FormGroup;
  entradaForm!: FormGroup;
  displayDialog = false;
  displayEntradaDialog = false;
  viewMode = false;
  isEdit = false;
  selectedProduto: Produto | null = null;

  // Opções para dropdown
  unidadeMedidaOptions = [
    { label: 'Unidade (UN)', value: UnidadeMedida.UN },
    { label: 'Kilograma (KG)', value: UnidadeMedida.KG }
  ];

  // Controle de permissões
  canDelete = false;

  constructor(
    private fb: FormBuilder,
    private estoqueService: EstoqueService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private tokenStorage: TokenStorage,
    private cdr: ChangeDetectorRef
  ) {
    this.buildForm();
    this.buildEntradaForm();
  }

  ngOnInit() {
    this.checkPermissions();
    this.loadProdutos();
  }

  private checkPermissions() {
    const user = this.tokenStorage.getUser();
    const roles = user?.roles || [];
    this.canDelete = roles.includes('ADMIN') || roles.includes('MANAGER');
  }

  private buildForm(produto?: Produto) {
    this.form = this.fb.group({
      nome: [produto?.nome || '', [Validators.required, Validators.minLength(2)]],
      codigoBarras: [produto?.codigoBarras || '', [Validators.required]],
      precoVenda: [produto?.precoVenda || 0, [Validators.required, Validators.min(0.01)]],
      precoCusto: [produto?.precoCusto || 0, [Validators.required, Validators.min(0.01)]],
      unidadeMedida: [produto?.unidadeMedida || UnidadeMedida.UN, [Validators.required]],
      estoqueAtual: [produto?.estoqueAtual || 0, [Validators.required, Validators.min(0)]],
      estoqueMinimo: [produto?.estoqueMinimo || 0, [Validators.required, Validators.min(0)]],
      dataValidade: [produto?.dataValidade ? new Date(produto.dataValidade) : null, [Validators.required]]
    });
  }

  private buildEntradaForm() {
    this.entradaForm = this.fb.group({
      produtoId: [null, [Validators.required]],
      quantidade: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  loadProdutos() {
    this.loading = true;
    this.estoqueService.listAll().subscribe({
      next: (data) => {
        this.produtos = data;
        this.filteredProdutos = [...data];
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: 'Erro ao carregar produtos do estoque' 
        });
        this.loading = false;
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
      (p.codigoBarras || '').toLowerCase().includes(term)
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

  deleteProduto(produto: Produto) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o produto "${produto.nome}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.estoqueService.delete(produto.id).subscribe({
          next: () => {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Sucesso', 
              detail: 'Produto excluído com sucesso' 
            });
            this.loadProdutos();
          },
          error: (err) => {
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Erro', 
              detail: 'Erro ao excluir produto' 
            });
          }
        });
      }
    });
  }

  openEntradaEstoque(produto: Produto) {
    this.selectedProduto = produto;
    this.entradaForm.patchValue({
      produtoId: produto.id,
      quantidade: 0
    });
    this.displayEntradaDialog = true;
  }

  submitForm() {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      return;
    }

    const formValue = this.form.value;
    const produto: Produto = {
      ...formValue,
      dataValidade: formValue.dataValidade ? formValue.dataValidade.toISOString().split('T')[0] : null,
      id: this.selectedProduto?.id || 0
    };

    const operation = this.isEdit 
      ? this.estoqueService.update(this.selectedProduto!.id, produto)
      : this.estoqueService.create(produto);

    operation.subscribe({
      next: () => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Sucesso', 
          detail: `Produto ${this.isEdit ? 'atualizado' : 'criado'} com sucesso` 
        });
        this.displayDialog = false;
        this.loadProdutos();
      },
      error: (err) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: `Erro ao ${this.isEdit ? 'atualizar' : 'criar'} produto` 
        });
      }
    });
  }

  submitEntradaForm() {
    if (this.entradaForm.invalid) {
      this.markFormGroupTouched(this.entradaForm);
      return;
    }

    const entrada: EntradaEstoqueDTO = this.entradaForm.value;

    this.estoqueService.entradaEstoque(entrada).subscribe({
      next: () => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Sucesso', 
          detail: 'Entrada de estoque realizada com sucesso' 
        });
        this.displayEntradaDialog = false;
        this.loadProdutos();
      },
      error: (err) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: 'Erro ao realizar entrada de estoque' 
        });
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  hideDialog() {
    this.displayDialog = false;
    this.displayEntradaDialog = false;
  }

  getEstoqueSeverity(produto: Produto): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | null | undefined {
    if (produto.estoqueAtual <= 0) return 'danger';
    if (produto.estoqueAtual <= produto.estoqueMinimo) return 'warn';
    return 'success';
  }

  getEstoqueLabel(produto: Produto): string {
    if (produto.estoqueAtual <= 0) return 'Sem Estoque';
    if (produto.estoqueAtual <= produto.estoqueMinimo) return 'Estoque Baixo';
    return 'Normal';
  }

  isDataVencimentoProxima(dataValidade: string): boolean {
    const hoje = new Date();
    const vencimento = new Date(dataValidade);
    const diffTime = vencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  }

  isDataVencida(dataValidade: string): boolean {
    const hoje = new Date();
    const vencimento = new Date(dataValidade);
    return vencimento < hoje;
  }
}