import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { DestinosService } from '../destinos-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-destino',
  imports: [FormsModule,
    CommonModule,
    NgxMaskDirective
  ],
  templateUrl: './cadastro-destino.html',
  styleUrl: './cadastro-destino.css'
})
export class CadastroDestino {
  @Input() destinoEdicao: any;
  @Output() fecharModal = new EventEmitter<void>();

  id!: string;
  destino!: string;
  check_in!: Date;
  check_out!: string;
  adultos!: Int16Array;
  criancas!: Int16Array;
  status!: string;
  usuario_id!: Int16Array


  constructor(
    private readonly destinoService: DestinosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.destinoEdicao) {
      this.id = this.destinoEdicao.id;
      this.destino = this.destinoEdicao.destino
      this.check_in = this.destinoEdicao.check_in;
      this.check_out = this.destinoEdicao.check_out;
      this.adultos = this.destinoEdicao.adultos;
      this.criancas = this.destinoEdicao.criancas;      
    }
  }

  onSubmit(): void {
    const dadosEnvio = {
      id: this.id,
      destino: this.destino,
      check_in: this.check_in,
      check_out: this.check_out,
      adultos: this.adultos,
      criancas: this.criancas,
    };

    if (this.id) {
      this.destinoService.EditarDestinos(dadosEnvio).subscribe({
        next: (response) => {
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
        next: (response) => {
          console.log('Cadastro realizado com sucesso!', response);
          alert('Cadastro realizado com sucesso!');
          this.fecharModal.emit();
          this.router.navigate(['/dependentes/listar']);
        },
        error: (error) => {
          console.error('Erro ao cadastrar', error);
          alert('Erro ao cadastrar');
        }
      });
    }
  }

}
