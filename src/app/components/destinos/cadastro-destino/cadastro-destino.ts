import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { DestinosService } from '../destinos-service';
import { Router } from '@angular/router';

// CORREÇÃO 1: Importe o MÓDULO, não a classe do componente.
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-cadastro-destino',
  standalone: true,
  // CORREÇÃO 2: Use o MÓDULO aqui.
  imports: [FormsModule, CommonModule, NgxMaskDirective, AutoCompleteModule],
  templateUrl: './cadastro-destino.html',
  styleUrls: ['./cadastro-destino.css']
})
export class CadastroDestino implements OnInit {
  @Input() destinoEdicao: any;
  @Output() fecharModal = new EventEmitter<void>();

  cidades: any[] = [];
  cidadeSelecionadaObj: any = null; // Única variável necessária para o autocomplete

  // Propriedades do formulário
  id!: string;
  check_in!: string;
  check_out!: string;
  adultos!: number;
  criancas!: number;

  constructor(
    private readonly destinoService: DestinosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.destinoEdicao) {
      this.id = this.destinoEdicao.id;
      this.check_in = this.destinoEdicao.check_in;
      this.check_out = this.destinoEdicao.check_out;
      this.adultos = this.destinoEdicao.adultos;
      this.criancas = this.destinoEdicao.criancas;

      // CORREÇÃO 3: Preenche o objeto a partir de 'destinoEdicao', não dele mesmo.
      this.cidadeSelecionadaObj = {
        id: this.destinoEdicao.cidade_id,
        nome: this.destinoEdicao.destino,
        codigo_iat: this.destinoEdicao.codigo_iat,
        // O 'label' é crucial para a exibição inicial no campo de texto
        label: `${this.destinoEdicao.destino} (${this.destinoEdicao.codigo_iat || ''})`.trim()
      };
    }
  }

  buscarCidades(event: any): void {
    const termo = event.query;
    if (termo && termo.length > 1) {
      this.destinoService.ListarCidades(termo).subscribe({
        next: (dados) => {
          this.cidades = dados.map((c: any) => ({
            ...c,
            label: `${c.nome} (${c.codigo_iat ?? ''})`
          }));
        },
        error: (err) => {
          console.error('Erro ao buscar cidades', err);
          this.cidades = [];
        }
      });
    } else {
      this.cidades = [];
    }
  }

  // O onSelect no HTML já atualiza o objeto `cidadeSelecionadaObj` através do ngModel.
  // Este método explícito não é mais necessário, mas não causa mal.

  onSubmit(): void {
    if (!this.cidadeSelecionadaObj || typeof this.cidadeSelecionadaObj !== 'object') {
      alert('Selecione uma cidade válida da lista!');
      return;
    }

    const dadosEnvio = {
      id: this.id,
      destino: this.cidadeSelecionadaObj.nome,
      check_in: this.check_in,
      check_out: this.check_out,
      adultos: this.adultos,
      criancas: this.criancas,
      cidade_id: this.cidadeSelecionadaObj.id,
      codigo_iat: this.cidadeSelecionadaObj.codigo_iat
    };

    if (this.id) {
      this.destinoService.EditarDestinos(dadosEnvio).subscribe({
        next: () => { alert('Destino atualizado com sucesso!'); this.fecharModal.emit(); },
        error: (error) => { console.error('Erro ao atualizar', error); alert('Erro ao atualizar destino.'); }
      });
    } else {
      this.destinoService.CadastroDestinos(dadosEnvio).subscribe({
        next: () => { alert('Cadastro realizado com sucesso!'); this.fecharModal.emit(); this.router.navigate(['/destinos/listar']); },
        error: (error) => { console.error('Erro ao cadastrar', error); alert('Erro ao cadastrar'); }
      });
    }
  }
}