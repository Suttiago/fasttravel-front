import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-contas-pagar',
  imports: [],
  templateUrl: './contas-pagar.html',
  styleUrl: './contas-pagar.css'
})
export class ContasPagar {
    // Recebe a conta selecionada do componente pai
  @Input() conta: any;
  // Controla a visibilidade do modal
  @Input() modalAberto: boolean = false;

  // Eventos para comunicar com o componente pai
  @Output() fechar = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<any>();

  // Propriedades para os campos do formulário
  instituicaoPagamento: string = '';
  contaBancaria: string = '';

  /**
   * Chamado quando o botão 'Salvar' é clicado.
   * Monta o payload e emite o evento para o componente pai.
   */
  onSalvar(): void {
    if (!this.instituicaoPagamento || !this.contaBancaria) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const hoje = new Date().toISOString().split('T')[0]; // Formato AAAA-MM-DD

    // Monta o payload completo para a API
    const payload = {
      nome: `Pagamento da Conta #${this.conta.id}`,
      tipo: this.conta.metodo_pagamento, // Reutiliza o método da conta
      instituicao_pagamento: this.instituicaoPagamento,
      conta_bancaria: this.contaBancaria,
      valor_pagamento: this.conta.valor,
      dt_pagamento: hoje,
      conta_pagar_id: this.conta.id,
    };

    this.salvar.emit(payload);
  }

  /**
   * Emite o evento para fechar o modal.
   */
  onFechar(): void {
    this.fechar.emit();
  }

}
