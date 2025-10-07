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
    return this.httpCliente.put<any>(`http://localhost:5001/AceitarDest/${destino_id}`, {});
  }

  recusarDestino(destino_id: any): Observable<any> {
    return this.httpCliente.put<any>(`http://localhost:5001/RecusarDest/${destino_id}`, {});
  }
}
