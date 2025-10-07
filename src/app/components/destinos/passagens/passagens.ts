import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DestinosService } from '../destinos-service';

@Component({
  selector: 'app-passagens',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './passagens.html',
  styleUrl: './passagens.css'
})
export class Passagens {
  @Input() destino: any;
  @Input() passagens: any[] = [];
  @Input() carregando: boolean = false;
  @Output() salvarPassagemEvent = new EventEmitter<any>();

  constructor(private destinosService: DestinosService) {}

  salvarPassagem(passagem: any): void {
    this.salvarPassagemEvent.emit({ passagem: passagem, destino: this.destino });
  }

}
