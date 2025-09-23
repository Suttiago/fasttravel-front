import { Component, OnInit, Input } from '@angular/core';
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
export class Hoteis  {
  @Input() destino: any;
  @Input() hoteis: any[] = [];
  @Input() carregando: boolean = false;

  constructor(private destinosService: DestinosService) {}
}