import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { DestinosService } from '../destinos-service';
import { Router } from '@angular/router';
import { AutoComplete } from 'primeng/autocomplete';

@Component({
  selector: 'app-cadastro-destino',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxMaskDirective, AutoComplete],
  templateUrl: './cadastro-destino.html',
  styleUrls: ['./cadastro-destino.css']
})
export class CadastroDestino implements OnInit {
  @Input() destinoEdicao: any;
  @Output() fecharModal = new EventEmitter<void>();

  cidades: any[] = [];

  cidadeSelecionada: any = null; // 🔑 agora esse é o valor do autocomplete

  id!: string;
  check_in!: string;
  check_out!: string;
  adultos!: number;
  criancas!: number;
  status!: string;
  usuario_id!: number;

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

      // 🔑 Preenche cidadeSelecionada com o objeto
      this.cidadeSelecionada = {
        id: this.destinoEdicao.cidade_id,
        nome: this.destinoEdicao.destino,
        codigo_iat: this.destinoEdicao.codigo_iat
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
            label: `${c.nome} (${c.codigo_iat})`
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

  onSubmit(): void {
    if (!this.cidadeSelecionada) {
      alert('Selecione uma cidade válida!');
      return;
    }

    const dadosEnvio = {
      id: this.id,
      destino: this.cidadeSelecionada.nome,
      check_in: this.check_in,
      check_out: this.check_out,
      adultos: this.adultos,
      criancas: this.criancas,
      cidade_id: this.cidadeSelecionada.id,
      codigo_iat: this.cidadeSelecionada.codigo_iat
    };

    if (this.id) {
      this.destinoService.EditarDestinos(dadosEnvio).subscribe({
        next: () => {
          alert('Destino atualizado com sucesso!');
          this.fecharModal.emit();
        },
        error: (error) => {
          console.error('Erro ao atualizar', error);
          alert('Erro ao atualizar destino.');
        }
      });
    } else {
      this.destinoService.CadastroDestinos(dadosEnvio).subscribe({
        next: () => {
          alert('Cadastro realizado com sucesso!');
          this.fecharModal.emit();
          this.router.navigate(['/destinos/listar']);
        },
        error: (error) => {
          console.error('Erro ao cadastrar', error);
          alert('Erro ao cadastrar');
        }
      });
    }
  }
}
