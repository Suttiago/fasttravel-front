// 1. Importar os itens necessários
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinosService } from '../destinos-service';
import { concatMap } from 'rxjs/operators'; // 2. Importar o operador RxJS que vamos usar

@Component({
  selector: 'app-listar-orcamentos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-orcamentos.html',
  styleUrls: ['./listar-orcamentos.css']
})
export class ListarOrcamentos implements OnInit {
  orcamentos: any[] = [];

  constructor(
    private readonly destinosService: DestinosService,
    private readonly detectorMudanca: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.carregarOrcamentos();
  }

  carregarOrcamentos(): void {
    this.destinosService.ListarOrcamentos().subscribe({
      next: (lista) => {
        this.orcamentos = lista || [];
        // Força a detecção de mudanças, garantindo que a view seja atualizada
        this.detectorMudanca.detectChanges(); 
      },
      error: (err: any) => {
        console.error('Erro ao listar orçamentos:', err);
        this.orcamentos = [];
      }
    });
  }

  aprovar(o: any): void {
    if (!o) return;

    // LÓGICA MELHORADA com o operador concatMap
    this.destinosService.aceitarDestino(o.destino_id).pipe(
      // O 'pipe' nos permite encadear operadores RxJS.
      // concatMap: Espera o primeiro Observable (aceitarDestino) terminar...
      concatMap(() => {
        // ...e então executa o próximo Observable na sequência (editarOrcamento).
        return this.destinosService.editarOrcamento(o.id, { status: 'Aceito' });
      })
    ).subscribe({
      // Apenas UM subscribe no final da cadeia
      next: () => {
        console.log('Orçamento aprovado e status atualizado com sucesso!');
        this.carregarOrcamentos(); // Recarrega a lista
      },
      error: (err: any) => console.error('Ocorreu um erro no processo de aprovação:', err)
    });
  }

  recusar(o: any): void {
    if (!o) return;

    // A mesma lógica de encadeamento para a recusa
    this.destinosService.recusarDestino(o.destino_id).pipe(
      concatMap(() => {
        return this.destinosService.editarOrcamento(o.id, { status: 'Recusado' });
      })
    ).subscribe({
      next: () => {
        console.log('Orçamento recusado e status atualizado com sucesso!');
        this.carregarOrcamentos(); // Recarrega a lista
      },
      error: (err: any) => console.error('Ocorreu um erro no processo de recusa:', err)
    });
  }
}