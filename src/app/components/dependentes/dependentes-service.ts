import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DependentesService {
  private urlUsuario: string = "http://localhost:5001/Dependentes";

  constructor(private httpCliente: HttpClient) {}

  listarDependentes(): Observable<any[]> {
    return this.httpCliente.get<any[]>(`${this.urlUsuario}/Listar`);
  }

  CadastroDependentes(pessoa: any): Observable<any> {
    return this.httpCliente.post<any>(`${this.urlUsuario}/CadastroDependentes`, pessoa);
  }

  ExcluirDependentes(id:any):Observable<void>{
    return this.httpCliente.delete<any>(`${this.urlUsuario}/ExcluirDependente/${id}`);
  }

  EditarDependentes(pessoa:any):Observable<any>{
    return this.httpCliente.put<any>(`${this.urlUsuario}/EditarDependente/${pessoa.id}`,pessoa);
  }
}
