import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  

  
}
