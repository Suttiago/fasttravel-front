import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  urlUsuario: string = "http://localhost:5001/Usuario"

  constructor(private httpCliente: HttpClient){}

  listarUsuarios(){
    return this.httpCliente.get<any[]>(`${this.urlUsuario}/Listar`);
  }

  CadastroUsuario(){
    return this.httpCliente.get<any[]>(`${this.urlUsuario}/CadastroUsuario`);
  }
}
