import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  urlUsuario: string = "http://localhost:5001/Usuario"

  constructor(private httpCliente: HttpClient){}

  listarUsuarios(){
    return this.httpCliente.get<any[]>(`${this.urlUsuario}/Listar`);
  }

  CadastroUsuario(usuario: any,): Observable<any>{
    return this.httpCliente.post<any[]>(`${this.urlUsuario}/CadastroUsuario`,usuario);
  }

  LoginUsuario(dadosLogin: any): Observable<any>{
    return this.httpCliente.post<any[]>(`${this.urlUsuario}/Login`,dadosLogin);
  }
}
