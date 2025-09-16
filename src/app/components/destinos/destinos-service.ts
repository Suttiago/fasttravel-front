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
    return this.httpCliente.post<any>(`${this.urlUsuario}/CadastroDestino`, destino);
  }

  ExcluirDestinos(id:any):Observable<void>{
    return this.httpCliente.delete<any>(`${this.urlUsuario}/Excluirdestino/${id}`);
  }

  EditarDestinos(destino:any):Observable<any>{
    return this.httpCliente.put<any>(`${this.urlUsuario}/EditarDestino/${destino.id}`,destino);
  }
  
}
