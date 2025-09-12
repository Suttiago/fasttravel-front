import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DependentesService } from '../dependentes-service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CadastroDependentes } from '../cadastro-dependentes/cadastro-dependentes';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Observable } from 'rxjs'; // Adicione essa importação
import { tap } from 'rxjs/operators'; // Adicione o operador tap

@Component({
  selector: 'app-listar-dependentes',
  imports: [
    TableModule,
    ButtonModule,
    CommonModule,
    CadastroDependentes,
    FormsModule,
    DialogModule,
    InputTextModule
  ],
  standalone: true,
  templateUrl: './listar-dependentes.html',
  styleUrl: './listar-dependentes.css'
})
export class ListarDependentes implements OnInit {
  dependentes: any[] = [];
  visible: boolean = false;
  modalAberto = false;

  dependenteSelecionado: any = null;
  modalEditarAberto = false;

  abrirModal(): void {
    this.modalAberto = true;
  }

  
  fecharModal(): void {
    this.modalAberto = false;
    this.carregarDependentes(); 
  }
  
  abrirModalEdicao(dependente: any): void{
    this.dependenteSelecionado = {...dependente};
    this.modalEditarAberto = true;
  }

  fecharModalEdicao(): void {
    this.modalEditarAberto = false;
    this.dependenteSelecionado = null; 
    this.carregarDependentes();
  }


  constructor(
    private readonly dependenteService: DependentesService,
    private readonly detectorMudanca: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarDependentes();
  }

  carregarDependentes(): void {
    this.dependenteService.listarDependentes().subscribe({
      next: (listarDependentes: any[]) => {
        this.dependentes = listarDependentes;
        console.log(this.dependentes);
        this.detectorMudanca.detectChanges();
      },
      error: error => {
        console.log('erro ao buscar dependentes');
        console.log(error);
      }
    });
  }

  excluirDependente(id: any): void { 
    if (confirm('Deseja mesmo excluir esse dependente?')) {
      this.dependenteService.ExcluirDependentes(id).subscribe({
        next: () => {
          this.carregarDependentes; 
          alert('Dependente excluído com sucesso!');
        },
        error: (erro) => {
          console.error('Erro ao excluir dependente:', erro);
          alert('Erro ao excluir dependente.');
        }
      });
    }
  }

  editarDependente(pessoa: any): void{
    this.dependenteService.EditarDependentes(pessoa).subscribe({
      next:(res)=>{
      alert('Dependente atualizado com sucesso!');
      this.modalEditarAberto = false;
      this.carregarDependentes();       
    },
    error:(err)=>{
      console.error('Erro ao editar dependente:', err);
      alert('Erro ao editar dependente.');
    }
    })
  }
}