import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { DependentesService } from '../dependentes-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

interface Sexo {
  label: string;
  value: string;
}

@Component({
  selector: 'app-cadastro-dependentes',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()],
  templateUrl: './cadastro-dependentes.html',
  styleUrl: './cadastro-dependentes.css'
})
export class CadastroDependentes implements OnInit {
  @Input() dependenteEdicao: any;
  @Output() fecharModal = new EventEmitter<void>();

  id!: string;
  nome!: string;
  data_nascimento!: string;
  cpf!: string;
  sexo!: Sexo;

  opcoesSexo: Sexo[] = [
    { label: 'Masculino', value: 'Masculino' },
    { label: 'Feminino', value: 'Feminino' },
    { label: 'Outro', value: 'Outro'}
  ];

  constructor(
    private readonly dependenteService: DependentesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.dependenteEdicao) {
      this.id = this.dependenteEdicao.id;
      this.nome = this.dependenteEdicao.nome;
      this.data_nascimento = this.dependenteEdicao.data_nascimento;
      this.cpf = this.dependenteEdicao.cpf;
      this.sexo = this.dependenteEdicao.sexo;
    }
  }

  onSubmit(): void {
    const dadosEnvio = {
      id: this.id,
      nome: this.nome,
      data_nascimento: this.data_nascimento,
      cpf: this.cpf,
      sexo: this.sexo
    };

    if (this.id) {
      this.dependenteService.EditarDependentes(dadosEnvio).subscribe({
        next: (response) => {
          alert('Dependente atualizado com sucesso!');
          this.fecharModal.emit();
        },
        error: (error) => {
          console.error('Erro ao atualizar', error);
          alert('Erro ao atualizar dependente.');
        }
      });
    } else {
      this.dependenteService.CadastroDependentes(dadosEnvio).subscribe({
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