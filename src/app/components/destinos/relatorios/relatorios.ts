import { Component, OnInit } from '@angular/core';
import { DestinosService } from '../destinos-service';

@Component({
  selector: 'app-relatorios',
  imports: [],
  templateUrl: './relatorios.html',
  styleUrl: './relatorios.css'
})
export class Relatorios implements OnInit {
dadosRelatorio: any = null;
  carregando = true;
  exportandoPDF = false;

  constructor(private destinosService: DestinosService) {}

  ngOnInit(): void {
    this.destinosService.getRelatorioFinanceiroPDF().subscribe(dados => {
      this.dadosRelatorio = dados;
      this.carregando = false;
    });
  }

  exportarPDF(): void {
    this.exportandoPDF = true;
    this.destinosService.getRelatorioFinanceiroPDF().subscribe(response => {
      // Cria um link temporário para iniciar o download
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${response.pdf_base64}`;
      link.download = 'relatorio-financeiro.pdf';
      link.click();
      this.exportandoPDF = false;
    });
  }
}

