// Em hoteis.ts

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DestinosService } from '../destinos-service';

@Component({
  selector: 'app-hoteis',
  standalone: true, 
  imports: [CommonModule, TableModule],
  templateUrl: './hoteis.html',
  styleUrl: './hoteis.css'
})
export class Hoteis {
  @Input() destino: any;
  @Input() hoteis: any[] = [];
  @Input() carregando: boolean = false;
  @Output() salvarHotelEvent = new EventEmitter<any>();

    constructor(private destinosService: DestinosService) {}
  
  salvarHotel(hotel: any): void {
    this.salvarHotelEvent.emit({ hotel: hotel, destino: this.destino });
  }
}