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
import { Passagens } from '../passagens/passagens';
import { Orcamentos, AprovacaoPayload } from '../orcamentos/orcamentos';
import { concatMap } from 'rxjs';

@Component({
  selector: 'app-listar-destino',
  imports: [ TableModule,
    ButtonModule,
    CommonModule,
    CadastroDestino,
    FormsModule,
    DialogModule,
  InputTextModule,
  Hoteis,
  Passagens,
Orcamentos],
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
  modalPassagensAberto = false;

  hoteis:any[] = []
  hoteisSalvos: any[] = []
  carregandoHoteisSalvos = false;
  carregando = false

  passagens:any[] = []
  passagensSalvas: any[] = []
  carregandoPassagensSalvas = false;
  carregandoPassagens = false

  modalOrcamentosAberto = false;
  totalHoteis: number | null = null;
  totalPassagens: number | null = null;
  totalOrcamento: number | null = null;
  orcamentoAtual: any = null; // Para rastrear se um orçamento já existe
  
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

  abrirModalPassagens(destino: any): void {
    this.carregandoPassagens = true;
    this.destinoSelecionado = destino;
  this.modalPassagensAberto = true;

  this.buscarPassagens(destino.id);
  }

  fecharModalHoteis(): void {
    this.modalHoteisAberto = false;
  }

  fecharModalPassagens(): void {
    this.modalPassagensAberto = false;
  }

  fecharModalOrcamentos(): void {
    this.modalOrcamentosAberto = false;
    this.destinoSelecionado = null;
  }

  abrirModalOrcamentos(destino: any): void {
    this.destinoSelecionado = destino;

    const totalHoteis = (destino.hoteis || []).reduce((s: number, h: any) => s + (Number(h.hotel_price) || 0), 0);
    this.totalHoteis = totalHoteis || null;

    const numeroAdultos = Number(destino.adultos) || 0;
    const numeroCriancas = Number(destino.criancas) || 0;
    const totalPessoas = (numeroAdultos + numeroCriancas) > 0 ? (numeroAdultos + numeroCriancas) : 1;

    const somaBasePassagens = (destino.passagens || []).reduce((s: number, p: any) => {
      const val = p.preco_passagem ?? p.price ?? 0;
      return s + (Number(val) || 0);
    }, 0);

    const custoTotalPassagens = somaBasePassagens * totalPessoas;
    this.totalPassagens = (custoTotalPassagens === 0) ? null : custoTotalPassagens;
    
    this.totalOrcamento = (this.totalHoteis || 0) + (this.totalPassagens || 0);
    
    this.orcamentoAtual = null;
    this.modalOrcamentosAberto = true;
    this.detectorMudanca.detectChanges();
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
        this.destinoteService.ListarPassagemsDestino(destino.id).subscribe({
          next: (passagens: any[]) => {
            destino.passagens = passagens;
            this.detectorMudanca.detectChanges();
          },
          error: err => {
            console.error(`Erro ao buscar passagens do destino ${destino.id}:`, err);
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

        this.hoteis = (res.ads || []).map((hotel: any) => {
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
        this.detectorMudanca.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao buscar hotéis:', err);
        alert('Erro ao buscar hotéis.');
        this.carregando = false;
        this.detectorMudanca.detectChanges();
      }
    });
  }

  buscarPassagens(id: any): void {
    this.destinoteService.BuscarPassagem(id).subscribe({
      next: (res: any) => {
        console.log('Resposta completa da API (passagens):', res);

        if (res && Array.isArray(res.airports)) {
          const link = res.search_metadata?.google_flights_url || res.search_metadata?.json_endpoint || null;
          this.passagens = res.airports.map((route: any) => {
            const dep = route.departure && route.departure[0];
            const arr = route.arrival && route.arrival[0];
            return {
              departureCity: dep?.city || dep?.airport?.name || null,
              arrivalCity: arr?.city || arr?.airport?.name || null,
              departureAirportId: dep?.airport?.id || null,
              arrivalAirportId: arr?.airport?.id || null,
              thumbnail: (arr && arr.thumbnail) || (dep && dep.thumbnail) || null,
              image: (arr && arr.image) || (dep && dep.image) || null,
              link: link,
              raw: route
            };
          });
        } else {
          const items = res.ads || res.results || res.data || [];
          this.passagens = items.map((p: any) => ({
            name: p.name || p.title || p.airline || 'Passagem',
            price: p.price || p.total_price || p.amount || null,
            link: p.link || p.url || null,
            thumbnail: p.thumbnail || null,
            details: p.details || p.description || null,
            raw: p
          }));
        }

        this.carregandoPassagens = false;
        this.detectorMudanca.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao buscar passagens:', err);
        alert('Erro ao buscar passagens.');
        this.carregandoPassagens = false;
        this.detectorMudanca.detectChanges();
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

  salvarPassagem(voo: any, destino: any): void {
    if (!voo || !voo.flights || voo.flights.length === 0) {
      console.error('Objeto de voo inválido fornecido.', voo);
      alert('Não foi possível salvar a passagem. Dados incompletos.');
      return;
    }

    const primeiroTrecho = voo.flights[0];
    const ultimoTrecho = voo.flights[voo.flights.length - 1];

    const passagemSalva = {
      aeroporto_saida: primeiroTrecho?.departure_airport?.name,
      aeroporto_chegada: ultimoTrecho?.arrival_airport?.name,
      duracao_voo: voo.total_duration,
      aviao: primeiroTrecho?.airplane,
      linha_aerea: primeiroTrecho?.airline,
      preco_passagem: voo.price,      
      destino_id: destino.id 
    };

    this.destinoteService.SalvarPassagem(passagemSalva).subscribe({
      next: (res) => {
        alert('Passagem salva com sucesso!');
        console.log('Passagem salva:', res);
      },
      error: (err) => {
        console.error('Erro ao salvar passagem:', err);
        alert('Erro ao salvar passagem.');
      }
    });
  }

  // Compatibilidade com o nome usado no template: delega para salvarPassagem
  salvarPassagens(voo: any, destino: any): void {
    this.salvarPassagem(voo, destino);
  }

 onAprovarOrcamento(payload: any): void { // ALTERAÇÃO: Trocado 'AprovacaoPayload' por 'any' para evitar erro de compilação
    console.log('Payload recebido no evento "aprovado":', payload);

    // Verificação de segurança para garantir que o payload tem a estrutura correta
    if (!payload || typeof payload.metodoPagamento === 'undefined' || typeof payload.numeroParcelas === 'undefined') {
      console.error('Payload inválido recebido. Ação de aprovação abortada.', payload);
      alert('Ocorreu um erro inesperado ao processar a aprovação.');
      return;
    }

    if (!this.destinoSelecionado) return;
    const destinoId = this.destinoSelecionado.id;
    
    // 1ª Chamada: Aceitar o destino
    this.destinoteService.aceitarDestino(destinoId).subscribe({
      next: () => {
        // 2ª Chamada: Gerar o orçamento
        this.destinoteService.gerarOrcamento(destinoId).subscribe({
          next: (respostaApi) => {
            const orcamentoCriado = respostaApi.orcamento;
            if (!orcamentoCriado || !orcamentoCriado.id) {
              console.error('O ID do orçamento não foi retornado pela API.');
              alert('Erro: Falha ao obter dados do orçamento criado.');
              this.fecharModalOrcamentos();
              return;
            }

            // Prepara os dados para a 3ª chamada
            const novaContaPagar = {
              valor_total: this.totalOrcamento,
              metodo_pagamento: payload.metodoPagamento,
              numero_parcelas: payload.numeroParcelas,
              orcamento_id: orcamentoCriado.id
            };

            // 3ª Chamada: Gerar a conta a pagar
            this.destinoteService.GerarContaPagar(novaContaPagar).subscribe({
              next: () => {
                alert('Orçamento aprovado e contas a pagar geradas com sucesso!');
                this.fecharModalOrcamentos();
                this.carregarDestinos();
              },
              error: (errConta) => {
                console.error('Erro ao gerar conta a pagar:', errConta);
                alert('Orçamento aprovado, mas falha ao gerar a conta a pagar.');
                this.fecharModalOrcamentos();
              }
            });
          },
          error: (errOrcamento) => {
            console.error('Erro ao gerar orçamento:', errOrcamento);
            alert('Destino aceito, mas falha ao criar o orçamento.');
            this.fecharModalOrcamentos();
          }
        });
      },
      error: (errDestino) => {
        console.error('Erro ao aceitar destino:', errDestino);
        alert('Ocorreu um erro ao aceitar o destino.');
        this.fecharModalOrcamentos();
      }
    });
  }

onRecusarOrcamento(): void {
    if (!this.destinoSelecionado) return;
    const destinoId = this.destinoSelecionado.id;

    // 1ª Chamada: Recusar o destino
    this.destinoteService.recusarDestino(destinoId).subscribe({
      next: () => {
        // 2ª Chamada: Atualizar o status
        this.destinoteService.recusarDestino('Recusado').subscribe({
          next: () => {
            alert('Destino recusado com sucesso.');
            this.fecharModalOrcamentos();
            this.carregarDestinos();
          },
          error: (err) => {
            console.error('Erro ao atualizar status do destino para recusado:', err);
            alert('Ocorreu um erro ao finalizar a recusa.');
            this.fecharModalOrcamentos();
          }
        });
      },
      error: (err) => {
        console.error('Erro ao recusar destino:', err);
        alert('Ocorreu um erro ao recusar o destino.');
        this.fecharModalOrcamentos();
      }
    });
  }
  


  
}


