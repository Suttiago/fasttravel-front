import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contas-pagar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './contas-pagar.html',
  styleUrls: ['./contas-pagar.css']
})
export class ContasPagar {
  // componente simples inicial
}
