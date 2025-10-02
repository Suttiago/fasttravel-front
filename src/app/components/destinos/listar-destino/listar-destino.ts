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
import { Hoteis } from '../hoteis/hoteis';

@Component({
  selector: 'app-listar-destino',
  imports: [ TableModule,
    ButtonModule,
    CommonModule,
    CadastroDestino,
    FormsModule,
    DialogModule,
    InputTextModule,
    Hoteis],
  templateUrl: './listar-destino.html',
  styleUrl: './listar-destino.css'
})
export class ListarDestino {
  destinos: any[] = [];
  visible: boolean = false;
  modalAberto = false;

  destinoSelecionado: any = null;
  modalEditarAberto = false;
  modalHoteisAberto = false;

  hoteis:any[] = []
  hoteisSalvos: any[] = []
  carregandoHoteisSalvos = false;
  carregando = false

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

  abrirModalHoteis(destino: any): void {
    this.carregando = true;
    this.destinoSelecionado = destino;
    this.modalHoteisAberto = true;
    
    // Chamada ao método de busca
    this.buscarHoteis(destino.id);
  }

  fecharModalHoteis(): void {
    this.modalHoteisAberto = false;
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
    next: (listarDestinos: any[]) => {
      this.destinos = listarDestinos;
      this.destinos.forEach(destino => {
        this.destinoteService.ListarHoteisDestino(destino.id).subscribe({
          next: (hoteis: any[]) => {
            destino.hoteis = hoteis; 
            this.detectorMudanca.detectChanges();
          },
          error: err => {
            console.error(`Erro ao buscar hotéis do destino ${destino.id}:`, err);
          }
        });
      });

      this.detectorMudanca.detectChanges();
    },
    error: error => {
      console.log('erro ao buscar destinos', error);
    }
  });
}


  excluirDestinos(id: any): void { 
    if (confirm('Deseja mesmo excluir esse dependente?')) {
      this.destinoteService.ExcluirDestinos(id).subscribe({
        next: () => {
          this.carregarDestinos(); 
          alert('Destino excluído com sucesso!');
        },
        error: (erro) => {
          console.error('Erro ao excluir destino:', erro);
          alert('Erro ao excluir destino.');
        }
      });
    }
  }

  editarDestinos(destino: any): void{
    this.destinoteService.EditarDestinos(destino).subscribe({
      next:(res)=>{
      alert('Destino atualizado com sucesso!');
      this.modalEditarAberto = false;
      this.carregarDestinos();       
    },
    error:(err)=>{
      console.error('Erro ao editar destino:', err);
      alert('Erro ao editar destino.');
    }
    })
  }

buscarHoteis(id: any): void {
    this.destinoteService.BuscarHoteis(id).subscribe({
      next: (res: any) => {
        console.log('Resposta completa da API:', res);

        this.hoteis = res.ads.map((hotel: any) => {
          return {
            name: hotel.name,
            price: hotel.price,
            overall_rating: hotel.overall_rating,
            link: hotel.link || hotel.serpapi_property_details_link,
            thumbnail: hotel.thumbnail,
            amenities: hotel.amenities ? hotel.amenities.join(', ') : 'Não disponível'
          };
        });

        this.carregando = false; 
        this.detectorMudanca.detectChanges()
      },
      error: (err) => {
        console.error('Erro ao buscar hotéis:', err);
        alert('Erro ao buscar hotéis.');
        this.carregando = false; 
        this.detectorMudanca.detectChanges()
      }
    });
  }

  salvarHoteis(hotel: any, destino: any):void {
    let precoLimpo: number = 0;

    if (hotel.extracted_price) {
      precoLimpo = hotel.extracted_price;
    } else if (hotel.price) {
      precoLimpo = parseFloat(hotel.price.replace(/[^\d,.]/g, '').replace(',', '.'));
    }


    const hotelSalvo = {
      hotel : hotel.name,
      hotel_classification: hotel.overall_rating,
      hotel_description : hotel.amenities,
      hotel_price: precoLimpo,
      destino_id: destino.id

    };

    this.destinoteService.SalvarHoteis(hotelSalvo).subscribe({
      next:(res)=>{
        alert('Hotel salvo com sucesso');
        console.log('Hotel salvo', res)
      },
      error:(err)=>{
        console.error('Erro ao salvar hotel:', err);
        alert('Erro ao salvar hotel.');

      }
    });
  }



}

