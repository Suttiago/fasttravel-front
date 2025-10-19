import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinosService } from '../destinos-service';
import { FormsModule } from '@angular/forms';
import { concatMap } from 'rxjs/operators'; // Importante para encadear chamadas de API

/**
 * Define a estrutura dos dados que o modal emite ao aprovar.
 */
export interface AprovacaoPayload {
  metodoPagamento: string;
  numeroParcelas: number;
}

/**
 * Define a estrutura de um objeto de Orçamento.
 */
interface Orcamento {
  id: number;
  valor_passagens: number;
  valor_hoteis: number;
  valor_total: number;
  status: string;
  destino_id: number;
}

@Component({
  selector: 'app-orcamentos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orcamentos.html',
  styleUrls: ['./orcamentos.css']
})
export class Orcamentos implements OnInit {
  // --- ENTRADAS E SAÍDAS PARA O MODO MODAL ---

  /** Define o modo de exibição: 'modal' ou 'page'. Padrão é 'page'. */
  @Input() displayMode: 'modal' | 'page' = 'page';
  @Input() modalAberto: boolean = false;
  @Input() precoHoteis: number | null = null;
  @Input() precoPassagens: number | null = null;
  @Input() totalOrcamento: number | null = null;

  @Output() aprovado = new EventEmitter<AprovacaoPayload>(); // Agora emite os dados de pagamento
  @Output() recusado = new EventEmitter<void>();
  @Output() fecharModal = new EventEmitter<void>();

  // --- PROPRIEDADES PARA O MODO PÁGINA ---
  orcamentos: Orcamento[] = [];

  // --- LÓGICA DE PAGAMENTO (usada no modo modal) ---
  metodoPagamento: string = 'boleto';
  numeroParcelas: number = 1;

  constructor(private readonly destinosService: DestinosService) {}

  ngOnInit(): void {
    // Carrega a lista de orçamentos apenas se o componente estiver em modo 'page'
    if (this.displayMode === 'page') {
      this.carregarOrcamentos();
    }
  }


  get precoHoteisDisplay(): string {
    return this.precoHoteis?.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 2, // Garante 2 casas decimais
      maximumFractionDigits: 2  // Evita arredondamento
    }) ?? '-';
  }

  get precoPassagensDisplay(): string {
    return this.precoPassagens?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? '-';
  }

  get totalOrcamentoDisplay(): string {
    return this.totalOrcamento?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? '-';
  }

  // --- MÉTODOS DO MODAL ---

  /** Emite o evento de aprovação com os dados de pagamento. */
  aprovar(): void {
    const payload: AprovacaoPayload = {
      metodoPagamento: this.metodoPagamento,
      numeroParcelas: this.numeroParcelas,
    };
    this.aprovado.emit(payload);
  }

  recusar(): void {
    this.recusado.emit();
  }

  fechar(): void {
    this.fecharModal.emit();
  }

  /** Atualiza o número de parcelas com base no método de pagamento selecionado. */
  onMetodoPagamentoChange(novoMetodo: string): void {
    if (novoMetodo === 'credito') {
      this.numeroParcelas = 8; // Define 8 como padrão para crédito
    } else {
      this.numeroParcelas = 1; // Para outros métodos, a parcela é única
    }
  }

  // --- MÉTODOS DO MODO PÁGINA ---

  /** Carrega a lista de todos os orçamentos. */
  carregarOrcamentos(): void {
    this.destinosService.ListarOrcamentos().subscribe({
      next: (lista) => { this.orcamentos = lista || []; },
      error: (err) => { console.error('Erro ao listar orçamentos:', err); }
    });
  }

  /** Aprova um orçamento existente na lista. Refatorado com concatMap. */
  aprovarOrcamento(o: Orcamento): void {
    if (!o) return;
    this.destinosService.aceitarDestino(o.destino_id).pipe(
      concatMap(() => this.destinosService.editarOrcamento(o.id, { status: 'Pagamento Pendente' }))
    ).subscribe({
      next: () => {
        alert('Orçamento aprovado com sucesso');                   
        this.carregarOrcamentos(); // Atualiza a lista
      },
      error: (err) => {
        console.error('Erro no processo de aprovação do orçamento:', err);
        alert('Ocorreu um erro ao aprovar o orçamento.');
      }
    });
  }

  /** Recusa um orçamento existente na lista. Refatorado com concatMap. */
  recusarOrcamento(o: Orcamento): void {
    if (!o) return;
    this.destinosService.recusarDestino(o.destino_id).pipe(
      concatMap(() => this.destinosService.editarOrcamento(o.id, { status: 'Recusado' }))
    ).subscribe({
      next: () => {
        alert('Orçamento recusado com sucesso');
        this.carregarOrcamentos();
      },
      error: (err) => {
        console.error('Erro no processo de recusa do orçamento:', err);
        alert('Ocorreu um erro ao recusar o orçamento.');
      }
    });
  }
}