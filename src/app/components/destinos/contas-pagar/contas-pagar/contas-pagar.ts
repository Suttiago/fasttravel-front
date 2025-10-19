import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contas-pagar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contas-pagar.html',
  styleUrl: './contas-pagar.css'
})
export class ContasPagar implements OnChanges {
  // Entradas e Saídas do componente
  @Input() conta: any;
  @Input() modalAberto: boolean = false;
  @Output() fechar = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<any>();

  // Propriedades para o formulário de cartão
  numeroCartao: string = '';
  nomeTitular: string = '';
  dtValidadeCartao: string = '';
  cvv: string = '';

  // Propriedades para PIX e Boleto (dados de exemplo)
  pixQRCodeUrl: string = '';
  boletoBarcode: string = '';

  /**
   * Lifecycle hook que é chamado quando os @Inputs mudam.
   * Usado para gerar dados de PIX/Boleto quando o modal abre.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conta'] && this.conta) {
      // Gera dados fictícios quando uma nova conta é selecionada
      this.gerarDadosPagamento();
    }
  }

  /**
   * Gera um código de barras e um QR Code de exemplo.
   */
  private gerarDadosPagamento(): void {
    // Simula um código de barras de boleto
    this.boletoBarcode = '34191.79001 01043.510047 91020.101014 8 91710000219924';
    
    // Simula uma chave PIX para gerar um QR Code
    const chavePix = `00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266141740005204000053039865405${this.conta.valor.toFixed(2)}5802BR5913NOME_RECEBEDOR6008BRASILIA62070503***6304ABCD`;
    this.pixQRCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(chavePix)}`;
  }

  /**
   * Monta o payload e emite o evento para salvar.
   */
  onSalvar(): void {
    const hoje = new Date().toISOString().split('T')[0]; // Formato AAAA-MM-DD

    // Payload base
    const payload: any = {
      nome: `Pagamento da Conta #${this.conta.id}`,
      tipo: this.conta.metodo_pagamento,
      valor_pagamento: this.conta.valor,
      dt_pagamento: hoje,
      conta_pagar_id: this.conta.id,
      // Estes campos são nulos por defeito e só são preenchidos se for cartão
      numero_cartao: null,
      nome_titular: null,
      dt_validade_cartao: null,
      cvv: null,
      instituicao_pagamento: "Banco Inter",
      conta_bancaria: "111111"
    };

    // Adiciona os dados específicos do método de pagamento
    if (this.conta.metodo_pagamento === 'credito' || this.conta.metodo_pagamento === 'debito') {
      if (!this.numeroCartao || !this.nomeTitular || !this.dtValidadeCartao || !this.cvv) {
        alert('Por favor, preencha todos os dados do cartão.');
        return;
      }
      payload.numero_cartao = this.numeroCartao;
      payload.nome_titular = this.nomeTitular;
      payload.dt_validade_cartao = this.dtValidadeCartao;
      payload.cvv = this.cvv;
    } else {
        // Para boleto ou PIX, pode-se usar a instituição para o nome do banco
        payload.instituicao_pagamento = 'Banco Exemplo SA'; 
    }

    this.salvar.emit(payload);
  }

  /**
   * Emite o evento para fechar o modal.
   */
  onFechar(): void {
    this.fechar.emit();
  }

  /**
    * Copia um texto para a área de transferência.
    */
  copiarTexto(texto: string): void {
    navigator.clipboard.writeText(texto).then(() => {
      alert('Código copiado para a área de transferência!');
    }).catch(err => {
      console.error('Erro ao copiar texto: ', err);
      // Fallback para ambientes não seguros
      const textArea = document.createElement("textarea");
      textArea.value = texto;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        alert('Código copiado para a área de transferência!');
      } catch (e) {
        alert('Não foi possível copiar o código.');
      }
      document.body.removeChild(textArea);
    });
  }
}

