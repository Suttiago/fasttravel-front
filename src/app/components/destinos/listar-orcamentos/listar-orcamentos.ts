import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinosService } from '../destinos-service';
import { concatMap } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-listar-orcamentos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-orcamentos.html',
  styleUrls: ['./listar-orcamentos.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ 
        height: '0px', 
        minHeight: '0', 
        display: 'none' 
      })),
      state('expanded', style({ 
        height: '*' 
      })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ListarOrcamentos implements OnInit {
  orcamentos: any[] = [];
  orcamentoExpandido: any | null = null;

  constructor(
    private readonly destinosService: DestinosService,
    private readonly detectorMudanca: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.carregarOrcamentos();
  }

  carregarOrcamentos(): void {
    this.destinosService.ListarOrcamentosPorUser().subscribe({
      next: (lista) => {
        this.orcamentos = (lista || []).map(o => ({ ...o, contas: [], carregandoContas: false }));
        this.detectorMudanca.detectChanges(); 
      },
      error: (err: any) => { 
        console.error('Erro ao listar orçamentos:', err); 
        this.orcamentos = [];
      }
    });
  }

  toggleContas(orcamento: any): void {
    const isExpanding = this.orcamentoExpandido !== orcamento;
    this.orcamentoExpandido = isExpanding ? orcamento : null;

    // --- CORREÇÃO APLICADA AQUI ---
    // A condição "&& orcamento.contas.length === 0" foi removida.
    // Agora, a API será chamada toda vez que o dropdown for expandido.
    if (isExpanding) {
      orcamento.carregandoContas = true;
      this.destinosService.ListarContaPagar(orcamento.id).subscribe({
        next: (contas) => {
          orcamento.contas = contas;
          orcamento.carregandoContas = false;
          this.detectorMudanca.detectChanges();
        },
        error: (err) => {
          console.error(`Erro ao buscar contas do orçamento ${orcamento.id}`, err);
          orcamento.carregandoContas = false;
        }
      });
    }
  }

  aprovar(o: any): void {
    if (!o) return;
    this.destinosService.aceitarDestino(o.destino_id).pipe(
      concatMap(() => this.destinosService.editarOrcamento(o.id, { status: 'Pagamento Pendente' }))
    ).subscribe({
      next: () => {
        alert('Orçamento aprovado com sucesso!');
        this.carregarOrcamentos();
      },
      error: (err) => {
        console.error('Erro no processo de aprovação:', err);
        alert('Ocorreu um erro ao aprovar o orçamento.');
      }
    });
  }

  recusar(o: any): void {
    if (!o) return;
    this.destinosService.recusarDestino(o.destino_id).pipe(
      concatMap(() => this.destinosService.editarOrcamento(o.id, { status: 'Recusado' }))
    ).subscribe({
      next: () => {
        alert('Orçamento recusado com sucesso!');
        this.carregarOrcamentos();
      },
      error: (err) => {
        console.error('Erro no processo de recusa:', err);
        alert('Ocorreu um erro ao recusar o orçamento.');
      }
    });
  }
}

