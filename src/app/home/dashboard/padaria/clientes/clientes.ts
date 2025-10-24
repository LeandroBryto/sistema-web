import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ClientesService, Cliente, Venda } from '../../../../services/clientes';
import { TokenStorage } from '../../../../services/token-storage';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-padaria-clientes',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    TableModule,
    ToolbarModule,
    DialogModule,
    InputTextModule,
    InputMaskModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './clientes.html',
  styleUrls: ['./clientes.scss']
})
export class Clientes implements OnInit {
  clientes: Cliente[] = [];
  filteredClientes: Cliente[] = [];
  loading = false;

  searchTerm = '';

  form!: FormGroup;
  displayDialog = false;
  viewMode = false;
  isEdit = false;
  selectedCliente: Cliente | null = null;

  showHistorico = false;
  historico: Venda[] = [];
  historicoLoading = false;

  canDelete = false;

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private tokenStorage: TokenStorage,
    private cdr: ChangeDetectorRef
  ) {
    // Inicializa o form no construtor
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      cpf: [''],
      telefone: [''],
      email: ['', [Validators.email]]
    });
  }

  ngOnInit(): void {
    this.evaluatePermissions();
    this.loadClientes();
  }

  private evaluatePermissions() {
    const user = this.tokenStorage.getUser();
    const roles = this.extractRoles(user);
    this.canDelete = roles.includes('ROLE_GERENTE') || roles.includes('ROLE_ADMINISTRADOR');
  }

  private extractRoles(user: any): string[] {
    if (!user) return [];
    if (Array.isArray(user?.roles)) return user.roles;
    if (Array.isArray(user?.authorities)) return user.authorities.map((a: any) => typeof a === 'string' ? a : a?.authority);
    if (typeof user?.perfil === 'string') return [user.perfil];
    return [];
  }

  loadClientes() {
    this.loading = true;
    this.clientesService.listAll().subscribe({
      next: (data: Cliente[]) => {
        this.clientes = data || [];
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar clientes.' });
        this.cdr.detectChanges();
      }
    });
  }

  refreshList() {
    this.loadClientes();
  }

  applyFilter() {
    const term = (this.searchTerm || '').toLowerCase();
    const normalize = (v: any) => String(v ?? '').toLowerCase();
    this.filteredClientes = this.clientes.filter(c =>
      normalize(c.nome).includes(term) ||
      normalize(c.cpf).includes(term) ||
      normalize(c.telefone).includes(term) ||
      normalize(c.email).includes(term)
    );
  }

  trackByClienteId(index: number, item: Cliente) {
    return item.id ?? index;
  }

  openNew() {
    this.isEdit = false;
    this.viewMode = false;
    this.selectedCliente = null;
    this.buildForm();
    this.displayDialog = true;
    this.cdr.detectChanges();
  }

  viewCliente(cliente: Cliente) {
    this.isEdit = false;
    this.viewMode = true;
    this.selectedCliente = cliente;
    this.buildForm(cliente);
    this.form.disable();
    this.displayDialog = true;
    this.cdr.detectChanges();
  }

  editCliente(cliente: Cliente) {
    this.isEdit = true;
    this.viewMode = false;
    this.selectedCliente = cliente;
    this.buildForm(cliente);
    this.form.enable();
    this.displayDialog = true;
    this.cdr.detectChanges();
  }

  private buildForm(cliente?: Cliente) {
    this.form = this.fb.group({
      nome: [cliente?.nome ?? '', [Validators.required]],
      cpf: [cliente?.cpf ?? ''],
      telefone: [cliente?.telefone ?? ''],
      email: [cliente?.email ?? '', [Validators.email]]
    });
  }

  saveCliente() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.messageService.add({ severity: 'warn', summary: 'Validação', detail: 'Por favor, corrija os erros do formulário.' });
      return;
    }

    const payload: Cliente = { ...this.selectedCliente, ...this.form.value };

    if (this.isEdit && this.selectedCliente?.id) {
      this.clientesService.update(this.selectedCliente.id, payload).subscribe({
        next: (updated: Cliente) => {
          const idx = this.clientes.findIndex(c => c.id === updated.id);
          if (idx > -1) this.clientes[idx] = updated;
          this.applyFilter();
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente salvo.' });
          this.closeDialog();
          this.cdr.detectChanges();
        },
        error: (err: any) => this.handleHttpError(err, 'Falha ao salvar cliente')
      });
    } else {
      this.clientesService.create(payload).subscribe({
        next: (created: Cliente) => {
          this.clientes = [created, ...this.clientes];
          this.applyFilter();
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente salvo.' });
          this.closeDialog();
          this.cdr.detectChanges();
        },
        error: (err: any) => this.handleHttpError(err, 'Falha ao criar cliente')
      });
    }
  }

  deleteCliente(cliente: Cliente) {
    if (!cliente.id) return;

    this.confirmationService.confirm({
      message: `Deseja excluir o cliente "${cliente.nome}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.clientesService.delete(cliente.id!).subscribe({
          next: () => {
            this.clientes = this.clientes.filter(c => c.id !== cliente.id);
            this.applyFilter();
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente excluído.' });
            this.cdr.detectChanges();
          },
          error: (err: any) => this.handleHttpError(err, 'Falha ao excluir cliente')
        });
      }
    });
  }

  historicoCliente(cliente: Cliente) {
    if (!cliente.id) return;
    this.showHistorico = true;
    this.historicoLoading = true;
    this.clientesService.historico(cliente.id).subscribe({
      next: (vendas: Venda[]) => {
        this.historico = vendas || [];
        this.historicoLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.historicoLoading = false;
        this.handleHttpError(err, 'Falha ao carregar histórico');
        this.cdr.detectChanges();
      }
    });
  }

  closeDialog() {
    this.displayDialog = false;
    this.viewMode = false;
    if (this.form) this.form.enable();
    this.cdr.detectChanges();
  }

  isInvalid(controlName: string): boolean {
    const c = this.form.get(controlName);
    return !!c && c.touched && c.invalid;
  }

  private handleHttpError(err: any, fallback: string) {
    const status = err?.status;
    let detail = fallback;

    if (status === 400 || status === 422) {
      detail = err?.error?.message || 'Dados inválidos.';
    } else if (status === 404) {
      detail = 'Cliente não encontrado.';
    } else if (status === 409) {
      detail = err?.error?.message || 'Conflito de dados (duplicidade).';
    } else if (status === 403) {
      detail = 'Operação não permitida (403).';
    }

    this.messageService.add({ severity: 'error', summary: 'Erro', detail });
  }
}