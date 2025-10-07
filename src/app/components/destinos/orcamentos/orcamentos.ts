import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orcamentos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orcamentos.html',
  styleUrl: './orcamentos.css'
})
export class Orcamentos {
  @Input() modalAberto: boolean = false;
  @Input() precoHoteis: number | null = null;
  @Input() precoPassagens: number | null = null;
  @Input() totalOrcamento: number | null = null;

  @Output() aprovado = new EventEmitter<void>();
  @Output() recusado = new EventEmitter<void>();
  @Output() fecharModal = new EventEmitter<void>();

  get precoHoteisDisplay(): string | null {
    return this.precoHoteis != null ? `R$ ${this.precoHoteis.toLocaleString('pt-BR')}` : null;
  }

  get precoPassagensDisplay(): string | null {
    return this.precoPassagens != null ? `R$ ${this.precoPassagens.toLocaleString('pt-BR')}` : null;
  }

  get totalOrcamentoDisplay(): string | null {
    return this.totalOrcamento != null ? `R$ ${this.totalOrcamento.toLocaleString('pt-BR')}` : null;
  }

  aprovar(): void {
    this.aprovado.emit();
  }

  recusar(): void {
    this.recusado.emit();
  }

  fechar(): void {
    this.modalAberto = false;
    this.fecharModal.emit();
  }
}
