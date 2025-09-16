import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CadastroDependentes } from '../../dependentes/cadastro-dependentes/cadastro-dependentes';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DependentesService } from '../../dependentes/dependentes-service';
import { CadastroDestino } from '../cadastro-destino/cadastro-destino';
import { DestinosService } from '../destinos-service';

@Component({
  selector: 'app-listar-destino',
  imports: [ TableModule,
    ButtonModule,
    CommonModule,
    CadastroDestino,
    FormsModule,
    DialogModule,
    InputTextModule],
  templateUrl: './listar-destino.html',
  styleUrl: './listar-destino.css'
})
export class ListarDestino {
  destinos: any[] = [];
  visible: boolean = false;
  modalAberto = false;

  destinoSelecionado: any = null;
  modalEditarAberto = false;

  abrirModal(): void {
    this.modalAberto = true;
  }
  
  fecharModal(): void {
    this.modalAberto = false;
    this.carregarDestinos(); 
  }
  
  abrirModalEdicao(destino: any): void{
    this.destinoSelecionado = {...destino};
    this.modalEditarAberto = true;
  }

  fecharModalEdicao(): void {
    this.modalEditarAberto = false;
    this.destinoSelecionado= null; 
    this.carregarDestinos();
  }


  constructor(
    private readonly destinoteService: DestinosService,
    private readonly detectorMudanca: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarDestinos();
  }

  carregarDestinos(): void {
    this.destinoteService.listarDestinos().subscribe({
      next: (listarDependentes: any[]) => {
        this.destinos = listarDependentes;
        console.log(this.destinos);
        this.detectorMudanca.detectChanges();
      },
      error: error => {
        console.log('erro ao buscar dependentes');
        console.log(error);
      }
    });
  }

  excluirDestinos(id: any): void { 
    if (confirm('Deseja mesmo excluir esse dependente?')) {
      this.destinoteService.ExcluirDestinos(id).subscribe({
        next: () => {
          this.carregarDestinos(); 
          alert('Dependente excluído com sucesso!');
        },
        error: (erro) => {
          console.error('Erro ao excluir dependente:', erro);
          alert('Erro ao excluir dependente.');
        }
      });
    }
  }

  editarDestinos(destino: any): void{
    this.destinoteService.EditarDestinos(destino).subscribe({
      next:(res)=>{
      alert('Dependente atualizado com sucesso!');
      this.modalEditarAberto = false;
      this.carregarDestinos();       
    },
    error:(err)=>{
      console.error('Erro ao editar dependente:', err);
      alert('Erro ao editar dependente.');
    }
    })
  }
}
