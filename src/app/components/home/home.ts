import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DestinosService } from '../destinos/destinos-service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
exportandoPDF = false;

  constructor(private destinosService: DestinosService) {}

  /**
   * Chamado ao clicar no botão 'Gerar Relatório'.
   * Busca o PDF em Base64 da API e inicia o download.
   */
  exportarPDF(): void {
    this.exportandoPDF = true;
    // Garanta que o método 'getRelatorioFinanceiroPDF' existe no seu serviço
    this.destinosService.getRelatorioFinanceiroPDF().subscribe({
      next: (response) => {
        // Cria um link temporário para forçar o download
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${response.pdf_base64}`;
        link.download = `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.exportandoPDF = false;
      },
      error: (err) => {
        console.error('Erro ao exportar PDF:', err);
        alert('Ocorreu um erro ao gerar o PDF.');
        this.exportandoPDF = false;
      }
    });
  }

  exportarPDFDestino(): void {
    this.exportandoPDF = true;
    // Garanta que o método 'getRelatorioFinanceiroPDF' existe no seu serviço
    this.destinosService.getRelatorioDestinoPDF().subscribe({
      next: (response) => {
        // Cria um link temporário para forçar o download
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${response.pdf_base64}`;
        link.download = `relatorio-destino-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.exportandoPDF = false;
      },
      error: (err) => {
        console.error('Erro ao exportar PDF:', err);
        alert('Ocorreu um erro ao gerar o PDF.');
        this.exportandoPDF = false;
      }
    });
  }
}
