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
import { Orcamentos } from '../orcamentos/orcamentos';

@Component({
  selector: 'app-listar-destino',
  imports: [ TableModule,
    TableModule,
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

  // Orçamentos
  modalOrcamentosAberto = false;
  totalHoteis: number | null = null;
  totalPassagens: number | null = null;
  totalOrcamento: number | null = null;
  orcamentoAtual: any = null;
  metodoPagamento: string = 'Boleto'; // Valor padrão
  numeroParcelas: number = 1; 
  hoteis:any[] = []
  hoteisSalvos: any[] = []
  carregandoHoteisSalvos = false;
  carregando = false

  passagens:any[] = []
  passagensSalvas: any[] = []
  carregandoPassagensSalvas = false;
  carregandoPassagens = false

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

abrirModalOrcamentos(destino: any): void {
  console.log('abrirModalOrcamentos chamado para destino:', destino);
  this.destinoSelecionado = destino;

  // Calcula o total dos hotéis (sem alteração)
  const totalHoteis = (destino.hoteis || []).reduce((s: number, h: any) => s + (Number(h.hotel_price) || 0), 0);
  this.totalHoteis = totalHoteis || null;

  // --- LÓGICA ATUALIZADA PARA PASSAGENS ---

  // 1. Calcula o número total de pessoas
  // Se adultos ou crianças não forem definidos, considera 0.
  // Se a soma for 0, usa 1 para não zerar o custo da passagem.
  const numeroAdultos = Number(destino.adultos) || 0;
  const numeroCriancas = Number(destino.criancas) || 0;
  const totalPessoas = (numeroAdultos + numeroCriancas) > 0 ? (numeroAdultos + numeroCriancas) : 1;

  // 2. Soma o preço base de todas as passagens
  const somaBasePassagens = (destino.passagens || []).reduce((s: number, p: any) => {
    const val = p.preco_passagem ?? p.price ?? 0;
    return s + (Number(val) || 0);
  }, 0);

  // 3. Multiplica o valor base pelo total de pessoas
  const custoTotalPassagens = somaBasePassagens * totalPessoas;
  this.totalPassagens = (custoTotalPassagens === 0) ? null : custoTotalPassagens;
  
  // --- FIM DA LÓGICA ATUALIZADA ---

  // O orçamento total agora refletirá o novo cálculo das passagens
  this.totalOrcamento = (this.totalHoteis || 0) + (this.totalPassagens || 0);
  
  // Restante da função
  this.orcamentoAtual = null;
  this.modalOrcamentosAberto = true;
  this.detectorMudanca.detectChanges();
}


  onMetodoPagamentoChange(novoMetodo: string): void {
    if (novoMetodo === 'credito') {
      // Se for cartão de crédito, define o valor padrão de parcelas como 8.
      this.numeroParcelas = 8;
    } else {
      // Para qualquer outra opção (Boleto, PIX, etc.), as parcelas são sempre 1.
      this.numeroParcelas = 1;
    }
  }
  onAprovarOrcamento(payload: any): void {
    if (!this.destinoSelecionado) return;
    const destino_id = this.destinoSelecionado.id;
      this.metodoPagamento = payload.metodoPagamento;
      this.numeroParcelas = payload.numeroParcelas;

    const gerarOuEditar = (orcamento: any | null) => {
      if (orcamento && orcamento.id) {
        return this.destinoteService.editarOrcamento(orcamento.id, { status: 'Pagamento pendente' });
      }
      return this.destinoteService.gerarOrcamento(destino_id, 'Aceito');
    };

    this.destinoteService.aceitarDestino(destino_id).subscribe({
      next: () => {
        gerarOuEditar(this.orcamentoAtual).subscribe({
          next: (orcamentoCriado) => {

            const novaContaPagar ={
              valor_total: this.totalOrcamento,
              metodo_pagamento: this.metodoPagamento,
              numero_parcelas: this.numeroParcelas,
              orcamento_id: orcamentoCriado.orcamento.id
            }
            this.destinoteService.GerarContaPagar(novaContaPagar).subscribe({
              next:(contaGerada)=>{
                alert('Destino, orçamento e contas a pagar aceito')
                this.modalOrcamentosAberto = false;
                this.carregarDestinos();
              },
              error:(errConta)=>{
                console.error('Erro ao gerar conta a pagar:', errConta);
                alert('Orçamento aceito, mas falha ao gerar a conta a pagar.');
              }
            })
          },
          error: (err) => {
            console.error('Erro ao criar/atualizar orçamento (aceitar):', err);
            alert('Destino aceito, mas falha ao criar/atualizar orçamento');
            this.modalOrcamentosAberto = false;
            this.carregarDestinos();
          }
        });
      },
      error: (err) => {
        console.error('Erro ao aceitar destino:', err);
        alert('Erro ao aceitar destino');
      }
    });
  }

  onRecusarOrcamento(): void {
    if (!this.destinoSelecionado) return;
    const destinoId = this.destinoSelecionado.id;
    const gerarOuEditar = (orcamento: any | null) => {
      if (orcamento && orcamento.id) {
        return this.destinoteService.editarOrcamento(orcamento.id, { status: 'Recusado' });
      }
      return this.destinoteService.gerarOrcamento(destinoId, 'Recusado');
    };

    this.destinoteService.recusarDestino(destinoId).subscribe({
      next: () => {
        gerarOuEditar(this.orcamentoAtual).subscribe({
          next: (res) => {
            alert('Destino e orçamento recusados com sucesso');
            this.modalOrcamentosAberto = false;
            this.carregarDestinos();
          },
          error: (err) => {
            console.error('Erro ao criar/atualizar orçamento (recusar):', err);
            alert('Destino recusado, mas falha ao criar/atualizar orçamento');
            this.modalOrcamentosAberto = false;
            this.carregarDestinos();
          }
        });
      },
      error: (err) => {
        console.error('Erro ao recusar destino:', err);
        alert('Erro ao recusar destino');
      }
    });
  }

  fecharModalHoteis(): void {
    this.modalHoteisAberto = false;
  }

  fecharModalPassagens(): void {
    this.modalPassagensAberto = false;
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
            error: (err: any) => {
              console.error(`Erro ao buscar hotéis do destino ${destino.id}:`, err);
            }
        });
        this.destinoteService.ListarPassagemsDestino(destino.id).subscribe({
          next: (passagens: any[]) => {
            destino.passagens = passagens;
            this.detectorMudanca.detectChanges();
            },
            error: (err: any) => {
              console.error(`Erro ao buscar passagens do destino ${destino.id}:`, err);
            }
        });
      });

      this.detectorMudanca.detectChanges();
    },
    error: (error: any) => {
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
        this.carregarDestinos()
      },
      error:(err)=>{
        console.error('Erro ao salvar hotel:', err);
        alert('Erro ao salvar hotel.');

     }
   });
 }
buscarPassagens(id: any): void {
    this.destinoteService.BuscarPassagem(id).subscribe({
      next: (res: any) => {
      console.log('Resposta completa da API (passagens):', res);
 // 1. Unificar todos os voos de 'best_flights' e 'other_flights'
      const bestFlights = res.best_flights || [];
      const otherFlights = res.other_flights || [];
      const detailsLink = res.search_metadata?.google_flights_url || null;
      this.passagens = [...bestFlights, ...otherFlights].map((voo: any) => {
 
      voo.link = voo.link || detailsLink;
 
        if (voo.flights && voo.flights.length > 0) {
          const primeiroTrecho = voo.flights[0];
          const ultimoTrecho = voo.flights[voo.flights.length - 1];
          voo.departureCity = primeiroTrecho?.departure_airport?.name;
          voo.arrivalCity = ultimoTrecho?.arrival_airport?.name;
        }
        return voo;
       });
       this.carregandoPassagens = false;
       this.detectorMudanca.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao buscar passagens:', err);
        alert('Erro ao buscar passagens.');
        this.carregandoPassagens = false;
        this.detectorMudanca.detectChanges();
      }});
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
                aviao: primeiroTrecho?.airplane,
                linha_aerea: primeiroTrecho?.airline,
                preco_passagem: voo.price,
                destino_id: destino.id 
              };
              this.destinoteService.SalvarPassagem(passagemSalva).subscribe({
                next: (res) => {
                  alert('Passagem salva com sucesso!');
                  console.log('Passagem salva:', res);
                  this.carregarDestinos()
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
}



