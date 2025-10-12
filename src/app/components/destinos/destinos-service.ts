import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DestinosService {
  private urlUsuario: string = "http://localhost:5001/Destinos";

  constructor(private httpCliente: HttpClient) {}

  listarDestinos(): Observable<any[]> {
    return this.httpCliente.get<any[]>(`${this.urlUsuario}/Listar`);
  }

  CadastroDestinos(destino: any): Observable<any> {
    return this.httpCliente.post<any>(`${this.urlUsuario}/Cadastro`, destino);
  }

  ExcluirDestinos(id:any):Observable<void>{
    return this.httpCliente.delete<any>(`${this.urlUsuario}/Excluir/${id}`);
  }

  EditarDestinos(destino:any):Observable<any>{
    return this.httpCliente.put<any>(`${this.urlUsuario}/Editar/${destino.id}`,destino);
  }

  BuscarHoteis(id:any):Observable<any>{
    return this.httpCliente.post<any>(`http://localhost:5001/BuscarHoteis/${id}`,id);
  }

  SalvarHoteis(hotel:any):Observable<any>{
    return this.httpCliente.post<any>(`http://localhost:5001/SalvarHoteis`,hotel);
  }
  
  ListarHoteisDestino(destino_id: any): Observable<any>{
    return this.httpCliente.get<any>(`http://localhost:5001/ListarHoteisPorDestino/${destino_id}`,)
  }

  ListarCidades(termo: string): Observable<any[]> {

    if (!termo.trim()) {
      return of([]);
    }
    const params = new HttpParams().set('termo', termo);
    return this.httpCliente.get<any[]>(`http://localhost:5001/Cidades/Listar`,{params});
  }

  BuscarPassagem(id:any):Observable<any>{
    return this.httpCliente.post<any>(`http://localhost:5001/BuscarPassagens/${id}`,id);
  }

  SalvarPassagem(passagem:any):Observable<any>{
    return this.httpCliente.post<any>(`http://localhost:5001/SalvarPassagens`,passagem);
  }
  
  ListarPassagemsDestino(destino_id: any): Observable<any>{
    return this.httpCliente.get<any>(`http://localhost:5001/ListarPassagensPorDestino/${destino_id}`,)
  }
  
  aceitarDestino(destino_id: any): Observable<any> {
    return this.httpCliente.put<any>(`${this.urlUsuario}/AceitarDest/${destino_id}`, {});
  }

  recusarDestino(destino_id: any): Observable<any> {
    return this.httpCliente.put<any>(`${this.urlUsuario}/RecusarDest/${destino_id}`, {});
  }

  gerarOrcamento(destino_id: any, status?: string): Observable<any> {
    const body: any = {};
    if (status) {
      body.status = status;
    }
    return this.httpCliente.post<any>(`http://localhost:5001/Orcamento/GerarOrcamento/${destino_id}`, body);
  }

  editarOrcamento(orcamento_id: any, payload: any): Observable<any> {
    return this.httpCliente.put<any>(`http://localhost:5001/Orcamento/Editar/${orcamento_id}`, payload);
  }

  ListarOrcamentos(): Observable<any[]> {
    return this.httpCliente.get<any[]>(`http://localhost:5001/Orcamento/Listar`);
  }

  ListarOrcamentosPorDestino(destino_id: any): Observable<any[]> {
    return this.httpCliente.get<any[]>(`http://localhost:5001/Orcamento/ListarPorDestino/${destino_id}`);
  }

  GerarContaPagar(ContaPagar: any): Observable<any[]>{
    return this.httpCliente.post<any>(`http://localhost:5001/Contas/CadastrarContas`,ContaPagar)
  }
  
}
