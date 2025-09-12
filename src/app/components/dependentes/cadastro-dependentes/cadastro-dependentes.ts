import { Component, EventEmitter, Output } from '@angular/core';
import { DependentesService } from '../dependentes-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { InputMask } from 'primeng/inputmask';
import { NgxMaskConfig, NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FloatLabelModule } from 'primeng/floatlabel';
interface Sexo {
  label: string;
  value: string;
}

@Component({
  selector: 'app-cadastro-dependentes',
  standalone:true,
  imports: [TableModule,ButtonModule,CommonModule, CadastroDependentes,FormsModule,
      DialogModule,InputTextModule,NgxMaskDirective],
  providers:[provideNgxMask()],
  templateUrl: './cadastro-dependentes.html',
  styleUrl: './cadastro-dependentes.css'
})
export class CadastroDependentes {
  @Output() fecharModal = new EventEmitter<void>();

  nome!: string;
  data_nascimento!: string;   
  cpf!: string;
  sexo!: Sexo;

  opcoesSexo: Sexo[] = [
    { label: 'Masculino', value: 'M' },
    { label: 'Feminino', value: 'F' },
    { label: 'Outro', value: 'O' }
  ];

  constructor(
    private readonly dependenteService: DependentesService,
    private router: Router
  ) {}

  onSubmit(): void {
    const dadosCadastro = {
      nome: this.nome,
      data_nascimento: this.data_nascimento,  // já vem YYYY-MM-DD do input date
      cpf: this.cpf,
      sexo: this.sexo
    };

    this.dependenteService.CadastroDependentes(dadosCadastro).subscribe({
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
